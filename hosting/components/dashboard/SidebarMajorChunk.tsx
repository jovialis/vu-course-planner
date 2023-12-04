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
    CardBody, Flex,
    Heading,
    HStack,
    Link,
    Text,
    VStack
} from "@chakra-ui/react";
import {useEffect} from "react";
import {useCallable} from "../../hooks/UseCallable";
import {useLazyCallable} from "../../hooks/UseLazyCallable";
import {LogoutButton} from "../LogoutButton";
import {MajorPickerBar} from "../MajorPickerBar";
import {MajorVisualizationElement} from "../MajorVisualizationElement";
import {useTimeline} from "./Timeline";

export function SidebarMajorChunk() {
	const timeline = useTimeline();

    return <>
        <Flex direction="column">
            <CardBody>
                <VStack alignItems={"stretch"}>
	                {timeline.timeline_major && <>
                        {/*<Box>*/}
                        {/*    <Badge colorScheme={"blue"} variant={"solid"}>*/}
                        {/*        Major*/}
                        {/*    </Badge>*/}
                        {/*</Box>*/}

                        <MajorVisualizationElement
                            major_id={timeline.timeline_major}
                        />
	                </>}
                </VStack>
            </CardBody>
        </Flex>
    </>

}

