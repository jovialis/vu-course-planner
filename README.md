# VU Course Planner
A course planner built for Vanderbilt students. Designed as a part of VU CS 4278 (Principles of SWE)

Team: [Bruce Guo](mailto:ziyuan.guo@vanderbilt.edu), 
[Dylan Hanson](mailto:charles.d.hanson@vanderbilt.edu),
[Kyle Kwon](mailto:youngbin.kwon@vanderbilt.edu), 
[Mi Nyugen](mailto:thu.nguyen@vanderbilt.edu)

### Useful Links
[Trello](https://trello.com/b/o2niYrcJ/vcp-project-management) | 
[Firebase](https://console.firebase.google.com/project/vu-course-planner/overview) | 
[Firebase Documentation](https://firebase.google.com/docs) | 
[Chakra UI Documentation](https://chakra-ui.com/)

## Introduction
We are creating the Vanderbilt Course Planner (VCP) to help Vanderbilt Undergraduate students in course selection and planning out their future years of coursework at Vanderbilt. Figuring out what course to take is always a stressful task. VCP will have a roadmap interface to show the student’s academic progression throughout the semesters, and it will give students the option to have an "AI" automatically generate an academic track for the student. If a student wants more freedom in their own course choice, VCP will also allow them to personalize their plans with ease through our helpful features like course searching and filtering.

## Tooling

#### Global
- Firebase

#### Frontend
- React
- Typescript
- Next.JS
- Chakra UI

#### Backend
- Python
- Node/Tyescript
- Firestore Database

## Setup

#### Install languages and toolkits
1. Install Node.JS: [Download Link](https://nodejs.org/en/download)
2. Install Python 3.8 or later: [Download Link](https://www.python.org/downloads/)
3. Install the Firebase CLI: ```npm install -g firebase-tools```

#### Install project dependencies
1. Run ```yarn install``` (only needs to be done once, ever, upon first downloading this repo)
2. Run ```yarn run script:install```

#### Connect this codebase to Firebase
1. Login to Firebase: ```firebase login```
2. Point Firebase to the right project: ```firebase use vu-course-planner```
3. Download the Firebase local emulators: ```firebase init emulators```. Select Functions and Hosting.
4. Go to the Firebase console [HERE](https://console.firebase.google.com/u/1/project/vu-course-planner/settings/general/web:ZWZlNGY0OWItNzlkNi00MmQwLWFiOTctZTk0NzkxMTFlNGU0?nonce=1694634362926), scroll down to the "VCP Dashboard" webapp, and copy/paste the relevant secrets into the `hosting/.env.local` file

## Start development environment
1. ```yarn run dev```
2. Visit [localhost:5002](http://localhost:5002) to see the website. 
3. Any changes you make to the codebase will be automatically loaded.

## Testing

#### Backend
The idea here is to import the function you're testing, try a variety of inputs, assert that the function gives the right output, and profit!
- Write all tests in the `tests/` folder.
- Run tests by executing the `test.sh` script, or by typing `python -m pytest tests/` from the `functions` directory.
- Read the Pytest documentation: [here](https://docs.pytest.org/en/7.4.x/)

#### Frontend
The idea here is to import the Component you're testing, give it different parameters, and ensure that it renders the contents correctly.
- Write all tests in the `__tests__` folder of hosting
- Run tests by executing the `test.sh` script, or by typing `yarn workspace hosting run test`.
- Read the documentation for [Testing Library](https://testing-library.com/docs/react-testing-library/setup/#jest-28)

## Deployment
Deploy using `firebase deploy`.