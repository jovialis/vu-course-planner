/**
 * SidebarMajorChunk
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 10/6/23
 */
import {CheckCircleIcon} from "@chakra-ui/icons";
import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Badge,
	Box,
	Card,
	CardBody,
	Heading,
	HStack,
	Link,
	Text,
	VStack
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useCallable} from "../../hooks/UseCallable";

export function SidebarMajorChunk() {
	const {data, loading, error, refetch} = useCallable("get_user_data", {});
	const [major, setMajor] = useState("")
	useEffect(() => {
		// Check if data is available and not loading
		if (data && !loading) {
			// Assuming data.major is a string or a value, not an object
			setMajor(data.major)
			console.log(data);

			// Call the second function once data is loaded
			// const {data: data2,loading: loading2,error: error2,refetch: refetch2 } = useCallable("ingest_schema", {
			// 	path: major
			// }, null);
			// console.log(data2)
		}
	}, [data, loading]); // Re-run the effect when data or loading state changes

	const {data: data2,loading: loading2,error: error2,refetch: refetch2 } = useCallable("ingest_schema", {
			path: "../functions/src/schemas/math.json"
		}, null);
		console.log(data2)

	return <>
		<CardBody>
			<VStack alignItems={"stretch"}>
				<Box>
					<Badge colorScheme={"blue"} variant={"solid"}>
						Major
					</Badge>
				</Box>
				<Heading size={"sm"}>
					{major}
				</Heading>
				<HStack>
					<CheckCircleIcon
						color={"green.500"}
					/>
					<Text>
						Course plan complete
					</Text>
				</HStack>
				<Accordion allowToggle={true} mt={2}>
					<AccordionItem shadow={0}>
						<AccordionButton px={0}>
							<Text>
								Requirements
							</Text>
							<AccordionIcon/>
						</AccordionButton>
						<AccordionPanel px={0} shadow={0} pb={2}>
							<VStack alignItems={"stretch"} spacing={1}>
								<MajorRequirementComponent
									name={"Electives"}
									hours={12}
									viewLabel={"2 required courses"}
								/>
								<MajorRequirementComponent
									name={"Electives"}
									hours={12}
									viewLabel={"2 required courses"}
								/>
								<MajorRequirementComponent
									name={"Electives"}
									hours={12}
									viewLabel={"2 required courses"}
								/>

							</VStack>

						</AccordionPanel>
					</AccordionItem>
				</Accordion>
			</VStack>
		</CardBody>
	</>

}

function MajorRequirementComponent(props: {
	name: string
	hours: number
	viewLabel: string
}) {
	return <>
		<Card size={"sm"} variant={"filled"} shadow={"none"}>
			<CardBody>
				<VStack
					spacing={0}
					w={"100%"}
					alignItems={"stretch"}
				>
					<HStack justifyContent={"space-between"}>
						<Text>
							{props.name}
						</Text>
						<Text fontWeight={"bold"}>
							{props.hours} hrs
						</Text>
					</HStack>
					<Link color={"blue.500"} fontSize={"sm"}>
						{props.viewLabel}
					</Link>
				</VStack>
			</CardBody>
		</Card>
	</>
}