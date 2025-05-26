
import React, { useState } from 'react';

export default function ExperimentModal({ onConfirm, onCancel }) {
  const [count, setCount] = useState(100);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: 'white', padding: 20, borderRadius: 8, minWidth: 300 }}>
        <h3>Сколько задач добавить?</h3>
        <input
          type="number"
          value={count}
          min={1}
          max={1000}
          onChange={(e) => setCount(Number(e.target.value))}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <div style={{ textAlign: 'right' }}>
          <button onClick={() => onCancel()} style={{ marginRight: 10 }}>Отмена</button>
          <button onClick={() => onConfirm(count)}>Добавить</button>
        </div>
      </div>
    </div>
  );
}
