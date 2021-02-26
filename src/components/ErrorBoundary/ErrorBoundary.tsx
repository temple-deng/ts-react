import {Component, ErrorInfo} from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  // 这个函数一般在报错的时候先调用，下面那个后调用
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.log('get derived call');
    console.log(error);
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.log('did catch call');
    console.error('Uncaught error123: ', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Sorry.. there was an error</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
