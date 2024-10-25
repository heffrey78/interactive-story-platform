'use client';

import { Box, Typography, Button } from '@mui/material';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="50vh"
      gap={2}
    >
      <Typography variant="h5" color="error" gutterBottom>
        Something went wrong!
      </Typography>
      <Typography color="textSecondary">
        {error.message || 'An error occurred while loading the page'}
      </Typography>
      <Button
        variant="contained"
        onClick={reset}
        sx={{ mt: 2 }}
      >
        Try again
      </Button>
    </Box>
  );
}
