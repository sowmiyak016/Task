import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { Delete, Edit, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { useMutation, gql } from '@apollo/client';
import { Task } from '../types/task';

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      success
      message
    }
  }
`;

const TOGGLE_TASK = gql`
  mutation ToggleTask($id: ID!) {
  toggleTask(id: $id) {
    id
    completed
    updatedAt
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

interface TaskTableProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  loading,
  onEdit,
  showSuccess,
  showError
}) => {
  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  const [toggleTask] = useMutation(TOGGLE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteTask({ variables: { id } });

      if (result.data?.deleteTask.success) {
        showSuccess(result.data.deleteTask.message); // "Task deleted successfully"
      } else {
        showError(result.data?.deleteTask.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      showError('Error deleting task: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTask({ variables: { id } });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (timestamp: any) => {
    return new Date(parseInt(timestamp)).toUTCString();
  };
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No actions found!
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>CreatedAt</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>updatedAt</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600, fontSize: '1rem' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              sx={{
                backgroundColor: task.completed ? 'action.hover' : 'inherit',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <TableCell>
                <IconButton
                  onClick={() => handleToggle(task.id)}
                  color={task.completed ? 'success' : 'default'}
                  size="small"
                >
                  {task.completed ? <CheckCircle /> : <RadioButtonUnchecked />}
                </IconButton>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                      fontWeight: task.completed ? 'normal' : 600,
                      color: task.completed ? 'text.secondary' : 'text.primary'
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Chip
                    label={task.priority}
                    color={getPriorityColor(task.priority) as any}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none'
                  }}
                >
                  {task.description || 'No notes'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="textSecondary">
                  {formatDate(task.createdAt) ?? "-"}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="textSecondary">
                  {task.updatedAt && task.updatedAt !== task.createdAt
                    ? formatDate(task.updatedAt)
                    : "-"}
                </Typography>
              </TableCell>

              <TableCell align="center">
                <Tooltip title={'Edit'}>
                  <IconButton
                    onClick={() => onEdit(task)}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title={'Delete'}>
                  <IconButton
                    onClick={() => handleDelete(task.id)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};