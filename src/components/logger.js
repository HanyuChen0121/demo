// src/logger.js
const LOG_STORAGE_KEY = "appLogs";

const logToStorage = (level, message) => {
  const logs = JSON.parse(localStorage.getItem(LOG_STORAGE_KEY)) || [];
  const timestamp = new Date().toISOString();
  logs.push({ level, message, timestamp });
  localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
};

const logError = (message, error) => {
  console.error(message, error);
  logToStorage("ERROR", `${message}: ${error.message || error}`);
};

const logWarning = (message) => {
  console.warn(message);
  logToStorage("WARN", message);
};

const logInfo = (message) => {
  console.info(message);
  logToStorage("INFO", message);
};

const downloadLogs = () => {
  const logs = JSON.parse(localStorage.getItem(LOG_STORAGE_KEY)) || [];
  const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "logs.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const clearLogs = () => {
  localStorage.removeItem(LOG_STORAGE_KEY);
};

export { logError, logWarning, logInfo, downloadLogs, clearLogs };
