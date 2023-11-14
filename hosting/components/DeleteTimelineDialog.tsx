/**
 * DeleteTimelineDialog
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 11/13/23
 */
import {
	AlertDialog, AlertDialogBody,
	AlertDialogContent, AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	useDisclosure, useToast
} from "@chakra-ui/react";
import {ReactElement, useRef} from "react";
import {useLazyCallable} from "../hooks/UseLazyCallable";

export function DeleteTimelineDialog(props: {
	children: (onOpen: () => void) => ReactElement,
	timeline_id: string,
	refetchTimelines: () => void
}) {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const cancelRef = useRef();

	const toast = useToast();

	const [deleteTimelines, {loading: deleteLoading}] = useLazyCallable("del_user_timeline", {
		timeline_id: props.timeline_id
	}, {
		onSuccess: data => {
			toast({
				status: "success",
				title: "Deleted timeline"
			})

			props.refetchTimelines();
			onClose();
		}
	});

	return <>
		{props.children(onOpen)}
		<AlertDialog
			isOpen={isOpen}
			leastDestructiveRef={cancelRef}
			onClose={onClose}
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize='lg' fontWeight='bold'>
						Delete Timeline
					</AlertDialogHeader>

					<AlertDialogBody>
						This action cannot be undone.
					</AlertDialogBody>

					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={onClose} size={"sm"}>
							Cancel
						</Button>
						<Button
							colorScheme='red'
							onClick={() => {
								deleteTimelines();
							}}
							ml={3}
							size={"sm"}
							isLoading={deleteLoading}
						>
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	</>
}