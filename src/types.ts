export interface Task {
    _id: number;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
  }
  
  export type Priority = 'High' | 'Medium' | 'Low';
  export type Status = 'Pending' | 'Completed';
  
  export interface TaskFormData {
    title: string;
    description: string;
    priority: Priority;
    status: Status;
  }