📚 Prepify

Prepify is an AI-inspired study planning mobile application built with React Native (Expo) that helps students create structured, personalized study schedules based on their subjects, exam dates, priorities, study availability, and preferred study style.

Designed with a bold Soft Brutalism aesthetic, Prepify combines intelligent scheduling, progress tracking, and productivity-focused workflows to help students stay organized and consistent throughout their exam preparation journey.

⸻

✨ Features

🎯 Smart Schedule Creation

Create fully customized study plans by providing:

* Multiple subjects
* Exam dates
* Subject priorities
* Daily study hours
* Preferred study style (Morning Person / Night Owl)

⸻

🧠 Intelligent Study Plan Generation

Prepify generates realistic study schedules using a rule-based planning engine that:

* Prioritizes subjects with upcoming exams
* Considers user-defined subject importance
* Distributes available study hours efficiently
* Creates structured study sessions
* Generates actionable study tasks

⸻

📅 Dynamic Subject Management

Users can:

* Select the number of subjects they are preparing for
* Add subject-specific details
* Assign priority levels
* Select valid future exam dates using a calendar picker

⸻

🔥 Focus Mode

Stay productive with:

* Dedicated focus sessions
* Clean distraction-free interface
* Study streak tracking
* Motivational prompts

⸻

📊 Insights Dashboard

Track your progress with:

* Study completion statistics
* Subject distribution
* Daily productivity metrics
* Consistency tracking
* Progress summaries

⸻

⚡ Recovery Mode

Falling behind?

Prepify can generate a recovery-focused study plan by:

* Reprioritizing urgent subjects
* Compressing schedules
* Helping users get back on track

⸻

🎨 Design Philosophy

Prepify uses a Soft Brutalism design language:

* Warm cream backgrounds
* Bold typography
* Thick black borders
* Hard shadows
* Playful asymmetrical layouts
* High-contrast components
* Delightful micro-interactions

The goal is to create a productivity app that feels energetic, modern, and approachable rather than corporate or sterile.

⸻

🏗️ Application Flow
Home
 ↓
Create Schedule
 ↓
Review Schedule
 ↓
Generate Plan
 ↓
Plan Screen
 ↓
Insights / Focus Mode

📱 Screens

Home Screen

* Schedule overview
* Active plan summary
* Quick access to study tools

Create Schedule

* Dynamic subject creation
* Exam date selection
* Priority assignment
* Study preference setup

Review Screen

* Input verification
* Plan generation trigger

Loading Screen

* Plan generation animation
* Schedule preparation status

Plan Screen

* Daily study schedule
* Task tracking
* Progress monitoring

Focus Mode

* Pomodoro-style study sessions
* Streak reinforcement

Insights Screen

* Performance analytics
* Study summaries
* Productivity tracking

Recovery Mode

* Emergency schedule regeneration
* Priority adjustment

⸻

🛠️ Tech Stack

Frontend

* React Native
* Expo
* React Navigation

State Management

* React Context API

UI

* Custom Component System
* Soft Brutalism Design Language

Scheduling Engine

* Local Rule-Based Planning System

⸻

📂 Project Structure
Prepify/
│
├── components/
│   ├── Button.js
│   ├── Card.js
│   ├── Input.js
│
├── screens/
│   ├── HomeScreen.js
│   ├── CreateScheduleScreen.js
│   ├── ReviewScreen.js
│   ├── LoadingScreen.js
│   ├── PlanScreen.js
│   ├── InsightsScreen.js
│   ├── FocusModeScreen.js
│   └── BacklogModeScreen.js
│
├── context/
│   └── PlanContext.js
│
├── utils/
│   ├── localPlanner.js
│   └── helpers.js
│
├── theme/
│   └── theme.js
│
├── App.js
│
└── README.md

🚀 Getting Started

Clone Repository
git clone https://github.com/KartikkkxD/prepify.git
cd prepify

Install Dependencies
npm install

Run Application
npx expo start

Scan the QR code using:

* Expo Go (Android)
* Camera App / Expo Go (iOS)

🧠 Scheduling Logic

Prepify’s scheduling engine:

1. Calculates exam urgency
2. Applies user-defined priorities
3. Allocates available study hours
4. Creates study blocks
5. Generates realistic tasks
6. Builds a personalized study plan

The system is deterministic, fast, and works completely offline.

⸻

🎯 Future Improvements

* Calendar integration
* Cloud synchronization
* Cross-device backups
* Adaptive scheduling
* AI-powered recommendations
* Exam countdown widgets
* Advanced analytics
* Social accountability features

⸻

👨‍💻 Author

Kartikay Sharma

Passionate about building productivity tools, AI-powered experiences, and modern mobile applications that solve real-world student problems.

⸻

📄 License

This project is licensed under the MIT License.

⸻

Built with ❤️ using React Native, Expo, and a lot of exam stress. 📚⚡
