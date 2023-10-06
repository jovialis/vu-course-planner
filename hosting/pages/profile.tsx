import { Input, Text, Box, Select, Button, ButtonGroup, FormLabel, FormControl, Stack } from '@chakra-ui/react'
import React, {useContext, useEffect, useState} from "react";

import { getFunctions, httpsCallable } from 'firebase/functions'


export default function UserProfile() {

    const [username, setUsername] = useState("")

    const [first_major, set_first_major] = useState("")
    const [second_major, set_second_major] = useState("")
    const [minor, set_minor] = useState("")

    const [year, set_year] = useState("")
    const [term, set_term] = useState("")

    const [name, setName] = useState("")

    const [completedCourses, setComplete] = useState([])

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

    function handleSecMajorChange(event){
        set_second_major(event.target.value)
    }

    function handleMinorChange(event){
        set_minor(event.target.value)
    }
    
    function handleRead() {
        const functions = getFunctions()
        const readDoc = httpsCallable(functions, 'readDoc')

        readDoc({address: "Home", username: "JPjFjauMlLF12oOwXcJI"}).then((result) => {
            console.log(result.data)
        })
        
    }

    function handleSubmit(){
        console.log('test')
        const functions = getFunctions()
        const addUser = httpsCallable(functions, 'addUser')
        // console.log(first_major)
        let data  = { address: "Home", major: first_major, minor: minor, second_major : second_major, year : year, term: term, name : name, username: username }

        console.log(data);

        addUser(data)
            .then((result) => {
                conosole.log("ret1")
                console.log(result)
        }).catch((error) => {
            console.error('Error calling Cloud Function:', error);
          });

    }

    function handleAddCourse() {
        return 1
    }

    

    return (
        <Box spacing ={4}>
            <Text>User Name</Text>
            <Input placeholder='Input your User Name' size='md' onChange={changeUsername}/>
            <Text>Full Name</Text>
            <Input placeholder='Input your name' size='md' onChange={(event) => {setName(event.target.value)}}/>

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

            <Stack>
                
                <Button colorScheme='teal' size= 'md' onClick = {handleAddCourse}
                style={{ width: '200px', }}>
                    Add Course Completed
                </Button>
            </Stack>


            <Button colorScheme='teal' size='lg' onClick={handleSubmit}>
                Update Profile
            </Button>
        </Box>
    )
}