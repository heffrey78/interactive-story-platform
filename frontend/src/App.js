import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// Import components
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import StoryPage from './pages/StoryPage';
import CreationPage from './pages/CreationPage';
import OverviewPage from './pages/OverviewPage';

const theme = createTheme({
  // You can customize the theme here
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/create" element={<CreationPage />} />
          <Route path="/create/new" element={<CreationPage />} />
          <Route path="/overview" element={<OverviewPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
