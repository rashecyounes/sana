Overview

Sana Platform is a modern AI-powered e-learning platform initially designed for Jordanian Tawjihi students.

The system is built around three user roles:

Admin
Teacher
Student
📦 Platform Modules

The platform includes:

Authentication & Security System
Subjects System
Courses System
Lessons System
Video Streaming System
Enrollment & Access Control
Admin Dashboard
Teacher Dashboard
Student Dashboard
AI Educational Assistant
🛠️ Technology Stack
Frontend
React
TypeScript
React Router
Axios
Backend
Django
Django REST Framework
PostgreSQL
JWT Authentication
👥 User Roles
🟢 Student

Permissions:

Register account
Login
Access enrolled courses
Watch lessons
Use AI assistant
Update profile

Restrictions:

Cannot create courses
Cannot edit educational content
Cannot access other dashboards
🟡 Teacher

Permissions:

Manage own courses
Manage lessons
Upload videos
Upload resources
Update profile

Restrictions:

Cannot manage platform settings
Cannot access admin functions
🔴 Admin

Full access to:

Users
Teachers
Students
Subjects
Courses
Lessons
Videos
Access Codes
Purchases
Enrollments
Devices
Sessions
Statistics
🔐 Authentication System
Registration

Users register using:

First Name
Last Name
Username
Email or Phone
Password
Password Confirmation

Default role:

👉 student

Only admins can assign:

teacher
admin
🔒 Password Security

Passwords are never stored in plain text.

Django uses:

PBKDF2
Unique salt per password
🔑 JWT Authentication

The system uses:

Access Token (short-lived)
Refresh Token (long-lived)
🔁 Token Security
Refresh Token Rotation
Old refresh token is invalidated
New refresh token is issued
Token Blacklisting

Used for:

Logout
Session termination
Security protection
📱 Device Tracking System

Each login sends:

x-device-id
x-device-name

Stored in:

localStorage
Device database
📊 Session System

Table: security_usersession

Tracks:

user
device
refresh_token
ip_address
user_agent
last_seen_at
is_active
Rules:
Max devices: 2
Max active sessions: 1

Behavior:

Same device → allowed
Different device → blocked if active session exists
👤 User Model

Table: users_user

Includes:

username
email
phone
role
profile_image
bio
timestamps
permissions flags
📚 Academic Structure
Hierarchy:
Subject
 └── Course
      └── Lesson
           ├── Video
           └── Resources
📘 Subjects System

Examples:

Arabic
English

Table: subjects_subject

Permissions:

Public view
Admin manage
📖 Courses System

Each course belongs to a subject.

Includes:

title
description
price
teacher
status
🎟️ Enrollment System

Access methods:

Purchase
Access Code
Admin grant
Free course
🎬 Lessons System

Includes:

video
resources
attachments

Features:

locked lessons
preview lessons
sequential learning
🎥 Video System

Powered by:

👉 Mux

Features:

upload
streaming
playback
asset management
🔐 Streaming Security
Signed URLs
Protected playback
Authorization validation
🌐 Public Website

Includes:

Home page
Subjects page
Courses page
Auth pages

Navigation changes based on:

Guest
Student
Teacher
Admin
🧩 Admin Dashboard

Location:

src/dashboard/admin

Modules:

Users
Courses
Lessons
Videos
Enrollments
Access Codes
Devices
Sessions
👨‍🏫 Teacher Dashboard

Location:

src/dashboard/teacher

Features:

manage own courses
manage lessons
manage videos
manage resources
🎓 Student Dashboard

Location:

src/dashboard/student

Features:

overview
my courses
profile
course access
🤖 AI Assistant

The AI assistant is:

👉 course-specific (not general chatbot)

Capabilities:

explanations
quizzes
exercises
Q&A

Future:

RAG system
knowledge retrieval
usage tracking
📌 Current Status

Sana Platform is a scalable commercial e-learning system with:

Full authentication system
Role-based architecture
Video streaming
AI assistant
Admin + Teacher + Student dashboards
