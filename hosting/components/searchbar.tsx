import { Input, Text, Box, Select, Button, ButtonGroup, FormLabel, FormControl, Stack, Card, CardHeader, CardBody, CardFooter,Badge, Heading } from '@chakra-ui/react'
import React, {useContext, useEffect, useState} from "react";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
  } from '@chakra-ui/react'
import { InstantSearch, SearchBox, SearchBoxProps, Hits, Configure} from 'react-instantsearch';
import algoliasearch from 'algoliasearch/lite';
import { getFunctions, httpsCallable } from 'firebase/functions'

const searchClient = algoliasearch('TPO32B3BGQ', 'f275caf0f2df54d0da6a11ded70f877c');
const index = searchClient.initIndex('prod_COURSES_SEARCH');

export default function Search_Box() { 
    const queryHook: SearchBoxProps['queryHook'] = (query, search) => {
        search(query)
      };

    function actionCourse(hit) {
        console.log(hit.id)

        const functions = getFunctions()
        const get_timeline = httpsCallable(functions, 'get_user_timeline')

        let data = {
            timeline_id: "9SRMpNVx8N5DClZsgKO7",
        }
        console.log("data")
        console.log(data)

        get_timeline(data).then(
            (result) => {
                console.log(result)
            }
        )
        
    }

    function Hit({ hit }) {
        console.log(hit)
        return (
            <MenuItem onClick={() => actionCourse(hit)}>
                {hit.id} - {hit.name}
            </MenuItem>
        )
        
    }
    return (
        <>
            <Box m='5'>
                {/* <Text>Search</Text> */}
                <Text>Add Courses</Text>
                <InstantSearch indexName="prod_COURSES_SEARCH" searchClient={searchClient}>
                    <Configure hitsPerPage={5}  />
                    <SearchBox  queryHook={queryHook}/>
                    {/* <Box maxWidth="300px" maxLength="200px"> */}
                        <Menu>
                            <MenuButton as={Button} >
                                See the courses
                            </MenuButton>
                            <MenuList>
                                <Hits hitComponent={Hit} />
                            </MenuList>
                        </Menu>
                    {/* </Box> */}
                </InstantSearch>
            
            </Box>
        </>
    )
}   