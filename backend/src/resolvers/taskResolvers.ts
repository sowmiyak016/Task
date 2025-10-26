import Task, { ITask } from '../models/Task';

export const resolvers = {
  Query: {
    getTasks: async (): Promise<ITask[]> => {
      try {
        return await Task.find().sort({ createdAt: -1 });
      } catch (error) {
        throw new Error('Error fetching tasks');
      }
    },
    getTask: async (_: any, { id }: { id: string }): Promise<ITask | null> => {
      try {
        return await Task.findById(id);
      } catch (error) {
        throw new Error('Error fetching task');
      }
    }
  },

  Mutation: {
    addTask: async (_: any, { input }: { input: ITask }) => {
      try {
        const task = new Task({
          title: input.title,
          description: input.description,
          completed: input.completed || false,
          priority: input.priority || 'medium'
        });
        const savedTask = await task.save();
        
        return {
          success: true,
          message: 'Task created successfully',
          task: savedTask
        };
      } catch (error) {
        return {
          success: false,
          message: 'Error creating task: ' + (error instanceof Error ? error.message : 'Unknown error'),
          task: null
        };
      }
    },

    updateTask: async (_: any, { id, input }: { id: string; input: Partial<ITask> }) => {
      try {
        const updatedTask = await Task.findByIdAndUpdate(
          id,
          { ...input, updatedAt: new Date() },
          { new: true, runValidators: true }
        );

        if (!updatedTask) {
          return {
            success: false,
            message: 'Task not found',
            task: null
          };
        }

        return {
          success: true,
          message: 'Task updated successfully',
          task: updatedTask
        };
      } catch (error) {
        return {
          success: false,
          message: 'Error updating task: ' + (error instanceof Error ? error.message : 'Unknown error'),
          task: null
        };
      }
    },

    deleteTask: async (_: any, { id }: { id: string }) => {
      try {
        const result = await Task.findByIdAndDelete(id);

        return {
          success: !!result,
          message: result ? 'Task deleted successfully' : 'Task not found'
        };
      } catch (error) {
        return {
          success: false,
          message: 'Error deleting task: ' + (error instanceof Error ? error.message : 'Unknown error')
        };
      }
    },

   toggleTask: async (_: any, { id }: { id: string }): Promise<ITask | null> => {
      try {
        const task = await Task.findById(id);
        if (!task) throw new Error('Task not found');

        return await Task.findByIdAndUpdate(
          id,
          { completed: !task.completed, updatedAt: new Date() },
          { new: true }
        );
      } catch (error) {
        throw new Error('Error toggling task');
      }
    }
  }
};