import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function getRecentTours() {
  try {
    const collectionRef = collection(db, "tours");
    const q = query(
      collectionRef,
      orderBy('basicInfo.createdAt', 'desc'), // Ensure your documents have a 'createdAt' timestamp
      limit(3)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching recent documents:', error);
    throw error; // Re-throw for error handling upstream
  }
}