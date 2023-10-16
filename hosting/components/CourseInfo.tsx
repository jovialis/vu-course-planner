import {Card, CardBody, CardHeader, Heading, Grid, GridItem} from "@chakra-ui/react";

export function CourseInfo() {
    return <>
        <Card>
            <CardHeader>
                <Heading size='md'>CS 3251: Intermediate Software Design</Heading>
            </CardHeader>

            <CardBody>
                <Grid
                    h='400px'
                    w='800px'
                    templateRows='repeat(4, 1fr)'
                    templateColumns='repeat(20, 1fr)'
                    gap={10}>
                    <GridItem rowSpan={4} colSpan={8} bg='tomato'/>
                    <GridItem colSpan={6} rowSpan={3} bg='papayawhip'/>
                    <GridItem colSpan={6} rowSpan={1} bg='papayawhip'/>
                    <GridItem colSpan={6} rowSpan={1} bg='tomato'/>
                    <GridItem colSpan={6} rowSpan={1} bg='tomato'/>
                    <GridItem colSpan={6} rowSpan={1} bg='tomato'/>
                </Grid>
                <br/>
                <Grid
                h='200px'
                w='800px'
                templateRows='repeat(3, 1fr)'
                templateColumns='repeat(20, 1fr)'
                gap={10}>
                    <GridItem rowSpan={3} colSpan={8} bg='papayawhip'/>
                    <GridItem rowSpan={2} colSpan={10} bg='green.500'/>
                    <GridItem rowSpan={1} colSpan={2}/>
                    <GridItem rowSpan={1} colSpan={2} bg='purple'/>
                    <GridItem rowSpan={1} colSpan={5} bg='beige'/>
                </Grid>
            </CardBody>
        </Card>
    </>
}