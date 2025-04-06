import React, { useEffect, useRef, useState } from 'react';
import { sendQuery } from '../api';
import { Send } from 'lucide-react';

function QueryBox({ fileId, setResponse }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Load history when fileId changes
  useEffect(() => {
    if (fileId) {
      const saved = localStorage.getItem(`chat_history_${fileId}`);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages([]);
      }
    }
  }, [fileId]);

  // Save to localStorage on every message change
  useEffect(() => {
    if (fileId && messages.length) {
      localStorage.setItem(`chat_history_${fileId}`, JSON.stringify(messages));
    }
  }, [messages, fileId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { role: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    // Show "Generating..." loading message
    const placeholderIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: 'ai', text: 'Generating...' }]);

    try {
      const data = await sendQuery(fileId, query);
      const aiMsg = { role: 'ai', text: data.answer, full: data };

      // Replace the placeholder with actual response
      setMessages((prev) => {
        const updated = [...prev];
        updated[placeholderIndex] = aiMsg;
        return updated;
      });

      setResponse(data);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'error', text: 'Query failed. Try again.' }]);
    }

    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '70vh',
        background: '#202020',
        borderRadius: '30px',
        padding: '20px',
        color: '#eee',
        overflowY: 'auto',
        marginBottom: '20px',
        maxWidth: '100%',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              margin: '5px 0',
            }}
          >
            <div
              style={{
                background:
                  msg.role === 'user' ? '#333' :
                    msg.role === 'ai' ? '#009307' : '#C23434',
                padding: '10px 14px',
                borderRadius: '14px',
                maxWidth: '80%',
                color: '#fff',
                whiteSpace: 'pre-wrap',
                fontStyle: msg.text === 'Generating...' ? 'italic' : 'normal',
                opacity: msg.text === 'Generating...' ? 0.8 : 1,
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something about the data..."
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '30px',
            border: '1px solid #444',
            background: '#222',
            color: '#fff',
          }}
        />
        <button
          type="submit"
          style={{
            background: '#4caf50',
            border: 'none',
            color: '#fff',
            padding: '12px 12px',
            borderRadius: '30px',
            cursor: 'pointer',
            display: 'flex', flexDirection: 'row', justifyItems: 'center', alignItems: 'center', gap: '10px'
          }}
          disabled={loading}
        >
          {loading ? '...' : <Send />}
        </button>
      </form>
    </div>
  );
}

export default QueryBox;
