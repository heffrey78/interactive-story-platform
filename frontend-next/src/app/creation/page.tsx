'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, TextField, Button, Container, Paper, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '@/lib/api';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

interface Choice {
  text: string;
  nextSegmentId: number | null;
}

interface Segment {
  id: number;
  title: string;
  content: string;
  choices: Choice[];
}

interface Story {
  id: number;
  title: string;
  segments: Segment[];
}

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 250,
  marginRight: theme.spacing(2),
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export default function CreationPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStoryId, setCurrentStoryId] = useState<number | null>(null);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewStoryDialogOpen, setIsNewStoryDialogOpen] = useState(false);
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [segmentTitle, setSegmentTitle] = useState('');
  const [segmentContent, setSegmentContent] = useState('');
  const [choices, setChoices] = useState<Choice[]>([{ text: '', nextSegmentId: null }]);

  const fetchStories = useCallback(async () => {
    try {
      console.log('Fetching stories...');
      const response = await api.get('/story/all');
      console.log('Stories response:', response.data);
      setStories(response.data);
      if (response.data.length > 0 && !currentStoryId) {
        setCurrentStoryId(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
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
    } catch (error) {
      console.error('Error fetching current story:', error);
      setError('Failed to fetch current story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentStoryId]);

  const handleCreateNewStory = useCallback(async (title: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/story', { title });
      setStories(prevStories => [...prevStories, response.data]);
      setCurrentStoryId(response.data.id);
      setNewStoryTitle('');
      setIsNewStoryDialogOpen(false);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setError(`Failed to create new story: ${apiError.response?.data?.message || apiError.message}`);
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
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setError(`Failed to create new segment: ${apiError.response?.data?.message || apiError.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [currentStoryId, segmentTitle, segmentContent, choices, fetchCurrentStory]);

  const handleAddChoice = () => {
    setChoices([...choices, { text: '', nextSegmentId: null }]);
  };

  const handleChoiceChange = (index: number, field: keyof Choice, value: string) => {
    const newChoices = [...choices];
    if (field === 'nextSegmentId') {
      newChoices[index][field] = value === '' ? null : Number(value);
    } else {
      newChoices[index][field] = value;
    }
    setChoices(newChoices);
  };

  const handleRemoveChoice = (index: number) => {
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
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <StyledContainer>
      <StyledPaper>
        <Typography variant="h4" gutterBottom>
          Story Creation
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <StyledFormControl>
            <InputLabel>Select Story</InputLabel>
            <Select
              value={currentStoryId || ''}
              onChange={(e) => setCurrentStoryId(e.target.value ? Number(e.target.value) : null)}
              label="Select Story"
            >
              {stories.map((story) => (
                <MenuItem key={story.id} value={story.id}>
                  {story.title}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
          <Button variant="contained" color="primary" onClick={() => setIsNewStoryDialogOpen(true)}>
            Create New Story
          </Button>
        </Box>
      </StyledPaper>

      {currentStory && (
        <StyledPaper>
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
        </StyledPaper>
      )}

      {currentStoryId && (
        <StyledPaper>
          <Typography variant="h5" gutterBottom>
            Add New Segment
          </Typography>
          <StyledForm onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleCreateNewSegment(); }}>
            <TextField
              label="Segment Title"
              variant="outlined"
              value={segmentTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSegmentTitle(e.target.value)}
              required
            />
            <TextField
              label="Segment Content"
              variant="outlined"
              multiline
              minRows={4}
              value={segmentContent}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSegmentContent(e.target.value)}
              required
            />
            {choices.map((choice, index) => (
              <div key={index}>
                <TextField
                  label={`Choice ${index + 1} Text`}
                  variant="outlined"
                  value={choice.text}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChoiceChange(index, 'text', e.target.value)}
                />
                <TextField
                  label={`Next Segment ID (optional)`}
                  variant="outlined"
                  type="number"
                  value={choice.nextSegmentId || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChoiceChange(index, 'nextSegmentId', e.target.value)}
                />
                <Button onClick={() => handleRemoveChoice(index)}>Remove Choice</Button>
              </div>
            ))}
            <Button onClick={handleAddChoice}>Add Choice</Button>
            <Button type="submit" variant="contained" color="primary">
              Add Segment
            </Button>
          </StyledForm>
        </StyledPaper>
      )}

      <Dialog 
        open={isNewStoryDialogOpen} 
        onClose={() => setIsNewStoryDialogOpen(false)}
      >
        <DialogTitle>Create New Story</DialogTitle>
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
          <Button onClick={() => setIsNewStoryDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleCreateNewStory(newStoryTitle)} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
}
