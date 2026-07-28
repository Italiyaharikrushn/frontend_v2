import React, { Component } from 'react';
import Button from '../ui/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100vh', padding: '2rem',
          textAlign: 'center', background: 'var(--bg-main)'
        }}>
          <h1 style={{ color: 'var(--error)', marginBottom: '1rem' }}>Oops! Something went wrong.</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px' }}>
            We're sorry, but an unexpected error occurred. Please try refreshing the page or navigating back home.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button onClick={() => window.location.reload()} variant="primary">Refresh Page</Button>
            <Button onClick={() => window.location.href = '/'} variant="secondary">Go Home</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
