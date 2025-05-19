import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export const updateOldSongs = async () => {
  try {
    const songsRef = collection(db, 'songs');
    const querySnapshot = await getDocs(songsRef);
    
    const updatePromises = querySnapshot.docs.map(async (doc) => {
      const songData = doc.data();
      
      // Kiểm tra nếu là bài hát cũ (không có userId hoặc status)
      if (!songData.userId || !songData.status) {
        const updates = {
          status: 'approved', // Mặc định là approved cho bài cũ
          userId: songData.userId || 'xKJ5khwgbUerfJaZZCMQbLgPwSE2', // Nếu không có userId, gán cho admin
          updatedAt: new Date()
        };
        
        await updateDoc(doc.ref, updates);
        console.log(`Updated song: ${doc.id}`);
      }
    });
    
    await Promise.all(updatePromises);
    console.log('All old songs have been updated successfully!');
  } catch (error) {
    console.error('Error updating old songs:', error);
  }
};