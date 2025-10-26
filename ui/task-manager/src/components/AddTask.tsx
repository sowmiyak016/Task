import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, gql } from '@apollo/client';

const ADD_TASK = gql`
 mutation AddTask($input: TaskInput!) {
  addTask(input: $input) {
    success
    message
    task {
      id
      title
      description
      completed
      priority
      createdAt
      updatedAt
      __typename
    }
   __typename
  }
}
`;

const GET_TASKS = gql`
  query GetTasks {
    getTasks {
      id
      title
      description
      completed
      priority
      createdAt
      updatedAt
    }
  }
`;

interface AddTaskProps {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export const AddTask: React.FC<AddTaskProps> = ({ showSuccess, showError }) => {

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const [addTask] = useMutation(ADD_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const result = await addTask({
        variables: {
          input: {
            title: title.trim(),
            description: description.trim(),
            priority,
            completed: false
          }
        }
      });

      console.log('Full result:', result); // Debug log

      // Check if we have data and the mutation was successful
      if (result.data?.addTask?.success) {
        console.log('Success message:', result.data.addTask.message); // Debug log
        showSuccess(result.data.addTask.message); // This should show "Task created successfully"
        handleClose();
      } else {
        console.log('No success flag found'); // Debug log
        showError('Failed to add task - no success flag');
      }
    } catch (error) {
      console.error('Error in mutation:', error);
      showError('Error adding task: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5B5FEA 0%, #7C3AED 100%)',
          },
          fontWeight: 600,
          fontSize: '1rem',
          px: 3,
          py: 1
        }}
      >
        New Action
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Add New Action
          <IconButton
            onClick={handleClose}
            sx={{ color: 'white' }}
            edge="end"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Action Title"
              type="text"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              select
              margin="dense"
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Notes"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about your action..."
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={handleClose} variant="outlined" size="large">
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="large"
              sx={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5B5FEA 0%, #7C3AED 100%)',
                }
              }}
            >
              Add Action
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
