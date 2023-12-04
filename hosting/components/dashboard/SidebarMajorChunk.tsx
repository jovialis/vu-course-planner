/**
 * SidebarMajorChunk
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 10/6/23
 */
import {CheckCircleIcon, CloseIcon} from "@chakra-ui/icons";
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
    VStack,
    Select
} from "@chakra-ui/react";
import {LogoutButton} from "../LogoutButton";
import {useState} from "react";
import {useLazyCallable} from "../../hooks/UseLazyCallable";
import {useCallable} from "../../hooks/UseCallable";

export function SidebarMajorChunk() {
    const [selectedMajor, setSelectedMajor] = useState('');
    const [passReq, setPassReq] = useState(false);
    const [status, {data:data, loading: loading}] = useLazyCallable("get_user_grad_status", {
        major_id: selectedMajor
    })

    const handleMajorChange = (event) => {
        setSelectedMajor(event.target.value);
        status();
        // Call backend here
    };


    return <>
        <Flex direction="column">
            <CardBody>
                <VStack alignItems={"stretch"}>
                    <Box>
                        <Badge colorScheme={"blue"} variant={"solid"}>
                            Major
                        </Badge>
                    </Box>
                    <Heading size={"sm"}>
                        <VStack spacing={4} align="stretch">
                            <Text fontSize="l" fontWeight="bold">
                                Choose a Major:
                            </Text>
                            <Select
                                placeholder="Select a Major"
                                value={selectedMajor}
                                onChange={handleMajorChange}
                                size="sm"
                            >
                                <option value="computer_science">Computer Science</option>
                                <option value="economics">Economics</option>
                                <option value="history">History</option>
                                <option value="math">Math</option>
                                <option value="psychology">Psychology</option>
                            </Select>
                            {selectedMajor && (
                                <HStack>
                                    {data ? (
                                        <CheckCircleIcon color="green.500"/>
                                    ) : (
                                        <CloseIcon color="red.500"/>
                                    )}
                                    <Text>
                                        Course plan complete
                                    </Text>
                                </HStack>
                            )}
                        </VStack>
                    </Heading>
                    {/*<HStack>*/}
                    {/*    <CheckCircleIcon*/}
                    {/*        color={"green.500"}*/}
                    {/*    />*/}
                    {/*    <Text>*/}
                    {/*        Course plan complete*/}
                    {/*    </Text>*/}
                    {/*</HStack>*/}
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
        </Flex>
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