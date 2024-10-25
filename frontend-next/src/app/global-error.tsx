'use client';

import { Box, Typography, Button } from '@mui/material';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          gap={2}
          p={3}
        >
          <Typography variant="h4" color="error" gutterBottom>
            Something went wrong!
          </Typography>
          <Typography color="textSecondary" align="center" sx={{ maxWidth: 600 }}>
            {error.message || 'An unexpected error occurred'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => reset()}
            sx={{ mt: 2 }}
          >
            Try again
          </Button>
        </Box>
      </body>
    </html>
  );
}
