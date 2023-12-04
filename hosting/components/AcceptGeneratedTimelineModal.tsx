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

export function AcceptGeneratedTimelineModal(props: {
	children: (onOpen: () => void) => ReactElement,
	onAccept: () => void,

}) {
	const {onClose, isOpen, onOpen} = useDisclosure();

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
					Accept New Timeline?
				</ModalHeader>
				<ModalCloseButton/>
				<ModalBody pb={6}>

				</ModalBody>
			</ModalContent>
			<ModalFooter/>
		</Modal>
	</>
}