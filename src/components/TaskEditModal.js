import React, { useState, useEffect } from 'react';

export default function TaskEditModal({ task, onSave, onCancel }) {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (task) {
      setText(task.text || '');
      setDescription(task.description || '');
      setTime(task.time || '');
    }
  }, [task]);

  
  
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
    onSave({
      status: task.status,
      ...task,
      text,
      description,
      time,
    });
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
        maxWidth: 500,
        width: '90%',
      }}>
        <h2>Редактировать задачу</h2>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Название" style={{ width: '100%', marginBottom: 10 }} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание" style={{ width: '100%', marginBottom: 10 }} />
        <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Время выполнения" style={{ width: '100%', marginBottom: 10 }} />
        <button onClick={handleSave} style={{ marginRight: 10 }}>Сохранить</button>
        <button onClick={onCancel}>Отмена</button>
      </div>
    </div>
  );
}