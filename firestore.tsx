// firestore-crud.js

// Firebase SDK imports
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// ✅ Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

// 🔌 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🔁 Wait for user to log in
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        console.log("User not logged in.");
        return;
    }

    const uid = user.uid;
    const postsCollection = collection(db, "users", uid, "posts");

    // ---------- 🔵 CREATE ----------
    const newPost = {
        title: "My First Post",
        content: "Hello, world!",
        timestamp: Date.now()
    };

    const createdDocRef = await addDoc(postsCollection, newPost);
    console.log("✅ Created post with ID:", createdDocRef.id);

    // ---------- 🟢 READ (Single) ----------
    const singlePostRef = doc(db, "users", uid, "posts", createdDocRef.id);
    const postSnap = await getDoc(singlePostRef);

    if (postSnap.exists()) {
        console.log("📄 Read single post:", postSnap.data());
    } else {
        console.log("❌ Post not found");
    }

    // ---------- 🟢 READ (All) ----------
    const allPostsSnap = await getDocs(postsCollection);
    console.log("📚 All posts:");
    allPostsSnap.forEach(doc => {
        console.log(`- ${doc.id}:`, doc.data());
    });

    // ---------- 🟡 UPDATE ----------
    await updateDoc(singlePostRef, {
        title: "Updated Post Title",
        views: 10
    });
    console.log("✏️ Updated post:", createdDocRef.id);

    // ---------- 🔴 DELETE ----------
    await deleteDoc(singlePostRef);
    console.log("🗑️ Deleted post:", createdDocRef.id);
});
