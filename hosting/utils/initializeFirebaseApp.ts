/**
 * initializeFirebaseApp
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 11/13/23
 */

import {getApps, initializeApp} from "firebase/app";


export function initializeFirebaseApp() {
	const firebaseConfig = {
		apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
		authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
		projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
		appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
	};

	if (!getApps().length) {
		initializeApp(firebaseConfig);
	}
}