import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <button onClick={handleClick}>Clica aquí</button>
      <div>
        Count: <span>{count}</span>
      </div>
    </div>
  );
}
