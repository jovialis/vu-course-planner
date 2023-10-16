/**
 * CourseDetailsModal
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 10/10/23
 */
import {
	Grid, GridItem,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent, ModalFooter,
	ModalHeader,
	ModalOverlay, Spinner,
	useDisclosure
} from "@chakra-ui/react";
import {ReactElement, useEffect} from "react";
import {useCallable} from "../hooks/UseCallable";
import {CourseInfo} from "./CourseInfo";

export function CourseDetailsModal(props: {
	course_id: string
	course_name: string
	children: (onOpen: () => void) => ReactElement
}) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {data, loading, error, refetch} = useCallable("lookup_course", {
		id: props.course_id
	}, null, !isOpen);

	// Fetch course data when the modal is open
	useEffect(() => {
		if (isOpen) {
			refetch();
		}
	}, [isOpen]);

	return (
		<>
			{props.children(onOpen)}

			<Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
				<ModalOverlay/>
				<ModalContent>
					<ModalHeader>
						{props.course_id.toUpperCase()}: {props.course_name}
					</ModalHeader>
					<ModalCloseButton/>

					{!data && <ModalBody>
						<Spinner/>
					</ModalBody>}

					{data && <ModalBody>
                        <Grid
                            h='400px'
                            w='800px'
                            templateRows='repeat(4, 1fr)'
                            templateColumns='repeat(20, 1fr)'
                            gap={10}>
                            <GridItem rowSpan={4} colSpan={8} bg='tomato'>
	                            {data.description}
                            </GridItem>
                            <GridItem colSpan={6} rowSpan={3} bg='papayawhip'/>
                            <GridItem colSpan={6} rowSpan={1} bg='papayawhip'/>
                            <GridItem colSpan={6} rowSpan={1} bg='tomato'/>
                            <GridItem colSpan={6} rowSpan={1} bg='tomato'/>
                            <GridItem colSpan={6} rowSpan={1} bg='tomato'/>
                        </Grid>
                        <br/>
                        <Grid
                            h='200px'
                            w='800px'
                            templateRows='repeat(3, 1fr)'
                            templateColumns='repeat(20, 1fr)'
                            gap={10}>
                            <GridItem rowSpan={3} colSpan={8} bg='papayawhip'/>
                            <GridItem rowSpan={2} colSpan={10} bg='green.500'/>
                            <GridItem rowSpan={1} colSpan={2}/>
                            <GridItem rowSpan={1} colSpan={2} bg='purple'/>
                            <GridItem rowSpan={1} colSpan={5} bg='beige'/>
                        </Grid>
                    </ModalBody>}

				</ModalContent>
				<ModalFooter/>
			</Modal>
		</>
	)
}