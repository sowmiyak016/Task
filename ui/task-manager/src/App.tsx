import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Paper,
  Grid, // Regular Grid import
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import { ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';
import { client } from './utils/client';
import { Header } from './components/Header';
import { AddTask } from './components/AddTask';
import { TaskTable } from './components/TaskTable';
import { Task } from './types/task';

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

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: TaskUpdateInput!) {
    updateTask(id: $id, input: $input) {
      success
      message
      task {
      id
      title
      description
      completed
      priority
      updatedAt
      }
    }
  }
`;

const TaskApp: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const { data, loading, error, refetch } = useQuery<{ getTasks: Task[] }>(GET_TASKS);
  const [updateTask] = useMutation(UPDATE_TASK);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#6366F1',
      },
      secondary: {
        main: '#EC4899',
      },
      background: {
        default: darkMode ? '#0F172A' : '#F8FAFC',
        paper: darkMode ? '#1E293B' : '#FFFFFF',
      },
    },
    typography: {
      h4: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditingTask(null);
    setEditTitle('');
    setEditDescription('');
    setEditPriority('medium');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim()) return;

    try {
      const result = await updateTask({
        variables: {
          id: editingTask.id,
          input: {
            title: editTitle.trim(),
            description: editDescription.trim(),
            priority: editPriority,
          },
        },
      });

      // Use the actual message from backend response
      if (result.data?.updateTask.success) {
        setSnackbarMessage(result.data.updateTask.message); // "Task updated successfully"
      } else {
        setSnackbarMessage(result.data?.updateTask.message || 'Failed to update task');
      }

      setSnackbarOpen(true);
      handleEditClose();
      refetch();
    } catch (error) {
      console.error('Error updating task:', error);
      setSnackbarMessage('Error updating action: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setSnackbarOpen(true);
    }
  };


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const tasks = data?.getTasks || [];
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        flexGrow: 1,
        minHeight: '100vh',
        background: darkMode
          ? 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #E0E7FF 100%)'
      }}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {/* Stats Cards - FIXED: Added 'item' prop */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card
                elevation={2}
                sx={{
                  background: darkMode
                    ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)'
                    : 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
                  border: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                  borderRadius: 3
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h2" color="primary" fontWeight="bold">
                    {tasks.length}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" fontWeight="500">
                    Total
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Card
                elevation={2}
                sx={{
                  background: darkMode
                    ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)'
                    : 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
                  border: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                  borderRadius: 3
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h2" color="success.main" fontWeight="bold">
                    {completedTasks.length}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" fontWeight="500">
                    Completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Card
                elevation={2}
                sx={{
                  background: darkMode
                    ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)'
                    : 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
                  border: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                  borderRadius: 3
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h2" color="warning.main" fontWeight="bold">
                    {pendingTasks.length}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" fontWeight="500">
                    Pending
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Paper
            elevation={1}
            sx={{
              p: 4,
              background: darkMode
                ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
                : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
              border: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
              borderRadius: 3
            }}
          >
            {/* Header Section */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box>
                <Typography variant="h4" gutterBottom fontWeight="700">
                  My Actions
                </Typography>
              </Box>
              <AddTask
                showSuccess={(message) => {
                  setSnackbarMessage(message);
                  setSnackbarOpen(true);
                }}
                showError={(message) => {
                  setSnackbarMessage(message);
                  setSnackbarOpen(true);
                }}
              />
            </Box>

            {/* Task Table */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Error loading actions: {error.message}
              </Alert>
            )}

            <TaskTable
              tasks={tasks}
              loading={loading}
              onEdit={handleEdit}
              showSuccess={(message) => {
                setSnackbarMessage(message);
                setSnackbarOpen(true);
              }}
              showError={(message) => {
                setSnackbarMessage(message);
                setSnackbarOpen(true);
              }}
            />          </Paper>
        </Container>
      </Box>

      {/* Edit Dialog and Snackbar remain the same */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          color: 'white'
        }}>
          Edit Action
        </DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Action Title"
              type="text"
              fullWidth
              variant="outlined"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              select
              margin="dense"
              label="Priority"
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
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
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Add details about your action..."
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={handleEditClose} variant="outlined" size="large">
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
              Update Action
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarMessage.includes('Error') ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <TaskApp />
    </ApolloProvider>
  );
};

export default App;