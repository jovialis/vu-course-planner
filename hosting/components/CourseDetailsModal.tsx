/**
 * CourseDetailsModal
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 10/10/23
 */
import {
	Button,
	Modal, ModalBody,
	ModalCloseButton,
	ModalContent, ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure
} from "@chakra-ui/react";
import {ReactElement} from "react";

export function CourseDetailsModal(props: {
	course_id: string
	course_name: string
	children: (onOpen: () => void) => ReactElement
}) {
	const { isOpen, onOpen, onClose } = useDisclosure()
	return (
		<>
			{props.children(onOpen)}

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						{props.course_name}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						Course Details
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	)
}