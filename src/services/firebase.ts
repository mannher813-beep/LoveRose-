import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  orderBy, 
  onSnapshot,
  updateDoc
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { UserProfile, Like, Match, Message } from '../types';
import { INITIAL_PROFILES } from './mockData';

// Safe extraction from generated config file
let firebaseConfig: any = null;
try {
  // Try loading from client side metadata
  firebaseConfig = {
    apiKey: "AIzaSyCZTZAfztB4wCEKoxDo6GFBXa2pJGKoDKk",
    authDomain: "data-snow-bcvp7.firebaseapp.com",
    projectId: "data-snow-bcvp7",
    storageBucket: "data-snow-bcvp7.firebasestorage.app",
    messagingSenderId: "210131595135",
    appId: "1:210131595135:web:006c57dc08a4655960b44a"
  };
} catch (e) {
  console.warn("Could not load static config, falling back to local storage environment", e);
}

// Check if Firebase can be initialized
let app: any = null;
let firestore: any = null;
let auth: any = null;
let useMock = true;

if (firebaseConfig && firebaseConfig.apiKey) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    firestore = getFirestore(app);
    auth = getAuth(app);
    useMock = false;
    console.log("Firebase initialized successfully in LoveRose");
  } catch (err) {
    console.error("Firebase connection error. Falling back to robust offline localStorage engine.", err);
    useMock = true;
  }
} else {
  console.log("No Firebase config found. Initializing offline localStorage mock database.");
  useMock = true;
}

// Ensure local storage has basic structure
const initLocalStorage = () => {
  if (!localStorage.getItem('loverose_profiles')) {
    localStorage.setItem('loverose_profiles', JSON.stringify(INITIAL_PROFILES));
  }
  if (!localStorage.getItem('loverose_likes')) {
    localStorage.setItem('loverose_likes', JSON.stringify([]));
  }
  if (!localStorage.getItem('loverose_matches')) {
    localStorage.setItem('loverose_matches', JSON.stringify([]));
  }
  if (!localStorage.getItem('loverose_messages')) {
    localStorage.setItem('loverose_messages', JSON.stringify([]));
  }
};
initLocalStorage();

// Standard helper for random ID
const uuid = () => Math.random().toString(36).substring(2, 15);

