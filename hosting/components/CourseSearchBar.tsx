import {
	Badge,
	Box,
	Button, FormControl, FormLabel,
	HStack,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	VisuallyHidden,
	VStack
} from '@chakra-ui/react'
import {AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList} from "@choc-ui/chakra-autocomplete";
import algoliasearch from 'algoliasearch/lite';
import {getFunctions, httpsCallable} from 'firebase/functions'
import React, {useRef, useState} from "react";
import {
	Configure,
	Hits,
	HitsProps,
	InstantSearch,
	SearchBox,
	SearchBoxProps, useInstantSearch,
	useRefinementList,
	useSearchBox, UseSearchBoxProps,
	useSortBy,

} from 'react-instantsearch';
import {CourseCardProps} from "./dashboard/CourseCard";
import {useDelayedCallback} from "../hooks/UseDelayedCallback";

const searchClient = algoliasearch('TPO32B3BGQ', 'f275caf0f2df54d0da6a11ded70f877c');
const index = searchClient.initIndex('prod_COURSES_SEARCH');

export function CourseSearchBar(props: {
	on_course_selected: (course: CourseCardProps) => void
}) {
	return (
		<VStack alignItems={"stretch"} w={"100%"}>
			{/*<Box m='5'>*/}
				{/* <Text>Search</Text> */}
				{/*<Text>Add Courses</Text>*/}
				<InstantSearch indexName="prod_COURSES_SEARCH" searchClient={searchClient}>
					<Configure hitsPerPage={5} />

					{/*<SearchBox queryHook={queryHook}/>*/}
					{/* <Box maxWidth="300px" maxLength="200px"> */}
					<CustomSearchBox {...props}/>
					{/* </Box> */}
				</InstantSearch>

			{/*</Box>*/}
		</VStack>
	)
}

function CustomSearchBox(props: UseSearchBoxProps & {
	on_course_selected: (course: CourseCardProps) => void
}) {
	const { query, refine, clear } = useSearchBox(props);
	const { status, results } = useInstantSearch();
	const [inputValue, setInputValue] = useState(query);
	const inputRef = useRef<HTMLInputElement>(null);

	const loading = useDelayedCallback(() => {
		if (inputValue.length === 0) {
			clear();
		} else {
			refine(inputValue);
		}
	}, 500, [inputValue]);

	function setQuery(newQuery: string) {
		setInputValue(newQuery);
	}

	// function CourseMenuItem(localProps: { hit: { id: string, name: string, number: number, subject: string, objectID: string } }) {
	// 	return (
	// 		<MenuItem onClick={() => {
	// 			props.on_course_selected({
	// 				course_id: localProps.hit.objectID,
	// 				course_name: localProps.hit.name,
	// 				course_hours: localProps.hit.hours || 3
	// 			})
	// 			setQuery("");
	// 		}}>
	// 			{localProps.hit.id} - {localProps.hit.name}
	// 		</MenuItem>
	// 	)
	// }

	return <>
		<AutoComplete isLoading={loading} disableFilter={true}>
			<AutoCompleteInput
				ref={inputRef}
				placeholder="Add courses"
				type={"search"}
				variant={"outline"}
				w={"100%"}
				value={inputValue}
				onChange={(event) => {
					setQuery(event.currentTarget.value);
				}}
			/>
			<AutoCompleteList>
				{results.hits.map((hit, i) => (
					<AutoCompleteItem
						key={`option-${hit.id}`}
						value={hit.id}
						textTransform={"capitalize"}
						onClick={() => {
							props.on_course_selected({
								course_id: hit.objectID,
								course_name: hit.name,
								course_hours: hit.hours || 3
							})
							setQuery("");
						}}
					>
						{hit.id} - {hit.name}
					</AutoCompleteItem>
				))}
			</AutoCompleteList>
		</AutoComplete>
	</>

	// return <>
	// 	<Menu
	// 		isOpen={!loading && inputValue.length > 0 && results.hits.length > 0}
	// 		autoSelect={false}
	// 		initialFocusRef={inputRef}
	// 	>
	// 		<VStack alignItems={"stretch"}>
	// 			<Input
	// 				ref={inputRef}
	// 				placeholder="Add courses"
	// 				type={"search"}
	// 				value={inputValue}
	// 				onChange={(event) => {
	// 					setQuery(event.currentTarget.value);
	// 				}}
	// 				w={"100%"}
	// 			/>
	// 			<VisuallyHidden>
	// 				<MenuButton mt={10} onFocusCapture={e => e.preventDefault()}/>
	// 			</VisuallyHidden>
	// 		</VStack>
	// 		<MenuList onFocus={e => e.preventDefault()} shadow={"xl"} autoFocus={false} onFocusCapture={e => e.stopPropagation()}>
	// 			{results.hits.map((hit, i) => <CourseMenuItem hit={hit} key={i}/>)}
	// 			{/*<Hits hitComponent={CourseMenuItem} />*/}
	// 		</MenuList>
	// 	</Menu>
	//
	//
	//
	// </>
}
