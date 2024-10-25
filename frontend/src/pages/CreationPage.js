import React, { useState, useEffect, useCallback } from 'react';
import { Typography, TextField, Button, Container, Paper, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import api from '../api/config';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  formControl: {
    minWidth: 250,
    marginRight: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
}));

function CreationPage() {
  const classes = useStyles();
  const [stories, setStories] = useState([]);
  const [currentStoryId, setCurrentStoryId] = useState(null);
  const [currentStory, setCurrentStory] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewStoryDialogOpen, setIsNewStoryDialogOpen] = useState(false);
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [segmentTitle, setSegmentTitle] = useState('');
  const [segmentContent, setSegmentContent] = useState('');
  const [choices, setChoices] = useState([{ text: '', nextSegmentId: null }]);

  const fetchStories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/story/all');
      setStories(response.data);
      if (response.data.length > 0 && !currentStoryId) {
        setCurrentStoryId(response.data[0].id);
      }
    } catch (err) {
      setError('Failed to fetch stories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentStoryId]);

  const fetchCurrentStory = useCallback(async () => {
    if (!currentStoryId) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/story/${currentStoryId}`);
      setCurrentStory(response.data);
    } catch (err) {
      setError('Failed to fetch current story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentStoryId]);

  const handleCreateNewStory = useCallback(async (title) => {
    setIsLoading(true);
    try {
      const response = await api.post('/story', { title });
      setStories(prevStories => [...prevStories, response.data]);
      setCurrentStoryId(response.data.id);
      setNewStoryTitle('');
      setIsNewStoryDialogOpen(false);
    } catch (err) {
      setError('Failed to create new story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreateNewSegment = useCallback(async () => {
    if (!currentStoryId) return;
    setIsLoading(true);
    try {
      const validChoices = choices.filter(choice => choice.text.trim() !== '').map(choice => ({
        text: choice.text,
        nextSegmentId: choice.nextSegmentId || null
      }));
      await api.post(`/story/${currentStoryId}/segment`, {
        title: segmentTitle,
        content: segmentContent,
        choices: validChoices
      });
      setSegmentTitle('');
      setSegmentContent('');
      setChoices([{ text: '', nextSegmentId: null }]);
      fetchCurrentStory();
    } catch (err) {
      setError(`Failed to create new segment: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [currentStoryId, segmentTitle, segmentContent, choices, fetchCurrentStory]);

  const handleAddChoice = () => {
    setChoices([...choices, { text: '', nextSegmentId: null }]);
  };

  const handleChoiceChange = (index, field, value) => {
    const newChoices = [...choices];
    newChoices[index][field] = field === 'nextSegmentId' ? (value === '' ? null : Number(value)) : value;
    setChoices(newChoices);
  };

  const handleRemoveChoice = (index) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  useEffect(() => {
    if (currentStoryId) {
      fetchCurrentStory();
    }
  }, [currentStoryId, fetchCurrentStory]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (isLoading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        <Typography variant="h4" gutterBottom>
          Story Creation
        </Typography>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Select Story</InputLabel>
          <Select
            value={currentStoryId || ''}
            onChange={(e) => setCurrentStoryId(e.target.value)}
            label="Select Story"
          >
            {stories.map((story) => (
              <MenuItem key={story.id} value={story.id}>
                {story.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={() => setIsNewStoryDialogOpen(true)}>
          Create New Story
        </Button>
      </Paper>

      {currentStory && (
        <Paper className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            Story Segments
          </Typography>
          {currentStory.segments && currentStory.segments.length > 0 ? (
            <List>
              {currentStory.segments.map((segment, index) => (
                <ListItem key={segment.id}>
                  <ListItemText primary={`${index + 1}. ${segment.title}`} secondary={segment.content} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No segments available for this story.</Typography>
          )}
        </Paper>
      )}

      {currentStoryId && (
        <Paper className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            Add New Segment
          </Typography>
          <form onSubmit={(e) => { e.preventDefault(); handleCreateNewSegment(); }} className={classes.form}>
            <TextField
              label="Segment Title"
              variant="outlined"
              value={segmentTitle}
              onChange={(e) => setSegmentTitle(e.target.value)}
              required
            />
            <TextField
              label="Segment Content"
              variant="outlined"
              multiline
              minRows={4}
              value={segmentContent}
              onChange={(e) => setSegmentContent(e.target.value)}
              required
            />
            {choices.map((choice, index) => (
              <div key={index}>
                <TextField
                  label={`Choice ${index + 1} Text`}
                  variant="outlined"
                  value={choice.text}
                  onChange={(e) => handleChoiceChange(index, 'text', e.target.value)}
                />
                <TextField
                  label={`Next Segment ID (optional)`}
                  variant="outlined"
                  type="number"
                  value={choice.nextSegmentId || ''}
                  onChange={(e) => handleChoiceChange(index, 'nextSegmentId', e.target.value)}
                />
                <Button onClick={() => handleRemoveChoice(index)}>Remove Choice</Button>
              </div>
            ))}
            <Button onClick={handleAddChoice}>Add Choice</Button>
            <Button type="submit" variant="contained" color="primary">
              Add Segment
            </Button>
          </form>
        </Paper>
      )}

      <Dialog 
        open={isNewStoryDialogOpen} 
        onClose={() => setIsNewStoryDialogOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create New Story</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Story Title"
            type="text"
            fullWidth
            value={newStoryTitle}
            onChange={(e) => setNewStoryTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewStoryDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleCreateNewStory(newStoryTitle)} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CreationPage;
