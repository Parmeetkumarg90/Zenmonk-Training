import * as admin from "firebase-admin";

let adminDb: admin.firestore.Firestore;
let adminAuth: admin.auth.Auth;

function initializeFirebaseAdmin() {
    if (admin.apps.length === 0) {
        const serviceAccountJson = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;
        const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;

        if (!serviceAccountJson) {
            console.error("Error: FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON environment variable is not set.");
            process.exit(1);
        }
        if (!firebaseProjectId) {
            console.error("Error: FIREBASE_PROJECT_ID environment variable is not set.");
            process.exit(1);
        }
        try {
            const serviceAccount = JSON.parse(serviceAccountJson);
            const firebaseAdminApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: `https://${firebaseProjectId}-default-rtdb.firebaseio.com`,
            });
            console.log("Firebase Admin SDK initialized successfully.");
            adminDb = firebaseAdminApp.firestore();
            adminAuth = firebaseAdminApp.auth();

        } catch (e) {
            console.error("Error initializing Firebase Admin SDK:", e);
            throw new Error(`Failed to initialize Firebase Admin SDK: ${e instanceof Error ? e.message : String(e)}`);
        }
    } else {
        const existingApp = admin.app();
        adminDb = existingApp.firestore();
        adminAuth = existingApp.auth();
    }
}

initializeFirebaseAdmin();

export { admin, adminDb, adminAuth };
