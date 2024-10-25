import React, { useState, useEffect } from 'react';
import { Typography, Button, Container, Paper } from '@material-ui/core';
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
  choicesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

function StoryPage() {
  const classes = useStyles();
  const [currentSegmentId, setCurrentSegmentId] = useState(null);
  const [segment, setSegment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialSegment = async () => {
      try {
        const response = await api.get('/story/start');
        setCurrentSegmentId(response.data.id);
      } catch (err) {
        setError('Failed to start the story. Please try again.');
      }
    };

    fetchInitialSegment();
  }, []);

  useEffect(() => {
    const fetchSegment = async () => {
      if (currentSegmentId) {
        try {
          const response = await api.get(`/story/segment/${currentSegmentId}`);
          setSegment(response.data);
        } catch (err) {
          setError('Failed to fetch the story segment. Please try again.');
        }
      }
    };

    fetchSegment();
  }, [currentSegmentId]);

  const handleChoice = async (choiceId) => {
    try {
      const response = await api.post('/story/choice', { choiceId });
      setCurrentSegmentId(response.data.nextSegmentId);
    } catch (err) {
      setError('Failed to process your choice. Please try again.');
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!segment) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        <Typography variant="body1" paragraph>
          {segment.content}
        </Typography>
      </Paper>
      <div className={classes.choicesContainer}>
        {segment.choices.map((choice) => (
          <Button
            key={choice.id}
            variant="contained"
            color="primary"
            onClick={() => handleChoice(choice.id)}
          >
            {choice.text}
          </Button>
        ))}
      </div>
    </Container>
  );
}

export default StoryPage;
