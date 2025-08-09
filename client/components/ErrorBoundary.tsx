import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error("🚨 React Error Boundary caught an error:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🚨 Error Boundary Details:", {
      error: error.message,
      componentStack: errorInfo.componentStack,
      errorBoundary: this,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #1e293b, #3730a3)",
            color: "white",
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <div>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛡️</div>
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              خطأ في واجهة التطبيق
            </h1>
            <p style={{ marginBottom: "1rem" }}>
              حدث خطأ في عرض منصة قراءة ساو العربية
            </p>
            <details
              style={{
                background: "rgba(0,0,0,0.3)",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                textAlign: "left",
              }}
            >
              <summary style={{ cursor: "pointer", marginBottom: "0.5rem" }}>
                تفاصيل الخطأ التقنية
              </summary>
              <code
                style={{
                  color: "#ef4444",
                  fontSize: "0.9rem",
                  whiteSpace: "pre-wrap",
                }}
              >
                {this.state.error?.message}
                {"\n\n"}
                {this.state.error?.stack}
              </code>
            </details>
            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                  window.location.reload();
                }}
                style={{
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                🔄 إعادة تحميل
              </button>
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                style={{
                  background: "#6b7280",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                🏠 الصفحة الرئيسية
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
