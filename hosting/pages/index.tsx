/**
 * index
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 9/6/23
 */
import { UserLoginGate } from "../components/UserLoginGate";
import ImageDisplay from "../components/Header";

export default function HomePage() {
  return (
    <>
      <ImageDisplay imagePath="/images/vuplannerbanner.png" altText=""/>
      <UserLoginGate>Hello, world!</UserLoginGate>
    </>
  );
}
