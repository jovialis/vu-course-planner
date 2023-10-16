import React from 'react';

interface ImageDisplayProps {
	imagePath: string;
	altText: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({imagePath, altText}) => {
	return (
		<div>
			<img src={imagePath} alt={altText}/>
		</div>
	);
};

export default ImageDisplay;


// import { Container } from "@chakra-ui/react";
// import React from "react";
// import Banner from "../images/vuplannerbanner.png";

// // const Banner: string = "/Users/thunguyen/Mirror/Vanderbilt/School/FallTerm2023/Principles of SWE/vu-course-planner/hosting/images/vuplannerbanner.png";

// export function Header() {
//   return (
//     <>
//       <Container>
//         <a href="#">
//           <img src={Banner} alt="" className="w-[20000px] h-[10000px]" />
//         </a>
//       </Container>
//     </>
//   );
// }
