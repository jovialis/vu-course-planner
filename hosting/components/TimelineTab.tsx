/**
 * TimelineTab
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 11/13/23
 */
import {ChevronDownIcon} from "@chakra-ui/icons";
import {
	Button,
	HStack,
	Icon,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Tab,
	TabProps,
	Text
} from "@chakra-ui/react";
import {MdMore, MdMoreHoriz, MdMoreVert} from "react-icons/md";
import {DeleteTimelineDialog} from "./DeleteTimelineDialog";
import {RenameTimelineModal} from "./RenameTimelineModal";

export function TimelineTab(props: {
	timeline_id: string
	timeline_name: string
	refetchTimeline: () => void
}) {
	return <>
		<Tab {...props}>
			<HStack spacing={4}>
				<Text>
					{props.timeline_name}
				</Text>
				<Menu>
					<MenuButton
						as={IconButton}
						aria-label={"options"}
						variant={"ghost"}
						icon={<Icon as={MdMoreVert} boxSize={5}/>}
						size={"xs"}
					/>
					<MenuList color={"initial"}>
						<RenameTimelineModal
							initialName={props.timeline_name}
							timeline_id={props.timeline_id}
							refetchTimeline={props.refetchTimeline}
						>
							{onOpen => <MenuItem onClick={onOpen}>
								Rename
							</MenuItem>}
						</RenameTimelineModal>
						<DeleteTimelineDialog
							timeline_id={props.timeline_id}
							refetchTimelines={() => {
								props.refetchTimeline();
							}}
						>
							{onOpen => <MenuItem color={"red.500"} onClick={onOpen}>
								Delete
							</MenuItem>}
						</DeleteTimelineDialog>

					</MenuList>
				</Menu>
			</HStack>
		</Tab>
	</>;
}