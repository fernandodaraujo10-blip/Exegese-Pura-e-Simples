import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    query,
    getDocs,
    where,
    orderBy,
    limit,
    addDoc,
    serverTimestamp
} from "firebase/firestore";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";
import { UserProfile, AdminConfig, INITIAL_ADMIN_CONFIG } from "../core/types";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// --- Auth Helpers ---
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

// --- User Profile Helpers ---
export const saveUserProfile = async (userId: string, profile: UserProfile) => {
    await setDoc(doc(db, "users", userId), profile, { merge: true });
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as UserProfile : null;
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
    const q = query(collection(db, "users"), orderBy("registrationDate", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as UserProfile);
};

// --- Admin Config Helpers ---
export const saveAdminConfig = async (config: AdminConfig) => {
    await setDoc(doc(db, "config", "app"), config);
};

export const getAdminConfig = async (): Promise<AdminConfig> => {
    const docRef = doc(db, "config", "app");
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as AdminConfig : INITIAL_ADMIN_CONFIG;
};

// --- Storage Helpers ---
export const uploadLogo = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `assets/logo_${Date.now()}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
};

// --- Community Helpers ---
export interface SharedStudy {
    id?: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    reference: string;
    theology: string;
    content: string;
    timestamp: any;
    likes: number;
}

export const shareStudy = async (study: Omit<SharedStudy, 'timestamp' | 'likes'>) => {
    await addDoc(collection(db, "shared_studies"), {
        ...study,
        timestamp: serverTimestamp(),
        likes: 0
    });
};

export const getSharedStudies = async (limitNum: number = 20): Promise<SharedStudy[]> => {
    const q = query(collection(db, "shared_studies"), orderBy("timestamp", "desc"), limit(limitNum));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SharedStudy));
};

export default app;
