export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface TaskResponse {
  success: boolean;
  message: string;
  task: Task;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}