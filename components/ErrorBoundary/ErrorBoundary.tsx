import React, { Component, ErrorInfo, ReactNode } from "react";

import ErrorLayout, { ErrorTranslations } from "layouts/ErrorLayout";

const translations: ErrorTranslations = {
  es: {
    title: "😫 Error del cliente",
    description: "¡Perdimos el compás! Algo salió mal de nuestro lado.",
    description2: "¿Qué tal si empezamos de nuevo?",
    button: "Volver al inicio",
  },
  en: {
    title: "😫 Client Error",
    description: "Whoops! We lost our rhythm. Something's off.",
    description2: "Let's rewind and try again!",
    button: "Back to home",
  },
};

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorLayout
          errorTranslations={translations}
          playlistId="37i9dQZF1DXcBWIGoYBM5M"
          exDescription="Client Error"
        />
      );
    }

    return this.props.children;
  }
}
