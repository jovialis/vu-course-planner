import {
    Avatar,
    Box,
    Button,
    Container, Flex, Heading, HStack,
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
import {CourseSearchBar} from "../components/CourseSearchBar"
import {useUser} from "../components/UserLoginGate";
import {LogoutButton} from "../components/LogoutButton";

export default function UserProfile() {
    const user = useUser();

    const [first_major, set_first_major] = useState("")
    const [second_major, set_second_major] = useState("")
    const [minor, set_minor] = useState("")

    const [year, set_year] = useState("")
    const [term, set_term] = useState("")

    const [addingCourse, setAddingCourse] = useState("")
    const [completedCourses, setComplete] = useState([])
    const [listOfComplete, setListOfComplete] = useState(<Box><Text>Currently No Courses Added</Text></Box>)

    const [retSubmission, setRetSubmission] = useState("")

    useEffect(() => {
        handleRead()
        // console.log(username)
    }, []);

    useEffect(() => {
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

    }, [completedCourses]);

    function handleMajorChange(event) {
        set_first_major(event.target.value)
        // console.log(event.target.value)
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

        readDoc({}).then((result) => {
            if (result != null) {
                set_first_major(result.data?.major || "")
                set_second_major(result.data?.sec_major || "")
                set_minor(result.data?.minor || "")
                set_year(result.data?.graduation_year || "")
                set_term(result.data?.graduation_term || "")
                setComplete(result.data?.completed_courses || [])
            }
            // console.log("read")
            // console.log(result.data)
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
            completeCourses: completedCourses,
        }
        setRetSubmission("")
        // console.log(data);
        addUser(data)
            .then((result) => {
                console.log(result)
                if (result.data) {
                    setRetSubmission("Successfully Submitted!")
                } else {
                    setRetSubmission("Error Calling Cloud Function")
                }
            }).catch((error) => {
            setRetSubmission("Error Calling Cloud Function")
        });

    }

    function handleAddCourse(event) {
        let courses = completedCourses
        courses.push(addingCourse)
        setComplete(courses)
        // console.log(completedCourses)

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
        setAddingCourse("")
        console.log(1)
    }

    return (
        <Container maxW={"container.lg"} mb="200">
            <VStack spacing={4} alignItems={"stretch"}>
                <Box h={2}/>
                <Flex alignItems="center" justifyContent="space-between">
                    <Link href={"/"} color={"teal"} fontWeight={"bold"}>
                        Back to Dashboard
                    </Link>
                    <LogoutButton/>
                </Flex>

                <Box h={6}/>

                <HStack alignItems={"flex-start"} spacing={4}>
                    <Avatar src={user.photoURL}/>
                    <VStack alignItems={"flex-start"}>
                        <Heading>
                            {user.displayName}
                        </Heading>
                        <Text>
                            {user.email}
                        </Text>
                    </VStack>
                </HStack>

                <Box h={6}/>


                <Text fontWeight="bold">First Major</Text>
                <Select placeholder='Choose My First Major' onChange={handleMajorChange} value={first_major}>
                    <option value='Computer Science'>Computer Science</option>
                    <option value='History'>History</option>
                    <option value='Math'>Math</option>
                    <option value="Economics">Economics</option>
                    <option value="Political Science">Political Science</option>
                </Select>

                <Text fontWeight="bold">Second Major</Text>
                <Select placeholder='Choose My Second Major' onChange={handleSecMajorChange} value={second_major}>
                    <option value='Computer Science'>Computer Science</option>
                    <option value='History'>History</option>
                    <option value='Math'>Math</option>
                    <option value="Economics">Economics</option>
                    <option value="Political Science">Political Science</option>
                    <option value="N/A">N/A</option>
                </Select>

                <Text fontWeight="bold">Minor</Text>
                <Select placeholder='Choose My Minor' onChange={handleMinorChange} value={minor}>
                    <option value='Computer Science'>Computer Science</option>
                    <option value='History'>History</option>
                    <option value='Math'>Math</option>
                    <option value="Economics">Economics</option>
                    <option value="Political Science">Political Science</option>
                    <option value="N/A">N/A</option>
                </Select>

                <Text fontWeight="bold">Expected Graduation Year</Text>
                <Select placeholder='Expected Graduation Year' onChange={(event) => set_year(event.target.value)}
                        value={year}>
                    <option value='2024'>2024</option>
                    <option value='2025'>2025</option>
                    <option value='2026'>2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                </Select>

                <Text fontWeight="bold">Expected Graduation Term</Text>
                <Select placeholder='Expected Graduation Term' onChange={(event) => set_term(event.target.value)}
                        value={term}>
                    <option value='Fall'>Fall</option>
                    <option value='Spring'>Spring</option>
                    <option value='Summer'>Summer</option>
                </Select>

                <Stack mt='10' mb='10'>
                    {listOfComplete}
                    {/* <Input placeholder='Input the course' size='md' onChange={(event) => {
						setAddingCourse(event.target.value)
					}}/> */}

                    <CourseSearchBar
                        on_course_selected={course => {
                            setAddingCourse(course.course_id)
                            // addCourseToSemester(course.course_id, course.course_name, course.course_hours)
                        }}
                    />
                    {addingCourse != "" ?
                        <Text fontWeight="bold" fontSize="20px" pt='10'>Adding This Course: <Text as="span"
                                                                                                  color="blue">{addingCourse.toUpperCase()}</Text> ?</Text> :
                        <Text></Text>}
                    <Button colorScheme='teal' size='md' onClick={handleAddCourse}
                            style={{width: '200px',}}>
                        Add Course Completed
                    </Button>
                </Stack>

                {/* {retSubmission != "" && ? {retSubmission == "Successfully Submitted!" ? 
                    <Text color="green" fontWeight="bold" fontSize="24px">{retSubmission}</Text> : <Text color="red" fontWeight="bold" fontSize="24px">{retSubmission}</Text>} : <Text></Text>} */}
                {retSubmission == "Successfully Submitted!" ?
                    <Text color="green" fontWeight="bold" fontSize="24px">{retSubmission}</Text> : <Text></Text>}
                {retSubmission == "" ? <Text color="green" fontWeight="bold" fontSize="24px"></Text> : <Text></Text>}
                {retSubmission == "Error Calling Cloud Function" ?
                    <Text color="green" fontWeight="bold" fontSize="24px">{retSubmission}</Text> : <Text></Text>}
                <Button colorScheme='teal' size='lg' onClick={handleSubmit}>
                    Update Profile
                </Button>
            </VStack>
        </Container>
    )
}