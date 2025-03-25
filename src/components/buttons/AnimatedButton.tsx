'use client';

import { Bookmark } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

const AnimatedButton = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const handleClick = () => {
    setIsAnimating(true);
  };

  return (
    <div className='relative'>
      <Button
        onClick={handleClick}
        className={`
          rounded-full bg-blue-600 hover:bg-blue-700 text-white
          transition-all duration-200 ease-in-out
          ${isAnimating ? 'scale-105' : ''}
        `}
      >
        <Bookmark className='mr-2' />
        Bookmark
      </Button>
      {isAnimating && (
        <div className='absolute inset-0 pointer-events-none'>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute left-1/2 top-1/2 w-1 h-1 rounded-full bg-blue-400
                animate-[splatter_0.8s_ease-out_forwards]
              `}
              style={{
                transform: `translate(-50%, -50%) rotate(${
                  Math.random() * 360
                }deg)`,
                animationDelay: `${Math.random() * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimatedButton;
