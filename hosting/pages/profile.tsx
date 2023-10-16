import {
	Box,
	Button,
	Container,
	Input,
	Link,
	ListItem,
	Select,
	Stack,
	Text,
	UnorderedList,
	VStack
} from '@chakra-ui/react'

import {getFunctions, httpsCallable} from 'firebase/functions'
import React, {useEffect, useState} from "react";


export default function UserProfile() {

	const [username, setUsername] = useState("")

	const [first_major, set_first_major] = useState("")
	const [second_major, set_second_major] = useState("")
	const [minor, set_minor] = useState("")

	const [year, set_year] = useState("")
	const [term, set_term] = useState("")

	const [name, setName] = useState("")

	const [addingCourse, setAddingCourse] = useState("")
	const [completedCourses, setComplete] = useState([])
	const [listOfComplete, setListOfComplete] = useState(<Box><Text>Currently No Courses Added</Text></Box>)
	useEffect(() => {
		// handleRead()
		handleSubmit()
	}, []);

	function changeUsername(event) {
		console.log(event.target.value)
		setUsername(event.target.value)
	}

	function handleMajorChange(event) {
		set_first_major(event.target.value)
		console.log(event.target.value)
	}

	function handleSecMajorChange(event) {
		set_second_major(event.target.value)
	}

	function handleMinorChange(event) {
		set_minor(event.target.value)
	}

	function handleRead() {
		const functions = getFunctions()
		const readDoc = httpsCallable(functions, 'get_user_data')

		readDoc({address: "Home", username: "JPjFjauMlLF12oOwXcJI"}).then((result) => {
			console.log(result.data)
		})

	}

	function handleSubmit() {
		console.log('test')
		const functions = getFunctions()
		const addUser = httpsCallable(functions, 'set_user_data')
		// console.log(first_major)
		let data = {
			address: "Home",
			major: first_major,
			minor: minor,
			second_major: second_major,
			year: year,
			term: term,
			name: name,
			username: username
		}

		console.log(data);

		addUser(data)
			.then((result) => {
				console.log(result)
			}).catch((error) => {
			console.error('Error calling Cloud Function:', error);
		});

	}

	function handleAddCourse(event) {
		let courses = completedCourses
		console.log(event)
		courses.push(addingCourse)
		setComplete(courses)
		console.log(completedCourses)

		let tmp = completedCourses.map((item, index) => (
			<ListItem>{item}</ListItem>
		))
		setListOfComplete(
			<Box>
				<UnorderedList>
					{tmp}
				</UnorderedList>
			</Box>
		)
		console.log(1)
	}

	return (
		<Container maxW={"container.lg"}>
			<VStack spacing={4} alignItems={"stretch"}>
				<Link href={"/"} color={"teal"} fontWeight={"bold"}>
					Back to Dashboard
				</Link>

				<Text>User Name</Text>
				<Input placeholder='Input your User Name' size='md' onChange={changeUsername}/>
				<Text>Full Name</Text>
				<Input placeholder='Input your name' size='md' onChange={(event) => {
					setName(event.target.value)
				}}/>

				<Text>First Major</Text>
				<Select placeholder='Choose My First Major' onChange={handleMajorChange}>
					<option value='Computer Science'>Computer Science</option>
					<option value='History'>History</option>
					<option value='Math'>Math</option>
					<option value="Economics">Economics</option>
					<option value="Political Science">Political Science</option>
				</Select>

				<Text>Second Major</Text>
				<Select placeholder='Choose My Second Major' onChange={handleSecMajorChange}>
					<option value='Computer Science'>Computer Science</option>
					<option value='History'>History</option>
					<option value='Math'>Math</option>
					<option value="Economics">Economics</option>
					<option value="Political Science">Political Science</option>
					<option value="N/A">N/A</option>
				</Select>

				<Text>Minor</Text>
				<Select placeholder='Choose My Minor' onChange={handleMinorChange}>
					<option value='Computer Science'>Computer Science</option>
					<option value='History'>History</option>
					<option value='Math'>Math</option>
					<option value="Economics">Economics</option>
					<option value="Political Science">Political Science</option>
					<option value="N/A">N/A</option>
				</Select>

				<Text>Expected Graduation Year</Text>
				<Select placeholder='Expected Graduation Year' onChange={(event) => set_year(event.target.value)}>
					<option value='2024'>2024</option>
					<option value='2025'>2025</option>
					<option value='2026'>2026</option>
					<option value="2027">2027</option>
					<option value="2028">2028</option>
				</Select>

				<Text>Expected Graduation Term</Text>
				<Select placeholder='Expected Graduation Term' onChange={(event) => set_term(event.target.value)}>
					<option value='Fall'>Fall</option>
					<option value='Spring'>Spring</option>
					<option value='Summer'>Summer</option>
				</Select>

				<Stack mt='10' mb='10'>
					{listOfComplete}
					<Input placeholder='Input the course' size='md' onChange={(event) => {
						setAddingCourse(event.target.value)
					}}/>
					<Button colorScheme='teal' size='md' onClick={handleAddCourse}
					        style={{width: '200px',}}>
						Add Course Completed
					</Button>
				</Stack>


				<Button colorScheme='teal' size='lg' onClick={handleSubmit}>
					Update Profile
				</Button>
			</VStack>
		</Container>
	)
}