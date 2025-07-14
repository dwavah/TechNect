import React, { useState } from "react";
export default function ChatWindow({ user2 }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  return (
    <div className="p-3 border rounded bg-gray-50 max-w-md">
      <div className="h-40 overflow-y-auto mb-2 border p-2 bg-white">
        {messages.map((m, i) => (
          <div key={i} className={m.fromSelf ? "text-right" : "text-left"}>
            <span className="inline-block bg-blue-100 px-2 rounded">{m.text}</span>
          </div>
        ))}
      </div>
      <form
        onSubmit={e => {e.preventDefault(); setMessages([...messages, { text, fromSelf: true }]); setText("");}}
        className="flex gap-2"
      >
        <input className="flex-1 p-1 border rounded" value={text} onChange={e=>setText(e.target.value)} />
        <button className="bg-blue-700 text-white px-3 py-1 rounded" type="submit">Send</button>
      </form>
    </div>
  );
}
