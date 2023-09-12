/**
 * UserLoginGate
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 9/6/23
 */
import {Box, Button, Card, CardBody, Center, Container, Heading, Spinner, VStack} from "@chakra-ui/react";
import {getAuth, GoogleAuthProvider, signInWithPopup, User} from "firebase/auth";
import React, {PropsWithChildren, useContext, useEffect, useState} from "react";

const UserProvider = React.createContext<User>(null);

const provider = new GoogleAuthProvider();

export function useUser() {
	return useContext(UserProvider);
}

export function UserLoginGate(props: PropsWithChildren) {
	const auth = getAuth();

	const [state, setState] = useState<{
		user: User | null,
		loading: boolean
	}>({
		user: null,
		loading: true
	});

	useEffect(() => {
		// Add an authentication state change listener
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				// User is signed in
				setState({
					user: authUser,
					loading: false
				})
			} else {
				// User is signed out
				setState({
					user: null,
					loading: false
				})
			}
		});

		// Unsubscribe to the listener when component unmounts
		return () => unsubscribe();
	}, []);

	function login() {
		signInWithPopup(auth, provider)
			.then((result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				// The signed-in user info.
				const user = result.user;
				// IdP data available using getAdditionalUserInfo(result)
				// ...
			}).catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			// ...
		});
	}

	if (state.loading) {
		return <Center h={"95vh"}>
			<Spinner/>
		</Center>
	}

	if (!state.user) {
		return <>
			<Container maxW={"md"}>
				<Box h={20}/>
				<VStack w={"100%"} alignItems={"stretch"} spacing={8}>
					<Heading size={"md"} textAlign={"center"}>
						Login
					</Heading>
					<Card variant={"outline"} shadow={"lg"}>
						<CardBody>
							<Button
								onClick={login}
								colorScheme={"blue"}
								w={"100%"}
							>
								Login with Google
							</Button>
						</CardBody>
					</Card>
				</VStack>
			</Container>
		</>
	}

	return <UserProvider.Provider value={state.user}>
		{props.children}
	</UserProvider.Provider>
}