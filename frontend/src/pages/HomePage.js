import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, List, ListItem, ListItemText, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import api from '../api/config';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function HomePage() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await api.get('/story/all');
      setStories(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch stories. Please try again.');
      setLoading(false);
    }
  };

  const handleCreateNewStory = () => {
    navigate('/create');
  };

  const handleStartStory = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  if (loading) {
    return (
      <Container className={classes.container}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={classes.container}>
        <Typography color="error">{error}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchStories}
          className={classes.button}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container className={classes.container}>
      <Typography variant="h2" className={classes.title}>
        Interactive Storytelling Platform
      </Typography>
      {stories.length === 0 && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          onClick={handleCreateNewStory}
        >
          Create New Story
        </Button>
      )}
      {stories.length === 1 && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          onClick={() => handleStartStory(stories[0].id)}
        >
          Start Story: {stories[0].title}
        </Button>
      )}
      {stories.length > 1 && (
        <>
          <Typography variant="h5" gutterBottom>
            Choose a Story:
          </Typography>
          <List className={classes.list}>
            {stories.map((story) => (
              <ListItem
                button
                key={story.id}
                onClick={() => handleStartStory(story.id)}
              >
                <ListItemText primary={story.title} />
              </ListItem>
            ))}
          </List>
        </>
      )}
      <Button
        variant="outlined"
        color="primary"
        size="large"
        className={classes.button}
        onClick={handleCreateNewStory}
      >
        Create New Story
      </Button>
    </Container>
  );
}

export default HomePage;
