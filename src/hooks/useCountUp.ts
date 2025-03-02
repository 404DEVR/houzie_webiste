import { useEffect, useState } from 'react';
import { useSpring } from 'framer-motion';

const useCountUp = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const animatedValue = useSpring(0, { duration });

  useEffect(() => {
    if (end > 0) {
      animatedValue.set(end);
    }
  }, [end, animatedValue]);

  useEffect(() => {
    return animatedValue.onChange((v) => {
      setCount(Math.floor(v));
    });
  }, [animatedValue]);

  return count;
};

export default useCountUp;
