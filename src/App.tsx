import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, Check, X } from 'lucide-react';
import { Task, Priority, Status, TaskFormData } from './types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/tasks';

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | Status>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'status'>('priority');
  const [currentTask, setCurrentTask] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending'
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/`);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const resetForm = (): void => {
    setCurrentTask({
      title: '',
      description: '',
      priority: 'Medium',
      status: 'Pending'
    });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!currentTask.title.trim()) return;

    try {
      if ('id' in currentTask) {
        // Update existing task
        await axios.put(`${API_BASE_URL}/edit/${currentTask.id}`, currentTask);
      } else {
        // Add new task
        await axios.post(`${API_BASE_URL}/add`, currentTask);
      }
      
      await fetchTasks(); // Refresh the task list
      setIsModalOpen(false);
      resetForm();
      setError(null);
    } catch (err) {
      setError('Failed to save task. Please try again.');
      console.error('Error saving task:', err);
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`);
      await fetchTasks(); // Refresh the task list
      setError(null);
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  const editTask = async (taskId: number): Promise<void> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${taskId}`);
      setCurrentTask(response.data);
      setIsModalOpen(true);
      setError(null);
    } catch (err) {
      setError('Failed to fetch task details. Please try again.');
      console.error('Error fetching task details:', err);
    }
  };

  const toggleStatus = async (taskId: number): Promise<void> => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;

      const updatedTask = {
        ...task,
        status: task.status === 'Pending' ? 'Completed' : 'Pending'
      };

      await axios.put(`${API_BASE_URL}/edit/${taskId}`, updatedTask);
      await fetchTasks(); // Refresh the task list
      setError(null);
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Error updating task status:', err);
    }
  };

  // Rest of the component remains the same...
  const getColorByPriority = (priority: Priority): string => {
    const colors = {
      High: 'bg-red-100 text-red-600',
      Medium: 'bg-yellow-100 text-yellow-600',
      Low: 'bg-green-100 text-green-600'
    };
    return colors[priority];
  };

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'all') return true;
      return task.status === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <PlusCircle size={20} />
            Add New Task
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4 bg-white p-4 rounded-lg shadow">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | Status)}
            className="p-2 border rounded-lg"
          >
            <option value="all">All Tasks</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'priority' | 'status')}
            className="p-2 border rounded-lg"
          >
            <option value="priority">Sort by Priority</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <div 
              key={task._id} 
              className={`bg-white p-4 rounded-lg shadow flex items-center justify-between ${
                task.status === 'Completed' ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <button
                  onClick={() => toggleStatus(task._id)}
                  className={`p-1 rounded-full mt-1 ${
                    task.status === 'Completed' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Check size={20} />
                </button>
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    task.status === 'Completed' ? 'line-through text-gray-500' : ''
                  }`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  <div className="flex gap-2 text-sm mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getColorByPriority(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="text-gray-500">{task.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editTask(task._id)}
                  className="p-1 text-blue-800 hover:bg-blue-50 rounded"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {'id' in currentTask ? 'Edit Task' : 'Add New Task'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={currentTask.title}
                    onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                    className="mt-1 w-full p-2 border rounded-lg"
                    placeholder="Enter task title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={currentTask.description}
                    onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                    className="mt-1 w-full p-2 border rounded-lg"
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={currentTask.priority}
                    onChange={(e) => setCurrentTask({ ...currentTask, priority: e.target.value as Priority })}
                    className="mt-1 w-full p-2 border rounded-lg"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={currentTask.status}
                    onChange={(e) => setCurrentTask({ ...currentTask, status: e.target.value as Status })}
                    className="mt-1 w-full p-2 border rounded-lg"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    {'id' in currentTask ? 'Update Task' : 'Add Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;