import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, onSnapshot, Timestamp, addDoc } from 'firebase/firestore';

export interface SavedMachine {
  id: string;
  userId: string;
  title: string;
  description?: string;
  machineType: string;
  machineUrl: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MachineData {
  title: string;
  description?: string;
  machineType: string;
  machineUrl: string;
  userId: string;
}

/**
 * Get all machines for a specific user
 */
export const getUserMachines = async (userId: string): Promise<SavedMachine[]> => {
  try {
    const machinesRef = collection(db, 'machines');
    const q = query(machinesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const machines: SavedMachine[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      machines.push({
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        machineType: data.machineType,
        machineUrl: data.machineUrl,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });
    
    return machines;
  } catch (error) {
    console.error('Error getting user machines:', error);
    throw new Error(`Failed to get user machines: ${error}`);
  }
};

/**
 * Listen to real-time updates for user machines
 */
export const listenToUserMachines = (
  userId: string, 
  callback: (machines: SavedMachine[]) => void
): (() => void) => {
  try {
    const machinesRef = collection(db, 'machines');
    const q = query(machinesRef, where('userId', '==', userId));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const machines: SavedMachine[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        machines.push({
          id: doc.id,
          userId: data.userId,
          title: data.title,
          description: data.description,
          machineType: data.machineType,
          machineUrl: data.machineUrl,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      });
      
      // Sort by creation date (newest first)
      machines.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
      
      callback(machines);
    }, (error) => {
      console.error('Error listening to user machines:', error);
      // Call callback with empty array on error
      callback([]);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up machines listener:', error);
    throw new Error(`Failed to set up machines listener: ${error}`);
  }
};

/**
 * Save a new machine
 */
export const saveMachine = async (machineData: MachineData): Promise<string> => {
  try {
    const machinesRef = collection(db, 'machines');
    const now = Timestamp.now();
    
    const docRef = await addDoc(machinesRef, {
      ...machineData,
      createdAt: now,
      updatedAt: now,
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving machine:', error);
    throw new Error(`Failed to save machine: ${error}`);
  }
};

/**
 * Update an existing machine
 */
export const updateMachine = async (machineId: string, updates: Partial<MachineData>): Promise<void> => {
  try {
    const machineRef = doc(db, 'machines', machineId);
    await setDoc(machineRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error('Error updating machine:', error);
    throw new Error(`Failed to update machine: ${error}`);
  }
};

/**
 * Delete a machine
 */
export const deleteMachine = async (machineId: string): Promise<void> => {
  try {
    const machineRef = doc(db, 'machines', machineId);
    await deleteDoc(machineRef);
  } catch (error) {
    console.error('Error deleting machine:', error);
    throw new Error(`Failed to delete machine: ${error}`);
  }
};

/**
 * Get a specific machine by ID
 */
export const getMachine = async (machineId: string): Promise<SavedMachine | null> => {
  try {
    const machineRef = doc(db, 'machines', machineId);
    const machineSnap = await getDoc(machineRef);
    
    if (machineSnap.exists()) {
      const data = machineSnap.data();
      return {
        id: machineSnap.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        machineType: data.machineType,
        machineUrl: data.machineUrl,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting machine:', error);
    throw new Error(`Failed to get machine: ${error}`);
  }
};
