/**
 * dashboard
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 10/5/23
 */
import {
	Avatar,
	Box,
	Button,
	Container,
	Heading,
	HStack, Link,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs
} from "@chakra-ui/react";
import React from "react";
import {Timeline, TimelineProps} from "../components/dashboard/Timeline";
import {useUser} from "../components/UserLoginGate";
import {useCallable} from "../hooks/UseCallable";

export default function Dashboard() {
	// Things to code
	// 1: Perform a fetch to get_user_timelines when this component loads
	// 2: Add a new Timeline (by calling the appropriate function) when the user clicks the "Add" button

	// const {data, loading, error} = useCallable("get_user_timelines", {});
	const user = useUser()

	const {data} = useCallable("get_user_timelines", {})

	console.log(data)

	const timelines: TimelineProps[] = [{
		timeline_name: "My First Timeline",
		timeline_id: "1",
		timeline_semesters: [
			{
				semester_id: "Fall 2023",
				semester_name: "Fall 2023",
				semester_initial_courses: [
					// {
					// 	course_id: "CS 2201",
					// 	course_name: "Discrete Structures",
					// 	course_hours: 3
					// },
					// {
					// 	course_id: "CS 3901",
					// 	course_name: "A CS course",
					// 	course_hours: 3
					// },
					// {
					// 	course_id: "HIST 2139",
					// 	course_name: "Technology, Nature, and Power in Africa",
					// 	course_hours: 3
					// },
					// {
					// 	course_id: "HONS 4139",
					// 	course_name: "Honors Seminar",
					// 	course_hours: 3
					// },
					// {
					// 	course_id: "TEST 1322",
					// 	course_name: "Test Course for Admin",
					// 	course_hours: 3
					// }
				]
			},
			{
				semester_id: "Spring 2024",
				semester_name: "Spring 2024",
				semester_initial_courses: [
					// {
					// 	course_id: "CS 2201",
					// 	course_name: "Discrete Structures",
					// 	course_hours: 3
					// },
					// {
					// 	course_id: "CS 3901",
					// 	course_name: "A CS course",
					// 	course_hours: 3
					// },
					// {
					// 	course_id: "HIST 2139",
					// 	course_name: "Technology, Nature, and Power in Africa",
					// 	course_hours: 3
					// },
					// {
					// 	course_id: "HONS 4139",
					// 	course_name: "Honors Seminar",
					// 	course_hours: 3
					// },
					// {
					// 	course_id: "TEST 1322",
					// 	course_name: "Test Course for Admin",
					// 	course_hours: 3
					// }
				]
			}
		]
	}];

	return <>
		<Container maxW={"container.lg"} py={2}>

			<Tabs size={"md"}>
				<Box key={"Header"}>
					<HStack justifyContent={"space-between"}>
						<HStack
							justifyContent={"flex-start"}
							spacing={8}
						>
							<Heading size={"md"}>
								VCP
							</Heading>
							<TabList>
								{data && data.map(timeline => <Tab key={timeline.timeline_id}>
									{timeline.timeline_name}
								</Tab>)}
							</TabList>
							<Button
								colorScheme={"blue"}
								aria-label={"Add new tab"}
								size={"sm"}
							>
								Add
							</Button>
						</HStack>

						<Link href={"/profile"}>
							<Avatar size={"sm"} src={user.photoURL}/>
						</Link>
					</HStack>
				</Box>

				<Box h={10}/>

				<TabPanels
					px={0}
					py={0}
					key={"Timeline Tabs"}
				>
					{!data? (
						<>Loading...</>
					): (data && data.map(timeline => (<React.Fragment key={timeline.timeline_id}>
						<TabPanel
							key={"Timeline"}
							p={0}
						>
							<Timeline {...timeline}/>
						</TabPanel>
					</React.Fragment>
					))
					)}
				</TabPanels>

			</Tabs>
		</Container>
	</>
}