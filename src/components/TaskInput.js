import React, { useState } from 'react';

export default function TaskInput({ onRequestDetails }) {
  const [text, setText] = useState('');

const handleAdd = () => {
  if (text.trim() === '') {
    alert('Пожалуйста, введите имя задачи');
    return;
  }
  onRequestDetails(text.trim());
  setText('');
};

  return (
    <div style={{ marginBottom: 10 }}>
      <input
        type="text"
        placeholder="Введите название задачи"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: '78%', marginRight: 38 }}
      />
      <button   onClick={handleAdd}
  style={{
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 24px', 
    fontSize: '12px',
    borderRadius: 8,
    minWidth: '270px'
  }}>Добавить</button>
    </div>
  );
}