import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import UserProfile from '../pages/profile'

describe('Home', () => {
    it('render profile page', () => {
        render(
            <UserProfile/>
        )
    })
})