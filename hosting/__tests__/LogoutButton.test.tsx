import {LogoutButton} from "../components/LogoutButton";
import {render, screen, fireEvent} from "@testing-library/react";
import { getAuth, signOut } from 'firebase/auth';

// Mocking Firebase auth functions
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    signOut: jest.fn(),
}));

describe('Logout Button', () => {
    it('render log out button', () => {
        render(<LogoutButton/>)
    })
    it('calls handleLogOut on button click', async () => {
        render(<LogoutButton />);
        const logoutButton = screen.getByText('Logout');

        // Mocking Firebase auth instance
        const mockAuth = { /* your mock auth instance here */ };
        (getAuth as jest.Mock).mockReturnValue(mockAuth);

        // Trigger the button click
        fireEvent.click(logoutButton);

        // Expect that the signOut function is called with the mock auth instance
        expect(signOut).toHaveBeenCalledWith(mockAuth);
        // You might also want to add more assertions based on your actual use case
    });
})