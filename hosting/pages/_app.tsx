/**
 * _app
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 9/6/23
 */

import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import {getApp} from "firebase/app"
import {connectFunctionsEmulator, getFunctions} from "firebase/functions";
import {AppProps} from "next/app";
import {UserLoginGate} from "../components/UserLoginGate";
import {initializeFirebaseApp} from "../utils/initializeFirebaseApp";

initializeFirebaseApp()

export default function App({Component, pageProps}: AppProps) {
	if (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR) {
		const functions = getFunctions(getApp());
		connectFunctionsEmulator(functions, "127.0.0.1", 5001);
	}

	return <>
		<ChakraProvider theme={extendTheme({
			styles: {
				global: {
					body: {
						bg: 'gray.50', // Set the background color to gray.50
					},
				},
			},
		})}>
			<UserLoginGate>
				<Component {...pageProps} />
			</UserLoginGate>
		</ChakraProvider>
	</>
}