export const dbService = {
  isMockEnabled: () => useMock,

  // --- Profiles ---
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!useMock && firestore) {
      try {
        const docRef = doc(firestore, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data() as UserProfile;
        }
      } catch (e) {
        console.error("Firestore getUserProfile error, reading localStorage", e);
      }
    }
    // Mock / Fallback
    const profiles = JSON.parse(localStorage.getItem('loverose_profiles') || '[]');
    return profiles.find((p: UserProfile) => p.uid === uid) || null;
  },

  async saveUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
    if (!useMock && firestore) {
      try {
        const docRef = doc(firestore, 'users', uid);
        await setDoc(docRef, profile, { merge: true });
        return;
      } catch (e) {
        console.error("Firestore saveUserProfile error, writing localStorage", e);
      }
    }
    // Mock / Fallback
    const profiles = JSON.parse(localStorage.getItem('loverose_profiles') || '[]');
    const index = profiles.findIndex((p: UserProfile) => p.uid === uid);
    if (index > -1) {
      profiles[index] = { ...profiles[index], ...profile };
    } else {
      profiles.push({ uid, isPremium: false, dailyLikesLeft: 10, lastLikeReset: new Date().toISOString(), ...profile });
    }
    localStorage.setItem('loverose_profiles', JSON.stringify(profiles));
  },

  async getDiscoverableProfiles(currentUser: UserProfile): Promise<UserProfile[]> {
    if (!useMock && firestore) {
      try {
        // Query users compatible with preference
        const usersRef = collection(firestore, 'users');
        const q = currentUser.searchGender === 'tous' 
          ? query(usersRef, where('uid', '!=', currentUser.uid))
          : query(usersRef, where('gender', '==', currentUser.searchGender), where('uid', '!=', currentUser.uid));
          
        const querySnapshot = await getDocs(q);
        const allProfiles: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          allProfiles.push(doc.data() as UserProfile);
        });

        // Fetch user's swipes to exclude already swiped
        const likesRef = collection(firestore, 'likes');
        const swipedQuery = query(likesRef, where('fromUserId', '==', currentUser.uid));
        const swipedSnap = await getDocs(swipedQuery);
        const swipedIds = new Set<string>();
        swipedSnap.forEach(doc => {
          swipedIds.add((doc.data() as Like).toUserId);
        });

        return allProfiles.filter(p => !swipedIds.has(p.uid));
      } catch (e) {
        console.error("Firestore getDiscoverableProfiles error, using localStorage", e);
      }
    }

    // Mock / Fallback
    const profiles: UserProfile[] = JSON.parse(localStorage.getItem('loverose_profiles') || '[]');
    const likes: Like[] = JSON.parse(localStorage.getItem('loverose_likes') || '[]');
    
    // Exclude current user and already swiped profiles
    const swipedIds = new Set(likes.filter(l => l.fromUserId === currentUser.uid).map(l => l.toUserId));
    
    return profiles.filter(p => {
      if (p.uid === currentUser.uid) return false;
      if (swipedIds.has(p.uid)) return false;
      
      // Filter by preference
      if (currentUser.searchGender !== 'tous' && p.gender !== currentUser.searchGender) return false;
      
      return true;
    });
  },

  // --- Swipes & Matching ---
  async swipe(fromUserId: string, toUserId: string, type: 'like' | 'pass' | 'superlike'): Promise<{ isMatch: boolean; matchId?: string }> {
    const like: Like = {
      id: uuid(),
      fromUserId,
      toUserId,
      type,
      timestamp: new Date().toISOString()
    };

    if (!useMock && firestore) {
      try {
        // Save like
        await setDoc(doc(firestore, 'likes', like.id), like);

        // Check for inverse like
        if (type === 'like' || type === 'superlike') {
          const likesRef = collection(firestore, 'likes');
          const q = query(likesRef, where('fromUserId', '==', toUserId), where('toUserId', '==', fromUserId));
          const querySnapshot = await getDocs(q);
          
          let hasInverseLike = false;
          querySnapshot.forEach(doc => {
            const val = doc.data() as Like;
            if (val.type === 'like' || val.type === 'superlike') {
              hasInverseLike = true;
            }
          });

          if (hasInverseLike) {
            const matchId = [fromUserId, toUserId].sort().join('_');
            const match: Match = {
              id: matchId,
              users: [fromUserId, toUserId],
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(firestore, 'matches', matchId), match);
            return { isMatch: true, matchId };
          }
        }
        return { isMatch: false };
      } catch (e) {
        console.error("Firestore swipe error, performing locally", e);
      }
    }

    // Mock / Fallback
    const likes: Like[] = JSON.parse(localStorage.getItem('loverose_likes') || '[]');
    likes.push(like);
    localStorage.setItem('loverose_likes', JSON.stringify(likes));

    // Check match
    if (type === 'like' || type === 'superlike') {
      const targetLikes = likes.filter(l => l.fromUserId === toUserId && l.toUserId === fromUserId && (l.type === 'like' || l.type === 'superlike'));
      if (targetLikes.length > 0) {
        const matchId = [fromUserId, toUserId].sort().join('_');
        const matches: Match[] = JSON.parse(localStorage.getItem('loverose_matches') || '[]');
        
        // Prevent duplicate matches
        if (!matches.some(m => m.id === matchId)) {
          const newMatch: Match = {
            id: matchId,
            users: [fromUserId, toUserId],
            createdAt: new Date().toISOString(),
            lastMessage: "Félicitations, vous avez matché ! Envoyez un premier message.",
            lastMessageAt: new Date().toISOString()
          };
          matches.push(newMatch);
          localStorage.setItem('loverose_matches', JSON.stringify(matches));
          return { isMatch: true, matchId };
        }
      }
    }

    return { isMatch: false };
  },

  // --- Matches list ---
  async getMatches(userId: string): Promise<Match[]> {
    if (!useMock && firestore) {
      try {
        const matchesRef = collection(firestore, 'matches');
        const q = query(matchesRef, where('users', 'array-contains', userId));
        const querySnapshot = await getDocs(q);
        const matches: Match[] = [];
        querySnapshot.forEach(doc => {
          matches.push(doc.data() as Match);
        });
        return matches;
      } catch (e) {
        console.error("Firestore getMatches error, fetching local storage", e);
      }
    }

    const matches: Match[] = JSON.parse(localStorage.getItem('loverose_matches') || '[]');
    return matches.filter(m => m.users.includes(userId));
  },

  // --- Messaging ---
  listenToMessages(conversationId: string, callback: (messages: Message[]) => void): () => void {
    if (!useMock && firestore) {
      try {
        const msgsRef = collection(firestore, 'conversations', conversationId, 'messages');
        const q = query(msgsRef, orderBy('createdAt', 'asc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const msgs: Message[] = [];
          snapshot.forEach((doc) => {
            msgs.push(doc.data() as Message);
          });
          callback(msgs);
        }, (err) => {
          console.error("Realtime firestore listener err", err);
        });
        return unsubscribe;
      } catch (e) {
        console.error("Failed to setup realtime listener. Fallback to interval polling.", e);
      }
    }

    // Local Storage Mock Listening (polling representation / interval)
    const loadMessages = () => {
      const messages: Message[] = JSON.parse(localStorage.getItem('loverose_messages') || '[]');
      const filtered = messages.filter(m => m.conversationId === conversationId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      callback(filtered);
    };

    loadMessages();
    const interval = setInterval(loadMessages, 1500);
    return () => clearInterval(interval);
  },

  async sendMessage(conversationId: string, senderId: string, text: string): Promise<void> {
    const newMessage: Message = {
      id: uuid(),
      conversationId,
      senderId,
      text,
      createdAt: new Date().toISOString(),
      read: false
    };

    if (!useMock && firestore) {
      try {
        // Save in sub-collection
        await setDoc(doc(firestore, 'conversations', conversationId, 'messages', newMessage.id), newMessage);
        // Update match's last message
        await updateDoc(doc(firestore, 'matches', conversationId), {
          lastMessage: text,
          lastMessageAt: new Date().toISOString()
        });
        return;
      } catch (e) {
        console.error("Firestore sendMessage error, writing locally", e);
      }
    }

    // Local Storage
    const messages: Message[] = JSON.parse(localStorage.getItem('loverose_messages') || '[]');
    messages.push(newMessage);
    localStorage.setItem('loverose_messages', JSON.stringify(messages));

    // Update last message in local match
    const matches: Match[] = JSON.parse(localStorage.getItem('loverose_matches') || '[]');
    const matchIndex = matches.findIndex(m => m.id === conversationId);
    if (matchIndex > -1) {
      matches[matchIndex].lastMessage = text;
      matches[matchIndex].lastMessageAt = new Date().toISOString();
      localStorage.setItem('loverose_matches', JSON.stringify(matches));
    }
  },

  // --- Premium purchase webhook simulation ---
  async applyMoneyFusionPayment(uid: string, plan: 'monthly' | 'yearly', trxRef: string): Promise<void> {
    const expiration = new Date();
    if (plan === 'monthly') {
      expiration.setMonth(expiration.getMonth() + 1);
    } else {
      expiration.setFullYear(expiration.getFullYear() + 1);
    }

    if (!useMock && firestore) {
      try {
        await setDoc(doc(firestore, 'subscriptions', uid), {
          uid,
          plan,
          active: true,
          expiresAt: expiration.toISOString(),
          transactionRef: trxRef
        });
        await updateDoc(doc(firestore, 'users', uid), {
          isPremium: true
        });
        return;
      } catch (e) {
        console.error("Firestore premium activate failed, performing locally", e);
      }
    }

    // Offline / Mock fallback
    const profiles = JSON.parse(localStorage.getItem('loverose_profiles') || '[]');
    const idx = profiles.findIndex((p: UserProfile) => p.uid === uid);
    if (idx > -1) {
      profiles[idx].isPremium = true;
      localStorage.setItem('loverose_profiles', JSON.stringify(profiles));
    }
  }
};
