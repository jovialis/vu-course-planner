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
	CardProps,
	Heading,
	HStack,
	Input,
	Text,
	VStack
} from "@chakra-ui/react";
import React from "react";
import {CourseCard} from "./CourseCard";

export function SemesterCard(props: {

}) {
	const courses = [
		"CS 2201",
		"CS 3901",
		"HIST 2193",
		"HONS 4139",
		"TEST 13223"
	]

	return <>
		<Card
			variant={"outline"}
			size={"sm"}
		>
			<CardHeader>
				<HStack w={"100%"} justifyContent={"space-between"}>
					<Heading size={"sm"}>
						Fall 2023
					</Heading>
					<Text>
						3 hours
					</Text>
				</HStack>
			</CardHeader>
			<CardBody py={2}>
				<VStack alignItems={"stretch"}>
					{courses.map(course => <React.Fragment key={course}>
						<CourseCard
							course_id={course}
							course_name={course}
						/>
					</React.Fragment>)}
				</VStack>
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