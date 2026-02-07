import React, { useEffect, useRef } from 'react';

const UlamSpiral: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let scrollY = window.scrollY;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const isPrime = (n: number) => {
      if (n <= 1) return false;
      if (n <= 3) return true;
      if (n % 2 === 0 || n % 3 === 0) return false;
      for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
      }
      return true;
    };

    const draw = () => {
      if (!canvas || !ctx) return;
      
      // Clear with very low opacity for trail effect or just clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const stepSize = 4 + (scrollY * 0.01); // Zoom based on scroll
      const maxSteps = Math.min(canvas.width, canvas.height) / stepSize * 2;
      
      let x = centerX;
      let y = centerY;
      let step = 1;
      let direction = 0; // 0: right, 1: up, 2: left, 3: down
      let turnCounter = 0;
      let stepCounter = 0;

      ctx.fillStyle = 'rgba(0, 255, 65, 0.15)'; // Primary color low opacity

      for (let n = 1; n < maxSteps * maxSteps; n++) {
        if (isPrime(n)) {
          // Dynamic size based on scroll
          const size = Math.max(1, stepSize * 0.4);
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }

        switch (direction) {
          case 0: x += stepSize; break;
          case 1: y -= stepSize; break;
          case 2: x -= stepSize; break;
          case 3: y += stepSize; break;
        }

        stepCounter++;
        if (stepCounter === step) {
          stepCounter = 0;
          direction = (direction + 1) % 4;
          turnCounter++;
          if (turnCounter === 2) {
            turnCounter = 0;
            step++;
          }
        }
        
        // Optimization: Stop if out of bounds (with margin)
        if (x < -100 || x > canvas.width + 100 || y < -100 || y > canvas.height + 100) {
            // Check if we are moving away from center significantly? 
            // Actually Ulam spiral grows outwards, so once we are far, we might come back?
            // No, Ulam spiral expands. If we are too far, we can stop this branch?
            // Simple check: if n is very large, stop.
            if (n > 5000) break; 
        }
      }
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      requestAnimationFrame(draw);
    };

    window.addEventListener('scroll', onScroll);
    draw(); // Initial draw

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none opacity-20 mix-blend-screen"
    />
  );
};

export default UlamSpiral;
