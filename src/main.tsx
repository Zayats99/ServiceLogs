import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import { persistor, store } from './app/store';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0b5fff'
    },
    secondary: {
      main: '#ff6f00'
    },
    background: {
      default: '#f1f5ff'
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif'
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
