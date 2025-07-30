import { db } from './firebase';
import { collection, doc, getDoc, setDoc, Timestamp, enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.error('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.error('The current browser does not support all of the features required to enable persistence');
  } else {
    console.error('Error enabling persistence:', err);
  }
});

export interface UserStreak {
  userId: string;
  currentStreak: number;
  highestStreak: number;
  lastLogin: Timestamp;
}

interface QueuedLogin {
  timestamp: number; 
}

const getLocalStreak = (userId: string): UserStreak | null => {
  try {
    const streakData = localStorage.getItem(`streak_${userId}`);
    if (streakData) {
      const parsed = JSON.parse(streakData);
      return {
        userId,
        currentStreak: parsed.currentStreak || 0,
        highestStreak: parsed.highestStreak || 0,
        lastLogin: parsed.lastLogin ? Timestamp.fromMillis(parsed.lastLogin) : Timestamp.now(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error reading streak from localStorage:', error);
    return null;
  }
};

const setLocalStreak = (streak: UserStreak): void => {
  try {
    const dataToStore = {
      userId: streak.userId,
      currentStreak: streak.currentStreak,
      highestStreak: streak.highestStreak,
      lastLogin: streak.lastLogin.toMillis(),
    };
    localStorage.setItem(`streak_${streak.userId}`, JSON.stringify(dataToStore));
  } catch (error) {
    console.error('Error writing streak to localStorage:', error);
  }
};

const getQueuedLogins = (userId: string): QueuedLogin[] => {
  try {
    const queuedData = localStorage.getItem(`queued_logins_${userId}`);
    return queuedData ? JSON.parse(queuedData) : [];
  } catch (error) {
    console.error('Error reading queued logins from localStorage:', error);
    return [];
  }
};


const setQueuedLogins = (userId: string, logins: QueuedLogin[]): void => {
  try {
    localStorage.setItem(`queued_logins_${userId}`, JSON.stringify(logins));
  } catch (error) {
    console.error('Error writing queued logins to localStorage:', error);
  }
};


const calculateStreakFromLogins = (loginDates: Timestamp[]): { currentStreak: number; highestStreak: number; lastLogin: Timestamp } => {
  if (loginDates.length === 0) {
    return { currentStreak: 0, highestStreak: 0, lastLogin: Timestamp.now() };
  }

  const sortedDates = loginDates
    .map((ts) => new Date(ts.toMillis()))
    .sort((a, b) => b.getTime() - a.getTime());

  let currentStreak = 1;
  let highestStreak = 1;
  let currentDate = new Date(sortedDates[0]);
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i]);
    prevDate.setHours(0, 0, 0, 0);
    const diffDays = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentStreak++;
      if (currentStreak > highestStreak) {
        highestStreak = currentStreak;
      }
    } else if (diffDays > 1) {
      break; 
    }
    currentDate = prevDate;
  }

  return {
    currentStreak,
    highestStreak,
    lastLogin: Timestamp.fromDate(sortedDates[0]),
  };
};

export const getUserStreak = async (userId: string): Promise<UserStreak> => {
  try {
    const streakRef = doc(db, 'streaks', userId);
    const streakSnap = await getDoc(streakRef);
    const isFromCache = streakSnap.metadata.fromCache;
    let streakData: UserStreak;

    if (streakSnap.exists()) {
      const data = streakSnap.data();
      streakData = {
        userId,
        currentStreak: data.currentStreak || 0,
        highestStreak: data.highestStreak || 0,
        lastLogin: data.lastLogin || Timestamp.now(),
      };
      setLocalStreak(streakData);
      console.log(`Streak data retrieved from ${isFromCache ? 'Firestore cache' : 'Firestore server'}`);
      return streakData;
    }

    // Check for queued logins
    const queuedLogins = getQueuedLogins(userId);
    if (queuedLogins.length > 0) {
      const loginTimestamps = queuedLogins.map((login) => Timestamp.fromMillis(login.timestamp));
      streakData = {
        userId,
        ...calculateStreakFromLogins(loginTimestamps),
      };
      setLocalStreak(streakData);
      console.log('Streak data calculated from queued logins in localStorage');
      return streakData;
    }

    // Fall back to localStorage streak
    const localStreak = getLocalStreak(userId);
    if (localStreak) {
      console.log('Streak data retrieved from localStorage (Firestore empty)');
      return localStreak;
    }

    // Default streak if no data
    streakData = {
      userId,
      currentStreak: 0,
      highestStreak: 0,
      lastLogin: Timestamp.now(),
    };
    setLocalStreak(streakData);
    console.log('Initialized default streak in localStorage');
    return streakData;
  } catch (error) {
    console.error('Error getting user streak from Firestore:', error);
    // Fall back to queued logins
    const queuedLogins = getQueuedLogins(userId);
    if (queuedLogins.length > 0) {
      const loginTimestamps = queuedLogins.map((login) => Timestamp.fromMillis(login.timestamp));
      const streakData = {
        userId,
        ...calculateStreakFromLogins(loginTimestamps),
      };
      setLocalStreak(streakData);
      console.log('Using streak from queued logins due to Firestore error');
      return streakData;
    }

    // Fall back to localStorage streak
    const localStreak = getLocalStreak(userId);
    if (localStreak) {
      console.log('Using streak from localStorage due to Firestore error');
      return localStreak;
    }

    // Default streak
    const defaultStreak = {
      userId,
      currentStreak: 0,
      highestStreak: 0,
      lastLogin: Timestamp.now(),
    };
    setLocalStreak(defaultStreak);
    console.log('Using default streak due to Firestore and localStorage failure');
    throw new Error(`Failed to get user streak: ${error.message}. Using default values.`);
  }
};

