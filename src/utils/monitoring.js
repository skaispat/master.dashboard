export const logError = (error, errorInfo = null) => {
  // In a real production app, you might send this to Sentry, Datadog, etc.
  console.error("🔥 [Monitoring] Captured Error:", error);
  if (errorInfo) {
    console.error("🔥 [Monitoring] Error Info:", errorInfo);
  }

  // Example of saving to local storage for a "Crash Report" view
  try {
    const errorLogs = JSON.parse(localStorage.getItem('app_error_logs') || '[]');
    errorLogs.unshift({
      timestamp: new Date().toISOString(),
      message: error.message || String(error),
      stack: error.stack,
      componentStack: errorInfo?.componentStack
    });
    // Keep only the last 20 errors
    localStorage.setItem('app_error_logs', JSON.stringify(errorLogs.slice(0, 20)));
  } catch (e) {
    console.warn("Could not save error log to local storage", e);
  }
};

export const logEvent = (eventName, data = {}) => {
  // Console logging for events
  console.log(`📊 [Analytics Event]: ${eventName}`, data);
};
