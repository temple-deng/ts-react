import {useState, useEffect, useMemo} from "react";

type EffectProps = {
  theme: string;
};

function EffectWithClean({theme}: EffectProps) {
  const [count, setCount] = useState(0);
  console.log('effect with clean')
  // useEffect(() => {
  //   console.log('effect with clean execute')
  //   return () => {
  //     console.log('cleanup')
  //   }
  // }, [theme]);
  const memorizedCount = useMemo(() => count, []);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click lllllllll {memorizedCount}
      </button>
    </div>
  );
}

export default EffectWithClean;
