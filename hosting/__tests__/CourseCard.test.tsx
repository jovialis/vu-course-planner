/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import {CourseCard} from "../components/dashboard/CourseCard";
import {Box, Heading} from "@chakra-ui/react";

describe('Home', () => {
  it('renders a heading', () => {
    render(<Heading>My Heading</Heading>)
  })
})