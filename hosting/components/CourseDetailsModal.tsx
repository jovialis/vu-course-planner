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
	HStack,
	VStack,
	useToast,
	Box, IconButton
} from "@chakra-ui/react";
import React from "react";
import {ReactElement, useEffect, useState} from "react";
import {useCallable} from "../hooks/UseCallable";
import {CourseInfo} from "./CourseInfo";
import {getFunctions, httpsCallable} from 'firebase/functions'
import { ChevronUpIcon, ChevronDownIcon, StarIcon } from '@chakra-ui/icons';


export function CourseDetailsModal(props: {
	course_id: string
	course_name: string
	children: (onOpen: () => void) => ReactElement
}) {
	const toast = useToast()
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {data, loading, error, refetch} = useCallable("lookup_course", {
		id: props.course_id
	}, null, !isOpen);

	const [likes, setLikes] = useState(0)
	const [dislikes, setDislikes] = useState(0)
	const [likeText, setLikeText] = useState(<Text fontSize='2xl' fontWeight="bold" color="green">0</Text>)
	const [dislikeText, setDislikeText] = useState(<Text fontSize='2xl' fontWeight="bold" color="red">0</Text>)
	// Fetch course data when the modal is open
	useEffect(() => {
		if (isOpen) {
			refetch();
		}
		get_rate()
	}, [isOpen]);

	useEffect(() => {
		get_rate()
		setLikeText(<Text fontSize='2xl' fontWeight="bold" color="green">{likes}</Text>)
		setDislikeText(<Text fontSize='2xl' fontWeight="bold" color="red">{dislikes}</Text>)
	}, [likes, dislikes])

	function update_rate(rate, course_id){
		const functions = getFunctions()
		const rating = httpsCallable(functions, 'rating')
		let data = {
			rate: rate,
			course: course_id,
        }
		rating(data).then((result) => {
			// console.log("I need to check this")
			console.log(result)
			
			if (result != null){
				if (result.data == "Already rated"){
					toast({
						title: 'You can only vote the same option once',
						description: "Dupulicate vote",
						status: 'error',
						duration: 1500,
						isClosable: true,
					  })
				} else {
					setLikes(result.data?.like || 0)
					setDislikes(result.data?.dislike || 0)   
					toast({
						title: 'Successfully Voted!',
						description: "Vote Successfully",
						status: 'success',
						duration: 1500,
						isClosable: true,
					})
				}
            }
		})
	}

	function get_rate() {
		console.log("I get")
		const functions = getFunctions()
		const getRating = httpsCallable(functions, 'get_rating')
		let data = {
			course_id: props.course_id.toUpperCase(),
        }
		getRating(data).then((result) => {
            if (result != null){
				setLikes(result.data?.like || 0)
				setDislikes(result.data?.dislike || 0)     
            }
			console.log(result)
        })
	}
	const [diffRating, setDiffRating] = useState(0);
	const [useRating, setUseRating] = useState(0);


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
										<Text fontWeight="semibold">{data.description}</Text>
								</Card>
							</GridItem>
                            <GridItem colSpan={6} rowSpan={2} mb={1}>
								<Heading as="h4" fontWeight="bold" fontSize="x1">Professors:</Heading>
								<Card p={1} bg="gray.50" h="95%" display="flex" flexDirection="column" justifyContent="space-between">
								</Card>
							</GridItem>
                            <GridItem colSpan={6} rowSpan={1}>
								<Heading as="h4" fontWeight="bold" fontSize="x1">School and Subject:</Heading>
								<Card p={1} bg="gray.50" h="85%" display="flex" flexDirection="column" justifyContent="space-between">
									<Text fontWeight="semibold">{data.school}</Text>
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
								<Heading as="h4" fontWeight="bold" fontSize="x1">Class Voting:</Heading>
								<Card p={1} bg="gray.50" h="45%" display="flex" flexDirection="column" justifyContent="space-between">
									<HStack justify="space-evenly">
										<VStack>
											<Text fontSize='1xl' fontWeight="bold" color="black">Like </Text>
											<Button bg="green.400" 
											onClick={() => update_rate(1,props.course_id.toUpperCase())}
											_hover={{ bg: "green", color: "green.200" }}
											>
												<ChevronUpIcon />
											</Button>
											{/* <Text fontSize='2xl' fontWeight="bold" color="green">{likes}</Text> */}
											{likeText}
										</VStack>
										<VStack>
											<Text fontSize='1xl' fontWeight="bold" color="black">Dislike </Text>
											<Button bg="red.400" 
											onClick={() => update_rate(-1,props.course_id.toUpperCase())}
											_hover={{ bg: "red", color: "red.200" }}
											>
												<ChevronDownIcon />
											</Button>
											{/* <Text fontSize='2xl' fontWeight="bold" color="red">{dislikes}</Text> */}
											{dislikeText}
										</VStack>
									</HStack>
								</Card>
								<Heading as="h4" fontWeight="bold" fontSize="x1" mt={7}>Class Rating:</Heading>
								<Card p={1} bg="gray.50" h="55%" display="flex" flexDirection="column" justifyContent="space-between">
									<Box >
										<Box display="flex" justifyContent="center" alignItems="center" >
											<Text  fontSize='sm' fontWeight="bold" color="black">Difficultity</Text>
										</Box>
										{[...Array(5)].map((_, index) => (
											<IconButton
											key={index}
											icon={<StarIcon />}
											variant="ghost"
											color={index < diffRating ? "yellow.400" : "gray.300"}
											onClick={() => setDiffRating(index + 1)}
											aria-label={`${index + 1}`}
											/>
										))}

										<Box display="flex" justifyContent="center" alignItems="center" >
											<Text  fontSize='sm' fontWeight="bold" color="black">Usefulness</Text>
										</Box>
										{[...Array(5)].map((_, index) => (
											<IconButton
											key={index}
											icon={<StarIcon />}
											variant="ghost"
											color={index < useRating ? "yellow.400" : "gray.300"}
											onClick={() => setUseRating(index + 1)}
											aria-label={`${index + 1}`}
											/>
										))}
									</Box>
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