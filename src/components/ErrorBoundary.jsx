import React from 'react';
import ErrorFallback from './ErrorFallback';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        console.log("ErrorBoundary: Error caught!", error);
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
    }

    resetErrorBoundary = () => {
        this.setState({ hasError: false, error: null });
        // Optional: Attempt to recover by reloading window if state reset isn't enough for the specific crash
        // window.location.reload(); 
    };

    render() {
        if (this.state.hasError) {
            console.log("ErrorBoundary: Rendering Fallback UI");
            // You can render any custom fallback UI
            return <ErrorFallback error={this.state.error} resetErrorBoundary={this.resetErrorBoundary} />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
