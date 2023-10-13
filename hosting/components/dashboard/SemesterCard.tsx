/**
 * SemesterCard
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 10/5/23
 */
import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CardProps, Center,
	Heading,
	HStack,
	Input,
	Text,
	VStack
} from "@chakra-ui/react";
import React, {useMemo, useState} from "react";
import {CourseCard, CourseCardProps} from "./CourseCard";

export interface SemesterCardProps {
	semester_name: string
	semester_id: string
	semester_initial_courses: CourseCardProps[]
}

export function SemesterCard(props: SemesterCardProps) {
	const [courses, setCourses] = useState<CourseCardProps[]>(props.semester_initial_courses);

	function removeCourseFromSemester(course_id: string) {
		// TODO: Remove from the Timeline and Semester on the server

		setCourses(courses => courses.filter(course => course.course_id !== course_id))
	}

	function addCourseToSemester(course_id: string, course_name: string) {
		// TODO: Trigger this function when a Course is selected and update Semester on the server

		setCourses(courses => [
			...courses,
			{
				course_id: course_id,
				course_name: course_name
			}
		])
	}

	const courseHours: number = useMemo(() => {
		// TODO: Calculate the hours a given course will take based on the content of 'courses'

		return 3;
	}, [courses]);

	return <>
		<Card
			variant={"outline"}
			size={"sm"}
		>
			<CardHeader>
				<HStack w={"100%"} justifyContent={"space-between"}>
					<Heading size={"sm"}>
						{props.semester_name}
					</Heading>
					<Text>
						{courseHours} hours
					</Text>
				</HStack>
			</CardHeader>
			<CardBody py={2}>
				{courses.length > 0 && <VStack alignItems={"stretch"}>
					{courses.map(course => <React.Fragment key={course.course_id}>
						<CourseCard {...course} onRemove={() => {
							removeCourseFromSemester(course.course_id)
						}}/>
					</React.Fragment>)}
                </VStack>}
				{courses.length === 0 && <>
					<Center borderWidth={1} py={2} mt={-2} mb={-2}>
						<Text fontSize={"xs"}>
							No courses
						</Text>
					</Center>
				</>}
			</CardBody>
			<CardFooter>
				<Input
					size={"md"}
					placeholder={"Add courses"}
				/>
			</CardFooter>
		</Card>
	</>
}