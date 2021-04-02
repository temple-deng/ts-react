import {useState, useEffect, useRef} from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(0);

  useEffect(() => {
    prevCountRef.current = count;
  });

  const prevCount = prevCountRef.current;

  return (
    <div>
      <div>Now: {count}, before: {prevCount}</div>
      <button onClick={() => setCount(count + 1)}>Counter btn</button>
    </div>
  )
}

export default Counter;
