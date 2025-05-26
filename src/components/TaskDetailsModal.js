import React from 'react';

export default function TaskDetailsModal({ task, onClose }) {
  if (!task) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        maxWidth: 500,
        width: '90%',
      }}>
        <h2>{task.text}</h2>
        <p><b>Описание:</b> {task.description || 'Нет описания'}</p>
        <p><b>Время выполнения:</b> {task.time || 'Не указано'}</p>
        <p><b>Статус:</b> {task.status}</p>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
}