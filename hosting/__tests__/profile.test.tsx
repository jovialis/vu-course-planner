import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Profile from '../pages/profile'

describe('Profile', () => {
    it ('render Profile component', () => {
        render(<Profile/>);
    })
});

