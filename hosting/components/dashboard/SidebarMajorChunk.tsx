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

export function SidebarMajorChunk() {
	return <>
		<CardBody>
			<VStack alignItems={"stretch"}>
				<Box>
					<Badge colorScheme={"blue"} variant={"solid"}>
						Major
					</Badge>
				</Box>
				<Heading size={"sm"}>
					Computer Science
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