/**
 * MajorVisualizationElement
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 12/1/23
 */
import {CheckCircleIcon} from "@chakra-ui/icons";
import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel, Box, Button, Card, CardBody,
	Heading,
	HStack, Link, Spinner,
	Text, VStack, Wrap, WrapItem
} from "@chakra-ui/react";
import {useEffect, useMemo, useState} from "react";
import {useCallable} from "../hooks/UseCallable";
import {useLazyCallable} from "../hooks/UseLazyCallable";
import {useTimeline} from "./dashboard/Timeline";
import {GenerateCoursePlanButton} from "./GenerateCoursePlanButton";
import {MajorSchemaReader} from "./MajorSchemaReader";
import {QualifyingCoursesModal} from "./QualifyingCoursesModal";

export function MajorVisualizationElement(props: {
	major_id: string
}) {
	const {data, loading, error, refetch} = useCallable("get_major_schema", {
		major: props.major_id
	});

	useEffect(() => {
		refetch({
			major: props.major_id
		});

		setSelectedPaths({});
	}, [props.major_id]);

	const schemaReader = data ? new MajorSchemaReader(data) : null;

	const [selectedPaths, setSelectedPaths] = useState<Record<string, number>>({});
	const remainingPathsToSelect = useMemo(() => {
		if (schemaReader) {
			return schemaReader.getPathSelectionsNeeded(selectedPaths)
		} else {
			return [];
		}
	}, [data, selectedPaths])

	const allPathsSelected = useMemo(() => {
		for (const toSelect of remainingPathsToSelect) {
			if (typeof selectedPaths[toSelect] !== "number")
				return false;
		}
		return true;
	}, [data, remainingPathsToSelect, selectedPaths]);

	if (!data) {
		return <Spinner/>
	}

	return <>
		<Heading size={"sm"}>
			{data.Name}
		</Heading>
		{/*<HStack>*/}
		{/*	<CheckCircleIcon*/}
		{/*		color={"green.500"}*/}
		{/*	/>*/}
		{/*	<Text>*/}
		{/*		Course plan complete*/}
		{/*	</Text>*/}
		{/*</HStack>*/}

		<VStack alignItems={"stretch"} spacing={4}>

			{ remainingPathsToSelect.map((path, i) => <PathPickerNeeded
				key={i}
				reader={schemaReader}
				requirement_id={path}
				selected_path={selectedPaths[path]}
				setSelectedPath={(index) => {
					setSelectedPaths(prevState => ({
						...prevState,
						[path]: index
					}))
				}}
			/>) }

		</VStack>

		<Box h={2}/>

		{!allPathsSelected && <>
			<Text color={"red.500"} fontSize={"xs"}>
				Select your paths to generate a course plan
			</Text>
		</>}

		{allPathsSelected && data && <Accordion allowToggle={true}>
            <AccordionItem shadow={0}>
                <AccordionButton px={0}>
                    <Text>
                        Requirements
                    </Text>
                    <AccordionIcon/>
                </AccordionButton>
                <AccordionPanel px={0} shadow={0} pb={2}>
                    <VStack alignItems={"stretch"} spacing={1}>
						{data.Requirements?.map(req => <MajorRequirementComponent
							key={req.id}
							requirement_id={req.id}
							reader={schemaReader}
							selectedPaths={selectedPaths}
						/>)}
                    </VStack>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>}

		<GenerateCoursePlanButton
			isDisabled={!(allPathsSelected && data)}
			selectedPaths={selectedPaths}
		/>
	</>
}

