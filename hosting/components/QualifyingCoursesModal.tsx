/**
 * QualifyingCoursesModal
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 12/2/23
 */
import {
	Badge,
	Card, CardBody,
	Grid, GridItem, Heading,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent, ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner, Text, useDisclosure, VStack, Wrap, WrapItem
} from "@chakra-ui/react";
import React, {ReactElement, useEffect} from "react";
import {useCallable} from "../hooks/UseCallable";
import {useLazyCallable} from "../hooks/UseLazyCallable";
import {CourseCard} from "./dashboard/CourseCard";
import {MajorSchemaClass, RemainderFilter} from "./MajorSchemaReader";

export function QualifyingCoursesModal(props: {
	children: (onOpen: () => void) => ReactElement,
	title: string,
	items: (MajorSchemaClass | RemainderFilter)[]
}) {
	const {onClose, isOpen, onOpen} = useDisclosure();

	const [lookupCourses, {data, error, loading}] = useLazyCallable("lookup_courses", {
		// @ts-ignore
		ids: props.items.filter(item => item.isClass()).map(item => item.course)
	}, {
		timeout: 60 * 5 * 1000
	});

	useEffect(() => {
		if (isOpen) {
			lookupCourses();
		}
	}, [isOpen]);

	return <>
		{props.children(onOpen)}

		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size={"xl"}
		>
			<ModalOverlay/>
			<ModalContent>
				<ModalHeader>
					Qualifying Courses: {props.title}
				</ModalHeader>
				<ModalCloseButton/>
				<ModalBody pb={6}>
					{loading && <Spinner/>}

					{data && <VStack alignItems={"stretch"} spacing={1}>
						{props.items.map((item, k) => <RenderItem
							key={k}
							item={item}
							// @ts-ignore
							courseInfo={data.find(course => course.id.toLowerCase() === item?.course?.toLowerCase())}
						/>)}
                    </VStack>}

				</ModalBody>
			</ModalContent>
			<ModalFooter/>
		</Modal>
	</>
}

function RenderItem(props: {
	item: MajorSchemaClass | RemainderFilter,
	courseInfo?: any
}) {
	if (props.item.isClass()) {
		return <>
			<React.Fragment>
				<CourseCard
					course_id={props.item.course}
					course_name={props.courseInfo?.name}
					hideOptions={true}
					course_hours={props.courseInfo?.hours}
					onRemove={() => {}}
				/>
			</React.Fragment>
		</>
	} else {
		return <>
			<Card size={"sm"} variant={"filled"}>
				<CardBody>
					<Text>
						Any {props.item.subject} Courses
					</Text>
				</CardBody>
			</Card>

		</>
	}
}