/**
 * RenameTimelineModal
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 11/13/23
 */
import {
	Button, Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay, Text, useDisclosure, useToast, VStack
} from "@chakra-ui/react";
import {ReactElement, useEffect, useState} from "react";
import {useLazyCallable} from "../hooks/UseLazyCallable";

export function RenameTimelineModal(props: {
	children: (onOpen: () => void) => ReactElement,
	initialName: string
	timeline_id: string
	refetchTimeline: () => void
}) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const toast = useToast();

	const [name, setName] = useState(props.initialName);

	useEffect(() => {
		if (isOpen) {
			setName(props.initialName)
		}
	}, [isOpen]);

	const [renameTimeline, {loading: renameLoading}] = useLazyCallable("rename_user_timeline", {}, {
		onSuccess: data => {
			toast({
				status: "success",
				title: "Renamed timeline"
			})

			props.refetchTimeline();
			onClose();
		}
	});

	return <>
		{props.children(onOpen)}
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Rename Timeline</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack alignItems={"stretch"}>
						<Text>
							Name
						</Text>
						<Input
							value={name}
							onChange={e => setName(e.target.value)}
						/>
					</VStack>
				</ModalBody>

				<ModalFooter>
					<Button colorScheme={"gray"} mr={2} onClick={onClose} size={"sm"}>
						Close
					</Button>
					<Button
						size={"sm"}
						colorScheme={"blue"}
						onClick={() => {
							renameTimeline({
								timeline_id: props.timeline_id,
								new_name: name
							})
						}}
						isLoading={renameLoading}
					>
						Rename
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	</>
}