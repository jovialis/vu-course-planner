import { Input, Text, Box, Select, Button, ButtonGroup, FormLabel, FormControl, Stack, Card, CardHeader, CardBody, CardFooter,Badge, Heading } from '@chakra-ui/react'
import React, {useContext, useEffect, useState} from "react";
import { InstantSearch, SearchBox, SearchBoxProps, Hits, Configure} from 'react-instantsearch';
import algoliasearch from 'algoliasearch/lite';


const searchClient = algoliasearch('TPO32B3BGQ', 'f275caf0f2df54d0da6a11ded70f877c');
const index = searchClient.initIndex('prod_COURSES_SEARCH');

export default function Search_Box() { 
    const queryHook: SearchBoxProps['queryHook'] = (query, search) => {
        search(query)
      };

    function actionCourse(id) {
        return 1
    }

    function Hit({ hit }) {
        console.log(hit)
        return (
            <Box onClick = {() => actionCourse(hit.id)}>
                {/* <Stack>
                    <Badge>{hit.id}</Badge>
                </Stack> */}
                <Card  margin="10px">
                    <Heading size='xs' textTransform='uppercase' ml='5'>
                        {hit.id}
                    </Heading>
                    <CardBody>
                        <Text>{hit.name}</Text>
                    </CardBody>
                </Card>
            </Box>
        )
        
    }
    return (

        <Box m='5'>
            <Text>Search</Text>
            <InstantSearch indexName="prod_COURSES_SEARCH" searchClient={searchClient}>
                <Configure hitsPerPage={5}  />
                <SearchBox  queryHook={queryHook}/>
                <Box maxWidth="300px" maxLength="200px">
                    <Hits hitComponent={Hit} />
                </Box>
            </InstantSearch>
          
        </Box>
    )
}   