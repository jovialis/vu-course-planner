/**
 * GenerateCoursePlanButton
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 12/2/23
 */
import {
	Button, Card, CardBody, Heading, HStack,
	Modal, ModalBody,
	ModalCloseButton,
	ModalContent, ModalFooter,
	ModalHeader,
	ModalOverlay, Text,
	useDisclosure, useToast, VStack
} from "@chakra-ui/react";
import React, {Fragment, useEffect, useState} from "react";
import {useLazyCallable} from "../hooks/UseLazyCallable";
import {CourseCard} from "./dashboard/CourseCard";
import {useTimeline} from "./dashboard/Timeline";

export function GenerateCoursePlanButton(props: {
	isDisabled: boolean
	selectedPaths: Record<string, number>
}) {
	const timeline = useTimeline();

	const {onClose, isOpen, onOpen} = useDisclosure();

	const toast = useToast();

	const [replaceTimelineSemesters, {loading: replaceLoading}] = useLazyCallable("replace_timeline_semesters", {}, {
		onError: error => {
			toast({
				status: "error",
				description: error.message
			})
		},
		onSuccess: () => {
			onClose()
			timeline.refetchTimeline();
		}
	});

	const [curGeneratedTimelineCourses, setCurGeneratedTimelineCourses] = useState(null)
	const [generateTimelineCourses, {data, loading, error}] = useLazyCallable("generate_timeline_courses", {}, {
		onSuccess: data => {
            onOpen();
			setCurGeneratedTimelineCourses(data);
		},
		onError: error => toast({
			status: "error",
			description: error.message
		})
	});

	useEffect(() => {
		if (!isOpen) {
			// On close, reset the courses and stuff
			setCurGeneratedTimelineCourses(null);
		}
	}, [isOpen]);

	return <>

		<Button
			colorScheme={"green"}
			isDisabled={props.isDisabled}
			mt={2}
			isLoading={loading}
			onClick={() => {
				if (timeline.timeline_major) {
					generateTimelineCourses({
						timeline_id: timeline.timeline_id,
						major_id: timeline.timeline_major,
						selected_paths: props.selectedPaths
					})
				}
			}}
		>
			Generate Course Plan
		</Button>

		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size={"xl"}
		>
			<ModalOverlay/>
			<ModalContent>
				<ModalHeader>
					Accept New Timeline?
				</ModalHeader>
				<ModalCloseButton/>
				<ModalBody pb={6}>
					{curGeneratedTimelineCourses && <>

						<VStack alignItems={"stretch"} spacing={4}>

							{curGeneratedTimelineCourses.map((semester, i) => <Fragment key={i}>

								<VStack alignItems={"stretch"}>
									<Heading size={"sm"}>
										{semester.semester_name}
									</Heading>

									<VStack alignItems={"stretch"} spacing={1}>

										{semester.semester_courses.map((course, i) => <Fragment key={i}>

											<CourseCard
												course_name={course.course_name}
												course_id={course.course_id}
											/>

										</Fragment>)}

										{semester.semester_courses.length === 0 && <Card variant={"outline"} size={"sm"}>
											<CardBody>
												<Text>
													No Courses
												</Text>
											</CardBody>
										</Card>}

									</VStack>

								</VStack>

							</Fragment>)}

						</VStack>

					</>}
				</ModalBody>
				<ModalFooter>
					<HStack>
						<Button
							colorScheme={"gray"}
							size={"sm"}
							onClick={() => {
								onClose()
							}}
						>
							Cancel
						</Button>
						<Button
							colorScheme={"green"}
							size={"sm"}
							isDisabled={!curGeneratedTimelineCourses}
							onClick={() => {
								replaceTimelineSemesters({
									timeline_id: timeline.timeline_id,
									timeline_semesters: curGeneratedTimelineCourses
								})
							}}
							isLoading={replaceLoading}
						>
							Accept Timeline
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
			<ModalFooter/>
		</Modal>
	</>
}