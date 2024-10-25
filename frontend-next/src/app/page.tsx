'use client';

import { Container, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Interactive Story Creator
        </Typography>
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Create and manage your interactive stories
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={() => router.push('/creation')}
        >
          Go to Story Creation
        </Button>
      </Box>
    </Container>
  );
}