/**
 * Update a user's streak based on their login, queuing if Firebase fails
 */
export const updateUserStreak = async (userId: string): Promise<UserStreak> => {
  try {
    const streakRef = doc(db, 'streaks', userId);
    const currentTime = Timestamp.now();
    const currentDate = new Date(currentTime.toMillis());
    currentDate.setHours(0, 0, 0, 0);

    // Get current streak data
    const currentStreakData = await getUserStreak(userId);
    const lastLoginDate = new Date(currentStreakData.lastLogin.toMillis());
    lastLoginDate.setHours(0, 0, 0, 0);

    // Calculate difference in days
    const diffTime = currentDate.getTime() - lastLoginDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    let newStreak = currentStreakData.currentStreak;
    let newHighestStreak = currentStreakData.highestStreak;

    if (diffDays > 1) {
      newStreak = 1; // Reset streak
    } else if (diffDays === 1) {
      newStreak = currentStreakData.currentStreak + 1; // Increment streak
    } else if (diffDays === 0) {
      newStreak = currentStreakData.currentStreak; // Same day, no change
    }

    if (newStreak > newHighestStreak) {
      newHighestStreak = newStreak;
    }

    const updatedStreak: UserStreak = {
      userId,
      currentStreak: newStreak,
      highestStreak: newHighestStreak,
      lastLogin: currentTime,
    };

    // Update localStorage
    setLocalStreak(updatedStreak);

    // Try to update Firestore
    if (navigator.onLine) {
      // Sync any queued logins first
      const queuedLogins = getQueuedLogins(userId);
      if (queuedLogins.length > 0) {
        const loginTimestamps = [...queuedLogins.map((login) => Timestamp.fromMillis(login.timestamp)), currentTime];
        const syncedStreak = {
          userId,
          ...calculateStreakFromLogins(loginTimestamps),
        };
        await setDoc(streakRef, syncedStreak);
        setLocalStreak(syncedStreak);
        setQueuedLogins(userId, []); // Clear queue
        console.log('Synced queued logins and current login to Firestore');
        return syncedStreak;
      }

      // Update Firestore with current streak
      await setDoc(streakRef, updatedStreak);
      console.log('Streak updated in Firestore and localStorage');
      return updatedStreak;
    } else {
      // Queue login if offline
      const queuedLogins = getQueuedLogins(userId);
      queuedLogins.push({ timestamp: currentTime.toMillis() });
      setQueuedLogins(userId, queuedLogins);
      console.log('Offline: Login queued in localStorage, Firestore write pending');
      return updatedStreak;
    }
  } catch (error) {
    console.error('Error updating user streak in Firestore:', error);
    // Queue login if Firestore fails
    const queuedLogins = getQueuedLogins(userId);
    queuedLogins.push({ timestamp: Timestamp.now().toMillis() });
    setQueuedLogins(userId, queuedLogins);

    // Calculate streak from queued logins
    const loginTimestamps = queuedLogins.map((login) => Timestamp.fromMillis(login.timestamp));
    const fallbackStreak = {
      userId,
      ...calculateStreakFromLogins(loginTimestamps),
    };
    setLocalStreak(fallbackStreak);
    console.log('Firestore failed: Login queued in localStorage, using calculated streak');
    throw new Error(`Failed to update streak in Firestore: ${error.message}. Login queued locally.`);
  }
};