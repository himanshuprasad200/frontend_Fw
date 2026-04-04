import React, { useState, useEffect, useCallback } from 'react';
import './CustomToast.css';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

let toastListeners = [];
let toastQueue = [];
let activeToast = null;

const notifyListeners = () => {
  toastListeners.forEach(listener => listener(activeToast));
};

const toastActions = (content, options = {}) => showToast(content, 'custom', options);

toastActions.success = (message, options = {}) => showToast(message, 'success', options);
toastActions.error = (message, options = {}) => showToast(message, 'error', options);
toastActions.info = (message, options = {}) => showToast(message, 'info', options);
toastActions.warning = (message, options = {}) => showToast(message, 'warning', options);
toastActions.dismiss = (id) => {
  if (!id || (activeToast && activeToast.id === id)) {
    activeToast = null;
    notifyListeners();
  }
};

export default toastActions;
export const toast = toastActions;

const showToast = (content, type, options) => {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast = { id, content, type, ...options };
  
  activeToast = newToast;
  notifyListeners();

  if (!options.persist) {
    const duration = options.duration || 4000;
    setTimeout(() => {
      if (activeToast && activeToast.id === id) {
        activeToast = null;
        notifyListeners();
      }
    }, duration);
  }
  
  return id;
};

export const CustomToaster = () => {
  const [currentToast, setCurrentToast] = useState(null);

  useEffect(() => {
    const listener = (toast) => setCurrentToast(toast ? { ...toast } : null);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  if (!currentToast) return null;

  const renderContent = () => {
    if (typeof currentToast.content === 'function') {
      return currentToast.content({ id: currentToast.id });
    }
    return currentToast.content;
  };

  const getIcon = () => {
    if (currentToast.type === 'custom') return null;
    switch (currentToast.type) {
      case 'success': return <FaCheckCircle />;
      case 'error': return <FaTimesCircle />;
      case 'warning': return <FaExclamationTriangle />;
      default: return <FaInfoCircle />;
    }
  };

  return (
    <div className="custom-toast-container">
      <div className={`custom-toast ${currentToast.type} animate-toast-in`}>
        {getIcon() && <div className="toast-icon">{getIcon()}</div>}
        <div className="toast-message">{renderContent()}</div>
        <button className="toast-close" onClick={() => toast.dismiss(currentToast.id)}>
          <FaTimes />
        </button>
        <div className="toast-progress"></div>
      </div>
    </div>
  );
};
