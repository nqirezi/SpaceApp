import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  return (
    <ErrorBoundary>
      <HomeScreen />
    </ErrorBoundary>
  );
}
