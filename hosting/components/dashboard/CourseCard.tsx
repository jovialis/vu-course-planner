/**
 * CourseCard
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 10/5/23
 */
import {
	Button,
	Card,
	CardBody,
	HStack, Popover, PopoverArrow, PopoverBody,
	PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger,
	Spacer,
	Tag,
	TagCloseButton,
	TagLabel,
	TagRightIcon,
	Text
} from "@chakra-ui/react";

export function CourseCard(props: {
	course_name: string
	course_id: string
}) {

	return <>
		<Tag size={"lg"} key={props.course_id}>
			<TagLabel>
				<HStack>
					<Popover>
						<PopoverTrigger>
							<Button>Trigger</Button>
						</PopoverTrigger>
						<PopoverContent>
							<PopoverArrow />
							<PopoverCloseButton />
							<PopoverHeader>Confirmation!</PopoverHeader>
							<PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
						</PopoverContent>
					</Popover>
					<Text>
						{props.course_name}
					</Text>
				</HStack>
			</TagLabel>
			<Spacer/>
			<TagCloseButton/>
		</Tag>
	</>
}