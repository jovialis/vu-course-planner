/**
 * Timeline
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 10/12/23
 */

import {
	Box,
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
import {MajorPickerBar} from "../MajorPickerBar";
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
	timeline_major?: string
	timeline_semesters: SemesterCardProps[],
	refetchTimeline: () => void
}

export function Timeline(props: TimelineProps) {

	return <TimelineProvider {...{
		timeline_id: props.timeline_id,
		timeline_semesters: props.timeline_semesters,
		timeline_name: props.timeline_name,
		timeline_major: props.timeline_major,
		refetchTimeline: props.refetchTimeline
	}}>
		<VStack alignItems={"stretch"} spacing={8}>
			<Heading size={"md"}>
				{props.timeline_name}
			</Heading>

			<HStack
				spacing={"space-between"}
				alignItems={"flex-start"}
			>
				<Stepper
					index={props.timeline_semesters.length + 1}
					orientation='vertical'
					gap={0}
					size={"md"}
				>
					{props.timeline_semesters.map((semester, i) => <Step key={i}>
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

					<Box w={80}>
						<MajorPickerBar/>
						<Box h={4}/>
						<Card>
							<SidebarMajorChunk/>
						</Card>
					</Box>
				</HStack>

			</HStack>

		</VStack>
	</TimelineProvider>
}