function MajorRequirementComponent(props: {
	requirement_id: string,
	reader: MajorSchemaReader,
	selectedPaths: Record<string, number>
}) {
	const [requirement] = props.reader.getRequirementByID(props.requirement_id);

	const requiredCourses = requirement.getCoreCoursesToTake(
		props.selectedPaths,
		false
	);

	const remainderCourses = requirement.getRemainderCourses(
		props.selectedPaths
	);

	return <>
		<Card size={"sm"} variant={"filled"} shadow={"none"}>
			<CardBody>
				<VStack
					spacing={0}
					w={"100%"}
					alignItems={"stretch"}
				>
					<HStack justifyContent={"space-between"} alignItems={"flex-start"}>
						<Text>
							{requirement.name}
						</Text>
						<Text fontWeight={"bold"} whiteSpace={"nowrap"}>
							{requirement.hours} hrs
						</Text>
					</HStack>

					{requiredCourses.length > 0 && <>
						<QualifyingCoursesModal
							items={requiredCourses}
							title={requirement.name}
						>
							{onOpen => <Link
								color={"blue.500"}
								fontSize={"sm"}
								onClick={onOpen}
							>
								{(() => {
									const filters = requiredCourses.filter(course => course.isFilter())
									const courses = requiredCourses.filter(course => course.isClass())

									if (courses.length > 0 && filters.length > 0) {
										// @ts-ignore
										return `From ${courses.length} Qualifying Courses or ${filters.map(course => course?.subject).join(", ")} Courses`
									} else if (courses.length > 0) {
										return `From ${courses.length} Qualifying Courses`
									} else if (filters.length > 0) {
										// @ts-ignore
										return `${filters.map(course => course?.subject).join(", ")} Courses`
									} else {
										return ""
									}
								})()}
							</Link>}
						</QualifyingCoursesModal>
                    </>}

					{remainderCourses.length > 0 && <>
						{requiredCourses.length > 0 && <>
                            <Text fontSize={"xs"} color={"gray.500"}>
                                With the remainder picked
                            </Text>
						</>}

						<QualifyingCoursesModal
							items={remainderCourses}
                            title={requirement.name}
                        >
							{onOpen => <Link
								color={"blue.500"}
								fontSize={"sm"}
								onClick={onOpen}
							>
								{(() => {
									const filters = remainderCourses.filter(course => course.isFilter())
									const courses = remainderCourses.filter(course => course.isClass())

									if (courses.length > 0 && filters.length > 0) {
										// @ts-ignore
										return `From ${courses.length} Qualifying Courses or ${filters.map(course => course?.subject).join(", ")} Courses`
									} else if (courses.length > 0) {
										return `From ${courses.length} Qualifying Courses`
									} else if (filters.length > 0) {
										// @ts-ignore
										return `From ${filters.map(course => course?.subject).join(", ")} Courses`
									} else {
										return ""
									}
								})()}
							</Link>}
						</QualifyingCoursesModal>

					</>}

				</VStack>
			</CardBody>
		</Card>
	</>
}

function PathPickerNeeded(props: {
	reader: MajorSchemaReader,
	requirement_id: string
	selected_path?: number,
	setSelectedPath: (index: number) => void
}) {
	const requirementChain = props.reader.getRequirementByID(props.requirement_id);
	const coreReq = requirementChain[0]

	const path = requirementChain.slice(1).map(req => req.name).reverse();

	return <VStack alignItems={"stretch"} spacing={0}>
		{path.length > 0 && <Text fontSize={"xs"} color={"gray.500"}>
			{path.join(" > ")} {" >"}
        </Text>}
		<Text>
			{coreReq?.name}
		</Text>
		<Wrap mt={2}>
			{coreReq?.paths.map((path, i) => <WrapItem
				key={i}
			>
				<Button
					size={"xs"}
					onClick={() => props.setSelectedPath(i)}
					colorScheme={props.selected_path === i ? "blue" : "gray"}
				>
					{(() => {
						if (path.isRequirement()) {
							return path.name || path.id
						} else if (path.isClass()) {
							return path.course;
						} else if (path.isFilter()) {
							return `Self-Selected from ${path.subject}`
						}
					})()}
				</Button>
			</WrapItem>)}
		</Wrap>
	</VStack>
}