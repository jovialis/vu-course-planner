import {
	Badge,
	Box,
	Button,
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


	function setQuery(newQuery: string) {
		setInputValue(newQuery);

		if (newQuery.length === 0) {
			clear();
		} else {
			refine(newQuery);
		}
	}

	function CourseMenuItem(localProps: { hit: { id: string, name: string, number: number, subject: string, objectID: string } }) {
		return (
			<MenuItem onClick={() => {
				props.on_course_selected({
					course_id: localProps.hit.objectID,
					course_name: localProps.hit.name,
					course_hours: localProps.hit.hours || 3
				})
				setQuery("");
			}}>
				{localProps.hit.id} - {localProps.hit.name}
			</MenuItem>
		)
	}

	return <>
		<Menu
			isOpen={inputValue.length > 0 && results.hits.length > 0}
			autoSelect={false}
			initialFocusRef={inputRef}
		>
			<VStack alignItems={"stretch"}>
				<Input
					ref={inputRef}
					placeholder="Add courses"
					type={"search"}
					value={inputValue}
					onChange={(event) => {
						setQuery(event.currentTarget.value);
					}}
					w={"100%"}
				/>
				<VisuallyHidden>
					<MenuButton mt={10}/>
				</VisuallyHidden>
			</VStack>
			<MenuList shadow={"xl"} autoFocus={false} onFocusCapture={e => e.stopPropagation()}>
				{results.hits.map((hit, i) => <CourseMenuItem hit={hit} key={i}/>)}
				{/*<Hits hitComponent={CourseMenuItem} />*/}
			</MenuList>
		</Menu>



	</>
}
