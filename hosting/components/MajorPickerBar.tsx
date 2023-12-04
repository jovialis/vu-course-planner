/**
 * MajorPickerBar
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 12/1/23
 */
import {ChevronDownIcon} from "@chakra-ui/icons";
import {Button, Menu, MenuButton, MenuItem, MenuList, useToast} from "@chakra-ui/react";
import {AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList} from "@choc-ui/chakra-autocomplete";
import React, {useRef} from "react";
import {useCallable} from "../hooks/UseCallable";
import {useLazyCallable} from "../hooks/UseLazyCallable";
import {useTimeline} from "./dashboard/Timeline";

export function MajorPickerBar(props: {}) {
	const timeline = useTimeline()
	const {data, loading} = useCallable("list_majors");

	const toast = useToast()

	const [updateTimelineMajor, {loading: updateLoading}] = useLazyCallable("update_timeline_major", {}, {
		onError: error => toast({
			title: error.message,
			status: "error"
		}),
		onSuccess: data => {
			toast({
				title: "Updated timeline major",
				status: "success"
			})

			timeline.refetchTimeline();
		}
	})

	return <>
		<Menu>
			<MenuButton
				as={Button}
				rightIcon={<ChevronDownIcon />}
				isLoading={loading || updateLoading}
				isDisabled={!data}
				colorScheme={"blue"}
				variant={"outline"}
				flex={1}
				w={"100%"}
			>
				{timeline.timeline_major ? timeline.timeline_major.toUpperCase().replaceAll("_", "") : "Select Major"}
			</MenuButton>
			<MenuList>
				{data && <>
					{data.map((major, i) => (
						<MenuItem
							key={`option-${major}`}
							textTransform={"uppercase"}
							onClick={() => {
								updateTimelineMajor({
									timeline_id: timeline.timeline_id,
									major_id: major
								})
							}}
						>
							{major}
						</MenuItem>
					))}
                </>}
			</MenuList>
		</Menu>
	</>
}