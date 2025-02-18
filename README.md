# Task Manager App

A full-stack task management application built with React, TypeScript, and Node.js. This application allows users to create, read, update, and delete tasks while organizing them by priority and status.

## Features

- Create, view, edit, and delete tasks
- Filter tasks by status (All, Pending, Completed)
- Sort tasks by priority
- Mark tasks as completed/pending
- Color-coded priority levels
- Responsive design

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js
- Express
- MongoDB (database)

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (if using local database)

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd task-manager
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Create a `.env` file in the backend directory with your configuration:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`
The backend API will be running at `http://localhost:5000`

## API Endpoints

- `GET /` - Get all tasks
- `GET /:id` - Get a specific task
- `POST /add` - Create a new task
- `PUT /edit/:id` - Update a task
- `DELETE /delete/:id` - Delete a task

## Task Structure

```typescript
interface Task {
  _id: number;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed';
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.