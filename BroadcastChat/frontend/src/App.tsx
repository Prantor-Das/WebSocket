import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  // State to store chat messages with initial "Hello from server!" message
  const [messages, setMessages] = useState(["Hello from server!"]);

  // Refs to store WebSocket connection and input element
  const wsRef = useRef<WebSocket>(null); // WebSocket connection reference
  const inputRef = useRef<HTMLInputElement>(null); // Input field reference

  useEffect(() => {
    // Create new WebSocket connection to local server
    const ws = new WebSocket("ws://localhost:8080");

    // Handle incoming messages from server
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]); // Add new message to messages array
    };

    // Store WebSocket connection in ref for later use
    // @ts-ignore
    wsRef.current = ws;

    // When connection opens, send join room message
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red", // Join room with ID "red"
          },
        })
      );
    };

    // Cleanup: close WebSocket when component unmounts
    return () => {
      ws.close();
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    // Main chat interface UI
    <div className="h-screen w-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex justify-start">
            <div className="bg-linear-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 rounded-xl max-w-[70%] shadow-md">
              {message}
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="bg-gray-800 border-t border-gray-700 p-4 flex items-center gap-3">
        <input
          ref={inputRef}
          id="message"
          className="flex-1 bg-gray-900 text-white placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Type your message..."
        />
        <button
          onClick={() => {
            // @ts-ignore
            const message = inputRef.current?.value;
            // @ts-ignore
            wsRef.current.send(
              JSON.stringify({
                type: "chat",
                payload: { message },
              })
            );
            // @ts-ignore
            inputRef.current.value = "";
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;

/*
---------------------- Important Notes ----------------------

Ye code ek real-time chat application implement karta hai. Main points ye hai:

1. WebSocket Connection:
  - Local server se WebSocket connection create karta hai port 8080 pe
  - Connection establish hote hi automatically "red" room mei join ho jata hai
  - Har new message ko messages array mei add karta hai

2. State aur Refs:
  - messages state mei saare chat messages store hote hai
  - wsRef WebSocket connection ko store karta hai taki baad mei use kar sake
  - inputRef input field ko reference karta hai

3. UI Components:
  - Black background ke saath full screen chat interface
  - Upar messages display hote hai white bubbles mei
  - Bottom mei ek input field hai message type karne ke liye
  - Purple send button message bhejne ke liye

4. Message Handling:
  - Send button click hone pe current input value ko WebSocket ke through server ko bhej deta hai
  - Server se aane wale messages automatically display ho jaate hai
  - Messages JSON format mei send hote hai with type aur payload

5. Cleanup:
  - Component unmount hone pe WebSocket connection automatically close ho jata hai

Is code ka basic flow ye hai:
1. Page load -> WebSocket connection -> Room join
2. User message type karta hai -> Send click -> Server ko message jaata hai
3. Server message process karta hai -> Same room ke sabhi users ko message bhejta hai
4. Receiving clients pe message display ho jaata hai

*/
