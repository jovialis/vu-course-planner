/**
 * initApp
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 9/6/23
 */

import {getApps, initializeApp} from "firebase-admin/app";
import {setGlobalOptions} from "firebase-functions/v2";

export function initApp() {
	if (!getApps().length) {
		initializeApp();

		setGlobalOptions({maxInstances: 10})
	}
}