/**
 * Timeline
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 10/12/23
 */

import {
	Button,
	Card,
	Heading,
	HStack,
	Icon,
	Spacer,
	Step,
	StepIndicator,
	Stepper,
	StepSeparator,
	StepStatus,
	VStack
} from "@chakra-ui/react";
import React, {PropsWithChildren, useContext, useState} from "react";
import {MdCalendarToday} from "react-icons/md";
import {SemesterCard, SemesterCardProps} from "./SemesterCard";
import {SidebarMajorChunk} from "./SidebarMajorChunk";

const TimelineContext = React.createContext<TimelineProps>(null)

export function TimelineProvider(props: TimelineProps & PropsWithChildren) {
	return <TimelineContext.Provider value={props}>
		{props.children}
	</TimelineContext.Provider>
}

export function useTimeline() {
	return useContext(TimelineContext);
}

export interface TimelineProps {
	timeline_id: string
	timeline_name: string
	timeline_semesters: SemesterCardProps[]
}

export function Timeline(props: TimelineProps) {
	const [name, setName] = useState(props.timeline_name);
	const [semesters, setSemesters] = useState(props.timeline_semesters);

	function setTimelineName(name: string) {
		// TODO: Update this on the server

		setName(name);
	}

	function addTimelineSemester() {
		// TODO: Update this on the server

		setSemesters(semesters => [
			...semesters,
			{
				semester_name: "Fall 202X",
				semester_id: "fall202x",
				semester_courses: []
			}
		])
	}

	return <TimelineProvider {...{
		timeline_id: props.timeline_id,
		timeline_semesters: semesters,
		timeline_name: name
	}}>
		<VStack alignItems={"stretch"} spacing={8}>
			<Heading size={"md"}>
				{name}
			</Heading>

			<HStack
				spacing={"space-between"}
				alignItems={"flex-start"}
			>
				<Stepper
					index={semesters.length + 1}
					orientation='vertical'
					gap={0}
					size={"md"}
				>
					{semesters.map((semester, i) => <Step key={i}>
						<StepIndicator>
							<StepStatus
								complete={<Icon as={MdCalendarToday} boxSize={4}/>}
								incomplete={<></>}
								active={<></>}
							/>
						</StepIndicator>

						<VStack w={80} alignItems={"stretch"} mb={10} ml={2} mt={-2}>
							<SemesterCard {...semester}/>
						</VStack>

						<StepSeparator/>
					</Step>)}
					{/*<Button w={"100%"} onClick={() => addTimelineSemester()}>*/}
					{/*	Add Semester*/}
					{/*</Button>*/}
				</Stepper>

				<HStack flex={1} justifyContent={"flex-end"}>
					<Spacer/>
					<Card w={80}>
						<SidebarMajorChunk/>
					</Card>
				</HStack>

			</HStack>

		</VStack>
	</TimelineProvider>
}