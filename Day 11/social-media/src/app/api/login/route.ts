import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { admin, adminDb } from '@/config/firebase-admin';
import { success } from 'zod';

export async function GET(request: Request) {
    try {
        const headerList = headers();
        const authorization = (await headerList).get("Authorization");
        if (authorization) {
            const token = authorization.split(' ')[1];
            if (token) {
                try {
                    const decodedToken = await admin.auth().verifyIdToken(token);
                    const userUid = decodedToken.uid;
                    const documentRef = await adminDb.collection("users").doc(userUid);
                    const isUser = await documentRef.get();
                    if (isUser.exists) {
                        return Response.json({ success: false, message: "User already present" });
                    }
                    return Response.json({ success: true });
                }
                catch (e) {
                    console.log("Error in decoding GET handler of /register: ", e);
                }
            }
        }
        return Response.json({ success: false });
    }
    catch (e) {
        console.log("Error in decoding GET handler of /register: ", e);
        return Response.json({ success: false });
    }
}