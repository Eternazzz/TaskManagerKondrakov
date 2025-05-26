import React, { useState } from 'react';

export default function TaskAddDetailsModal({ taskName, onSave, onCancel }) {
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');

  
  
  const validateTime = (value) => {
    const match = /^(\d{1,2}):(\d{2})$/.exec(value);
    if (!match) return false;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  };


  const handleSave = () => {
    if (!validateTime(time)) {
      alert('Введите корректное время в формате ЧЧ:ММ');
      return;
    }
    onSave({ text: taskName, description, time });
  };

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
        maxWidth: 400,
        width: '90%',
      }}>
        <h2>Добавить детали задачи</h2>
        <p><b>Название:</b> {taskName}</p>
        <div style={{ marginBottom: 10 }}>
          <label>Описание:</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Время выполнения:</label>
          <input
            type="text"
            placeholder="Например, 21:00"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <button onClick={handleSave} style={{ marginRight: 10 }}>Сохранить</button>
        <button onClick={onCancel}>Отмена</button>
      </div>
    </div>
  );
}