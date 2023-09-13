# vu-course-planner

A course planner built for Vanderbilt students. Project for CS 4278 (Principles of SWE)

### Setup
#### Install languages and toolkits
1. Install Node.JS: [Download Link](https://nodejs.org/en/download)
2. Install Python 3.8 or later: [Download Link](https://www.python.org/downloads/)
3. Install the Firebase CLI: ```npm install -g firebase-tools```
#### Install project dependencies
```yarn run script:install```
#### Connect this codebase to Firebase
1. Login to Firebase: ```firebase login```
2. Point Firebase to the right project: ```firebase use vu-course-planner```
3. Download the Firebase local emulators: ```firebase init emulators```. Select Functions and Hosting.
### Start development environment
1. ```yarn run dev```
2. Visit [localhost:5002](http://localhost:5002) to see the website. 
3. Any changes you make to the codebase will be automatically loaded.

NOTE: There is a bug where functions in the "Functions" directory are not being picked up due to issues with the Python venv setup... To be fixed!