'use client';

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Story Creator
        </Typography>
        <Button 
          color="inherit" 
          onClick={() => router.push('/')}
          sx={{ 
            textDecoration: pathname === '/' ? 'underline' : 'none'
          }}
        >
          Home
        </Button>
        <Button 
          color="inherit" 
          onClick={() => router.push('/creation')}
          sx={{ 
            textDecoration: pathname === '/creation' ? 'underline' : 'none'
          }}
        >
          Create Story
        </Button>
      </Toolbar>
    </AppBar>
  );
}
