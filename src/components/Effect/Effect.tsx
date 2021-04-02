import {useState, useEffect} from 'react';

type EffectProps = {
  theme: string;
};

function Effect() {
  const [count, setCount] = useState(0);

  // console.log('effect render');
  useEffect(() => {
    // console.log('effect execute')
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

export default Effect;
