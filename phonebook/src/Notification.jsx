// src/Notification.js
import React from 'react';
import './index.css';

const Notification = ({ message, type }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={type}>
      {message}
    </div>
  );
};

export default Notification;
