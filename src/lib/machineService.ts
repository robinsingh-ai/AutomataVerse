import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, DocumentData, orderBy, onSnapshot } from 'firebase/firestore';

export interface SavedMachine {
  id?: string;
  userId: string;
  title: string;
  description: string;
  machineUrl: string;
  machineType: string;
  createdAt: Timestamp;
}

/**
 * Save a machine to Firebase
 */
export const saveMachine = async (machine: Omit<SavedMachine, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'machines'), {
      ...machine,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving machine:', error);
    throw new Error('Failed to save machine');
  }
};

/**
 * Get all machines for a specific user
 */
export const getUserMachines = async (userId: string): Promise<SavedMachine[]> => {
  try {
    const machinesRef = collection(db, 'machines');
    // Create a query that works without a composite index
    const q = query(
      machinesRef, 
      where('userId', '==', userId)
      // Removed orderBy to avoid requiring composite index
    );
    
    const querySnapshot = await getDocs(q);
    const machines: SavedMachine[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      machines.push({
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        machineUrl: data.machineUrl,
        machineType: data.machineType,
        createdAt: data.createdAt
      });
    });
    
    // Sort locally instead of in the query
    machines.sort((a, b) => {
      // Make sure createdAt is a Timestamp object and can be compared
      if (a.createdAt && b.createdAt) {
        return b.createdAt.toMillis() - a.createdAt.toMillis(); // descending order
      }
      return 0;
    });
    
    return machines;
  } catch (error) {
    console.error('Error getting user machines:', error);
    throw new Error('Failed to get user machines');
  }
};

/**
 * Listen to user machines in real-time
 * @param userId - The user ID to get machines for
 * @param callback - Function to call when machines update
 * @returns A function that unsubscribes the listener
 */
export const listenToUserMachines = (
  userId: string, 
  callback: (machines: SavedMachine[]) => void
): (() => void) => {
  const machinesRef = collection(db, 'machines');
  
  // Create a query that works without a composite index
  // Just filter by userId without ordering for now
  const q = query(
    machinesRef, 
    where('userId', '==', userId)
    // Removed orderBy to avoid requiring composite index
  );
  
  // Set up the listener
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const machines: SavedMachine[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      machines.push({
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        machineUrl: data.machineUrl,
        machineType: data.machineType,
        createdAt: data.createdAt
      });
    });
    
    // Sort locally instead of in the query
    machines.sort((a, b) => {
      // Make sure createdAt is a Timestamp object and can be compared
      if (a.createdAt && b.createdAt) {
        return b.createdAt.toMillis() - a.createdAt.toMillis(); // descending order
      }
      return 0;
    });
    
    // Call the callback with the updated machines
    callback(machines);
  }, (error) => {
    console.error('Error listening to user machines:', error);
    
    // Fallback to one-time fetch if listener fails
    getUserMachines(userId)
      .then(machines => {
        // Sort locally
        machines.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.toMillis() - a.createdAt.toMillis();
          }
          return 0;
        });
        callback(machines);
      })
      .catch(err => console.error('Fallback fetch also failed:', err));
  });
  
  // Return the unsubscribe function
  return unsubscribe;
}; 