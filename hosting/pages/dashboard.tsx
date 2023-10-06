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
	HStack,
	IconButton,
	Step,
	StepDescription,
	StepIcon,
	StepIndicator,
	StepNumber,
	Stepper,
	StepSeparator,
	StepStatus,
	StepTitle,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	VStack
} from "@chakra-ui/react";
import React from "react";
import {CourseCard} from "../components/dashboard/CourseCard";
import {SemesterCard} from "../components/dashboard/SemesterCard";

export default function Dashboard() {
	const timelines = [{
		name: "My First Timeline",
		id: "1"
	}, {
		name: "My Second Timeline",
		id: "2"
	}];

	return <>
		<Container maxW={"full"} py={2}>

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
								{timelines.map(timeline => <Tab key={timeline.id}>
									{timeline.name}
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

						<Avatar size={"sm"}/>
					</HStack>
				</Box>

				<Box h={10}/>

				<TabPanels
					px={0}
					py={0}
					key={"Timeline Tabs"}
				>
					{timelines.map(timeline => <React.Fragment key={timeline.id}>
						<TabPanel
							key={"Timeline"}
							p={0}
						>

								<VStack alignItems={"stretch"} spacing={8}>
									<Heading size={"md"}>
										{timeline.name}
									</Heading>

									<Stepper
										index={1}
										orientation='vertical'
										gap={0}
										size={"md"}
									>
										{Array.from((Array(5).keys())).map((step, index) => (
											<Step key={index} >
												<StepIndicator>
													<StepStatus
														complete={<StepIcon />}
														incomplete={<></>}
														active={<></>}
													/>
												</StepIndicator>

												<VStack w={80} alignItems={"stretch"} mb={10} ml={2} mt={-2}>
													<SemesterCard/>
												</VStack>

												{/*<Box flexShrink='0'>*/}
												{/*	<StepTitle>{"My Step"}</StepTitle>*/}
												{/*	<StepDescription>{"My Description"}</StepDescription>*/}
												{/*</Box>*/}

												<StepSeparator/>
											</Step>
										))}
									</Stepper>

								</VStack>

						</TabPanel>
					</React.Fragment>)}
				</TabPanels>

			</Tabs>
		</Container>
	</>
}