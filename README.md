# Capacity Planning Tool

A comprehensive web application for capacity planning and resource management built with React frontend and Node.js backend.

## Features

- **Employee Management**: Add, edit, and manage employees with team assignments
- **Team Management**: Create hierarchical team structures
- **Project Management**: Manage projects with status tracking and timelines
- **Capacity Planning**: Assign employees to projects with FTE allocations by month
- **Capacity Overview**: Visual dashboard showing team and individual workload over time
- **Resource Optimization**: Prevent over-allocation and identify available capacity

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Backend**: Node.js with Express
- **Data Storage**: JSON files (lightweight, no database required)
- **Styling**: Custom CSS with responsive design

## Screenshots

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/915ab523-8658-47f1-a5d7-407aafe9b088)

### Employee Management
![Employee Management](https://github.com/user-attachments/assets/7714e678-1035-424b-b566-dfb18c96daf7)

### Capacity Planning
![Capacity Planning](https://github.com/user-attachments/assets/f799e2bf-21fa-4fd4-9f7c-4aa62214d797)

### Capacity Overview
![Capacity Overview](https://github.com/user-attachments/assets/cf6af834-1ce4-42f4-b098-2f6611c47a23)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd capaplan
```

2. Install dependencies:
```bash
npm run install:all
```

### Running the Application

Start both frontend and backend:
```bash
npm start
```

This will start:
- Backend server on http://localhost:5000
- Frontend application on http://localhost:3000

### Individual Services

Start backend only:
```bash
npm run start:backend
```

Start frontend only:
```bash
npm run start:frontend
```

## Usage

1. **Set up your organization**:
   - Add employees in the Employee Management section
   - Create teams and assign employees to teams
   - Create projects with timelines and status

2. **Plan capacity**:
   - Go to Assignments/Capacity Planning
   - Create assignments with FTE allocations (0.1 = 10%, 1.0 = 100%)
   - Use month-by-month planning for detailed resource allocation

3. **Monitor capacity**:
   - Use the Capacity Overview tab to see team workload
   - Identify overloaded team members (red indicators)
   - Find available capacity for new projects

## API Endpoints

### Employees
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Teams
- `GET /api/teams` - List all teams
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `GET /api/teams/:id/hierarchy` - Get team hierarchy

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Assignments
- `GET /api/assignments` - List all assignments
- `POST /api/assignments` - Create assignment
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment
- `GET /api/assignments/capacity/:year/:month` - Get capacity overview

## Data Structure

Data is stored in JSON files in the `backend/data/` directory:
- `employees.json` - Employee records
- `teams.json` - Team definitions
- `projects.json` - Project information
- `assignments.json` - Resource assignments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC
