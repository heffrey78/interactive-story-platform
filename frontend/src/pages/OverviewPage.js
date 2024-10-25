import React, { useState, useEffect } from 'react';
import { Typography, Container, Paper, List, ListItem, ListItemText, Collapse } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
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
  nested: {
    paddingLeft: theme.spacing(4),
  },
  choice: {
    paddingLeft: theme.spacing(8),
  },
}));

function OverviewPage() {
  const classes = useStyles();
  const [storyStructure, setStoryStructure] = useState(null);
  const [openSegments, setOpenSegments] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStoryStructure();
  }, []);

  const fetchStoryStructure = async () => {
    try {
      const response = await api.get('/story/structure');
      setStoryStructure(response.data);
    } catch (err) {
      setError('Failed to fetch story structure. Please try again.');
    }
  };

  const handleToggle = (segmentId) => {
    setOpenSegments(prevState => ({
      ...prevState,
      [segmentId]: !prevState[segmentId]
    }));
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!storyStructure) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        <Typography variant="h4" gutterBottom>
          Story Structure: {storyStructure.title}
        </Typography>
        <List>
          {storyStructure.segments.map((segment) => (
            <React.Fragment key={segment.id}>
              <ListItem button onClick={() => handleToggle(segment.id)}>
                <ListItemText primary={`Segment ${segment.id}: ${segment.content}`} />
                {segment.choices.length > 0 && (openSegments[segment.id] ? <ExpandLess /> : <ExpandMore />)}
              </ListItem>
              <Collapse in={openSegments[segment.id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {segment.choices.map((choice) => (
                    <ListItem key={choice.id} className={classes.nested}>
                      <ListItemText 
                        primary={`Choice: ${choice.text}`}
                        secondary={`Leads to Segment ${choice.nextSegmentId}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default OverviewPage;
