import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full border-t-4 border-red-500">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong (เกิดข้อผิดพลาด)</h1>
            <p className="text-gray-700 mb-4">
              We're sorry, an unexpected error occurred. Please try refreshing the page. หรือแคปหน้าจอนี้เพื่อแจ้งปัญหา
            </p>
            <div className="bg-gray-100 p-4 rounded text-sm font-mono overflow-auto max-h-64 mb-4 text-left">
              <strong className="text-red-500">{this.state.error?.toString()}</strong>
              <br />
              <span className="text-gray-600 whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack}
              </span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#111f42] text-white px-4 py-2 rounded shadow transition hover:bg-opacity-90"
            >
              Refresh Page (โหลดหน้าใหม่)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
