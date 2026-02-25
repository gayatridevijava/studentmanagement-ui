# 🎓 Student Management System

A full-stack web application for managing students and their enrolled courses, built with 
**Angular 21**.

---

## 🏗️ Architecture Overview

```
studentmanagement-ui/
├── Frontend/                   # Angular 21
│   └── src/app/
│       ├── core/              # Contains models and services for students and course
│       ├── features/          # 3 Core features Of the app are in 3 different modules: dashboard,courses and students
│       ├── shared/             # Shared Module contains confirm-dialogs, spinners and other shared components and directives
│       
└── 


## 🚀 Quick Start

npm start to start the application in 
http://localhost:4200

## ✨ Features Demonstrated

### CRUD Operations
- Create, Read, Update, Delete for both **Students** and **Courses**
- Real-time UI updates using RxJS 

### Routing (Angular)
- `/students` → Student management tab
- `/courses` → Course management tab

### Multiple Tabs with Modal Confirmation
- Two main tabs: Students and Courses
- **Add/Edit modal** for forms
- **Detail view modal** showing enrolled courses/students
- **Confirmation modal** before any delete operation (with descriptive message)

