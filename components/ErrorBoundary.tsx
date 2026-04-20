import React, { ReactNode, Component, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#f8f8f8',
          padding: '20px',
          overflow: 'auto',
          fontFamily: 'monospace',
          zIndex: 9999,
        }}>
          <div style={{ color: 'red', fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
            ⚠️ REACT ERROR
          </div>
          <pre style={{
            color: 'red',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            fontSize: '12px',
            marginBottom: '20px',
          }}>
            {this.state.error?.message}
          </pre>
          <details style={{ marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer', color: '#0066cc' }}>Stack Trace</summary>
            <pre style={{
              color: 'red',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              fontSize: '11px',
              marginTop: '10px',
            }}>
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
