import { collection, addDoc, doc, getDoc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export const saveInterview = async (interviewData) => {
  try {
    const docRef = await addDoc(collection(db, 'interviews'), interviewData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving interview:', error);
    throw error;
  }
};

export const getInterview = async (interviewId) => {
  try {
    const docRef = doc(db, 'interviews', interviewId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Interview not found');
    }
  } catch (error) {
    console.error('Error getting interview:', error);
    throw error;
  }
};

export const getAllInterviews = async () => {
  try {
    const interviewsRef = collection(db, 'interviews');
    const querySnapshot = await getDocs(interviewsRef);
    const interviews = [];
    querySnapshot.forEach((doc) => {
      interviews.push({ id: doc.id, ...doc.data() });
    });
    interviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return interviews;
  } catch (error) {
    console.error('Error fetching interviews:', error);
    throw error;
  }
};

export const updateInterview = async (interviewId, interviewData) => {
  try {
    const docRef = doc(db, 'interviews', interviewId);
    await updateDoc(docRef, interviewData);
  } catch (error) {
    console.error('Error updating interview:', error);
    throw error;
  }
};
