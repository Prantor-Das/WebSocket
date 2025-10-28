import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState();
  const inputRef = useRef<HTMLInputElement>(null);

  function sendMessage() {
    if (!socket) return; // use it if ew don't use Partial (?)

    const message = inputRef.current?.value;

    //@ts-expect-error Type error due to incompatible types between the socket variable and the send method.
    socket.send(message);
  }

  // we create the connection inside the useEffect so that the connection is only created once when the component is mounted
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onmessage = function (e) {
      alert(e.data);
      console.log(e.data);
    };
    // ws.onerror = () => {

    // }
    // ws.close = () => {

    // }
    // ws.onopen = () => {

    // }
  }, []);

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <input ref={inputRef} type="text" placeholder="Message..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
