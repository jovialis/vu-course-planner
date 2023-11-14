/**
 * @jest-environment jsdom
 */

import {render, screen, fireEvent} from '@testing-library/react'
import {CourseCard} from "../components/dashboard/CourseCard";


describe('Home', () => {
	it('renders a course card', () => {
		render(<CourseCard
			course_name={"My Course"}
			course_id={"mycourse"}
			course_hours={3}
			onRemove={() => {
			}}
		/>)
	})

	it('should display the course info when hovered over', async () => {
		render(<CourseCard
			course_name={"My Course"}
			course_id={"mycourse"}
			course_hours={3}
			onRemove={() => {
			}}
		/>)

		expect(screen.getByText("My Course")).toBeDefined()
		expect(screen.getByText("My Course")).not.toBeVisible()

		expect(screen.queryByText("Not My Course")).not.toBeInTheDocument()

		await fireEvent.mouseEnter(screen.getByText("mycourse"))
		await fireEvent.mouseOver(screen.getByText("mycourse"))
		await fireEvent.mouseMove(screen.getByText("mycourse"))

		expect(screen.getByText("My Course")).toBeVisible()

		// TODO: Debug this test
	});

	// it('should show a popup menu when options are clicked', () => {
	// 	const card = render(<CourseCard
	// 		course_name={"My Course"}
	// 		course_id={"mycourse"}
	// 		course_hours={3}
	// 		onRemove={() => {
	// 		}}
	// 	/>)
	//
	// 	expect(card.getByI)
	//
	// });

	it('should trigger a function when remove is clicked', () => {
		const removeFn = jest.fn();

		const card = render(<CourseCard
			course_name={"My Course"}
			course_id={"mycourse"}
			course_hours={3}
			onRemove={removeFn}
		/>)

		expect(screen.getByText("Remove")).toBeInTheDocument();

		// TODO: Finish this

		// fireEvent.mouseDown(screen.getByText("Remove"));
		//
		// fireEvent.mouseDown(screen.getByText("Remove"));
		// fireEvent.mouseUp(screen.getByText("Remove"));
		//
		// expect(removeFn).toHaveBeenCalled()
	});
})