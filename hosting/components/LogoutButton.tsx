import {getAuth, signOut} from "firebase/auth";
import {Button} from "@chakra-ui/react";

export function LogoutButton() {
    const handleLogOut = async () => {
        const auth = getAuth();
        await signOut(auth);
    }

    return <>
        <Button
	        colorScheme="red"
	        onClick={handleLogOut}
	        size={"sm"}
        >
	        Logout
		</Button>
    </>
}