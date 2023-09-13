/**
 * index
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 9/13/23
 */

import { onCall } from "firebase-functions/v2/https";
import {initApp} from "./utils/initApp";

initApp();

export const helloWorld = onCall({}, (request) => {
	return {
		hello: "world"
	}
});