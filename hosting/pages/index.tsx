/**
 * index
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 9/6/23
 */
import {UserLoginGate} from "../components/UserLoginGate";
import ImageDisplay from "../components/Header";
import {CourseInfo} from "../components/CourseInfo";

export default function HomePage() {
    return (
        <>
            <ImageDisplay imagePath="/images/vuplannerbanner.png" altText=""/>
            <CourseInfo/>
            <UserLoginGate>Hello, world!</UserLoginGate>
        </>
    );
}
