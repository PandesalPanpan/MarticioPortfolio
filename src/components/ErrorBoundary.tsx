import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main style={{ maxWidth: 768, margin: '0 auto', padding: '96px 24px', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <p style={{ color: 'var(--muted)', marginTop: 16 }}>
            An unexpected error occurred. <Link to="/">Go home</Link>.
          </p>
        </main>
      );
    }

    return this.props.children;
  }
}
