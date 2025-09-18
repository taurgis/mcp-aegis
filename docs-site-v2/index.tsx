
import React from 'react';
import { ViteReactSSG } from 'vite-react-ssg';
import routes from './App';
import './src/styles/input.css';

export const createRoot = ViteReactSSG(
  // react-router-dom data routes
  { routes },
  // function to have custom setups
  ({ router, routes, isClient, initialState }) => {
    // Custom setup can be added here if needed
    console.log('SSG Setup:', { isClient, routes: routes.length });
  },
);
