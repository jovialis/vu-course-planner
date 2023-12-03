/**
 * CourseDetailsModal
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 10/10/23
 */
import {
	Badge,
	Grid, GridItem,
	Modal,
	ModalBody,
	Text,
	ModalCloseButton,
	ModalContent, ModalFooter,
	ModalHeader,
	ModalOverlay, Spinner,
	useDisclosure, Wrap, WrapItem,
	Card, Heading,
	Button,
	HStack
} from "@chakra-ui/react";
import React from "react";
import {ReactElement, useEffect} from "react";
import {useCallable} from "../hooks/UseCallable";
import {CourseInfo} from "./CourseInfo";
import {getFunctions, httpsCallable} from 'firebase/functions'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';


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

	function update_rate(rate, course_id){
		const functions = getFunctions()
		const rating = httpsCallable(functions, 'rating')

		let data = {
			rate: rate,
			course: course_id,
        }
		const ret = rating(data)
		console.log(ret)
	}

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
							<GridItem rowSpan={4} colSpan={8}>
								<Heading as="h4" fontWeight="bold" fontSize="x1">Description:</Heading>
								<Card p={1} bg="gray.50" h="95%" display="flex" flexDirection="column" justifyContent="space-between">
										{data.description}
								</Card>
							</GridItem>
                            <GridItem colSpan={6} rowSpan={3} mb={1}>
								<Heading as="h4" fontWeight="bold" fontSize="x1">Professors:</Heading>
								<Card p={1} bg="gray.50" h="95%" display="flex" flexDirection="column" justifyContent="space-between">
								</Card>
							</GridItem>
                            <GridItem colSpan={6} rowSpan={1}>
								<Heading as="h4" fontWeight="bold" fontSize="x1">School and Subject:</Heading>
								<Card p={1} bg="gray.50" h="85%" display="flex" flexDirection="column" justifyContent="space-between">
									<Text>{data.school}</Text>
									<WrapItem>
										<Badge colorScheme="blue" fontSize="lem" size="lem">{data.subject}</Badge>
									</WrapItem>
								</Card>
							</GridItem>
                            <GridItem colSpan={6} rowSpan={1}>
								<Heading as="h4" fontWeight="bold" fontSize="x1">Enrollment Qualification:</Heading>
								<Card p={1} bg="gray.50" h="85%" display="flex" flexDirection="column" justifyContent="space-between">
									<WrapItem>
										<Badge colorScheme="green" fontSize="lem" size="lem">Qualify(Temp)</Badge>
									</WrapItem>
								</Card>
							</GridItem>
                            <GridItem colSpan={6} rowSpan={1}>
								<Heading as="h4" fontWeight="bold" fontSize="x1">Class Rating:</Heading>
								<Card p={1} bg="gray.50" h="75%" display="flex" flexDirection="column" justifyContent="space-between">
									<HStack>
										<Button onClick={() => update_rate(1,props.course_id.toUpperCase())}>
											<ChevronUpIcon />
										</Button>
										<Button onClick={() => update_rate(-1,props.course_id.toUpperCase())}>
											<ChevronDownIcon />
										</Button>
									</HStack>

								</Card>
							</GridItem>
                            <GridItem colSpan={6} rowSpan={1} bg='gray.50' mb={1}>
								<Heading as="h4" fontWeight="bold" fontSize="x1">Semester Available</Heading>
								<Card p={1} bg="gray.50" h="77%" display="flex" flexDirection="column" justifyContent="space-between">
									{!data.active && <Text>
										Course is inactive (hasn't been listed in the past four years)
									</Text>}
									{data.active && <Wrap>
										{Object.keys(data.availability).map(key => <React.Fragment key={key}>
											<WrapItem>
												<Badge colorScheme={(() => {
													switch (data.availability[key]) {
														case -1: return "red";
														case 0: return "gray";
														case 1: return "green"
													}
												})()}>
													{key}
												</Badge>
											</WrapItem>
										</React.Fragment>)}
									</Wrap>}
								</Card>
							</GridItem>
                        </Grid>
                        <br/>
                        <Grid
                            h='200px'
                            w='800px'
                            templateRows='repeat(3, 1fr)'
                            templateColumns='repeat(20, 1fr)'
                            gap={10}>
                            <GridItem rowSpan={3} colSpan={8}>
								<Heading as="h4" fontWeight="bold" fontSize="x1">Prerequisites:</Heading>
								<Card p={1} bg="gray.50" h="85%" display="flex" flexDirection="column" justifyContent="space-between">
									{data.prerequisites}
								</Card>
							</GridItem>
                            {/*<GridItem rowSpan={2} colSpan={10} bg='gray.50' p={1}>*/}
							{/*</GridItem>*/}
                            {/*<GridItem rowSpan={1} colSpan={2}/>*/}
                            {/*<GridItem rowSpan={1} colSpan={2} bg='purple'/>*/}
                            {/*<GridItem rowSpan={1} colSpan={5} bg='beige'/>*/}
                        </Grid>
                    </ModalBody>}

				</ModalContent>
				<ModalFooter/>
			</Modal>
		</>
	)
}