import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {SidebarMajorChunk, MajorRequirementComponent} from "../components/dashboard/SidebarMajorChunk";
import {Card} from "@chakra-ui/react";
import React from "react";

describe('Sidebar Major Requirements', () => {
    it ('render sidebar', () => {
        render(<Card>
            <SidebarMajorChunk/>
        </Card>)

        expect(screen.getByText('Computer Science')).toBeInTheDocument();
        expect(screen.getByText('Requirements')).toBeInTheDocument();
    });
    it('renders MajorRequirementComponent correctly', async () => {
        render(
            <MajorRequirementComponent
                name="Electives"
                hours={12}
                viewLabel="2 required courses"
            />
        );

        // Wait for the component to be rendered
        await waitFor(() => {
            expect(screen.getByText('Electives')).toBeInTheDocument();
            expect(screen.getByText('2 required courses')).toBeInTheDocument();
        });
});})