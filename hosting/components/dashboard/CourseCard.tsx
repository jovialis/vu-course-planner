/**
 * CourseCard
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 10/5/23
 */
import {ChevronDownIcon} from "@chakra-ui/icons";
import {
	Button,
	Card,
	CardBody,
	HStack, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Popover, PopoverArrow, PopoverBody,
	PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger,
	Spacer,
	Tag,
	TagCloseButton,
	TagLabel,
	TagRightIcon,
	Text
} from "@chakra-ui/react";
import {CgOptions} from "react-icons/cg";
import {MdMoreHoriz} from "react-icons/md";
import {CourseDetailsModal} from "../CourseDetailsModal";

export interface CourseCardProps {
	course_name: string
	course_id: string
	course_hours?: number
}

export function CourseCard(props: CourseCardProps & {
	onRemove: () => void
}) {
	return <>
		<Tag size={"lg"} key={props.course_id}>
			<TagLabel>
				<HStack>
					<CourseDetailsModal course_id={props.course_id} course_name={props.course_name}>
						{onOpen => <>
							<Popover trigger={"hover"} placement={"top"}>
								<PopoverTrigger>
									<Text
										textDecoration={"dotted"}
										textDecorationLine={"underline"}
										cursor={"pointer"}
										onClick={onOpen}
									>
										{props.course_id}
									</Text>
								</PopoverTrigger>
								<PopoverContent shadow={"xl"}>
									<PopoverArrow />
									<PopoverBody>
										<Text>
											{props.course_name}
										</Text>
									</PopoverBody>
								</PopoverContent>
							</Popover>
						</>}
					</CourseDetailsModal>
				</HStack>
			</TagLabel>
			<Spacer/>
			<Menu>
				<MenuButton
					as={IconButton}
					aria-label={"Open course options"}
					icon={<Icon ml={"auto"} as={MdMoreHoriz}/>}
					variant={"link"}
					w={"auto"}
				/>
				<MenuList shadow={"xl"}>
					<MenuItem
						color={"red.400"}
						onClick={props.onRemove}
					>
						Remove
					</MenuItem>
				</MenuList>
			</Menu>

		</Tag>
	</>
}