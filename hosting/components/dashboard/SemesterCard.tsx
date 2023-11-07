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
	Center,
	Heading,
	HStack,
	Text,
	useToast,
	VStack
} from "@chakra-ui/react";
import React, {useMemo, useState} from "react";
import {useLazyCallable} from "../../hooks/UseLazyCallable";
import {CourseSearchBar} from "../CourseSearchBar";

import {CourseCard, CourseCardProps} from "./CourseCard";
import {useTimeline} from "./Timeline";

export interface SemesterCardProps {
	semester_name: string
	semester_id: string
	semester_courses: CourseCardProps[]
}

export function SemesterCard(props: SemesterCardProps) {
	const [courses, setCourses] = useState<CourseCardProps[]>(props.semester_courses);
    const timeline = useTimeline();
    const toast = useToast();

	// 1: Remove the Course from the semester when removeCourseFromSemester is called
	// 2: Add the Course to the semester when addCourseToSemester is called.
    const [addCourseToTimeline, {}] = useLazyCallable("add_course_to_timeline", {
    }, {
        onSuccess: () => {
            toast({
                status: "success",
                description: "Added course to timeline."
            })
        },
        onError: error => {
	        toast({
		        status: "error",
		        description: "Failed to add course to timeline: " + error.message
	        })
        }
    });

	const [removeCourseFromTimeline, {}] = useLazyCallable("del_course_from_timeline", {}, {
		onSuccess: () => {
			toast({
				status: "success",
				description: "Removed course from timeline."
			})
		},
		onError: error => {
			toast({
				status: "error",
				description: "Failed to remove course from timeline: " + error.message
			})
		}
	});

	function removeCourseFromSemester(course_id: string) {
		setCourses(courses => courses.filter(course => course.course_id !== course_id))

		// Save to the server
		removeCourseFromTimeline({
			timeline_id: timeline.timeline_id,
			cid: course_id,
			sem_name: props.semester_name
		});
	}

	function addCourseToSemester(course_id: string, course_name: string, course_hours?: number) {
		setCourses(courses => [
			...courses,
			{
				course_id: course_id,
				course_name: course_name,
				course_hours: course_hours
			}
		]);

        // Save to the server
        addCourseToTimeline({
	        timeline_id: timeline.timeline_id,
	        c_name: course_name,
	        c_id: course_id,
	        sem_name: props.semester_name
        });
	}

	const courseHours: number = useMemo(() => {
		// TODO: Calculate the hours a given course will take based on the content of 'courses'

		return courses.length * 3;
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
				{/* <Input
					size={"md"}
					placeholder={"Add courses"}
				/> */}

				<CourseSearchBar
					on_course_selected={course => {
						addCourseToSemester(course.course_id, course.course_name, course.course_hours)
					}}
				/>
			</CardFooter>
		</Card>
	</>
}