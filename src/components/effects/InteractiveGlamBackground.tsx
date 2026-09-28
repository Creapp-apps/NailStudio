import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulseSpeed: number;
  angle: number;
  spin: number;
}

export const InteractiveGlamBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Generate Diamond/Stardust Particles
    const particleCount = 45;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4 - 0.15, // gentle upward drift
        opacity: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02
      });
    }

    // Interactive trail particles on mouse move
    const trailParticles: { x: number; y: number; size: number; opacity: number; life: number }[] = [];

    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Organic Breathing Ambient Mesh Orbs
      const orb1X = width * 0.75 + Math.sin(time * 0.8) * 60;
      const orb1Y = height * 0.3 + Math.cos(time * 0.7) * 50;
      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, 450);
      grad1.addColorStop(0, 'rgba(255, 185, 208, 0.45)');
      grad1.addColorStop(0.5, 'rgba(255, 214, 230, 0.2)');
      grad1.addColorStop(1, 'rgba(255, 247, 250, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const orb2X = width * 0.2 + Math.cos(time * 0.6) * 50;
      const orb2Y = height * 0.7 + Math.sin(time * 0.9) * 60;
      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, 500);
      grad2.addColorStop(0, 'rgba(255, 235, 205, 0.4)');
      grad2.addColorStop(0.5, 'rgba(255, 220, 235, 0.15)');
      grad2.addColorStop(1, 'rgba(255, 247, 250, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      const orb3X = width * 0.5 + Math.sin(time * 0.5) * 80;
      const orb3Y = height * 0.15 + Math.cos(time * 0.6) * 40;
      const grad3 = ctx.createRadialGradient(orb3X, orb3Y, 10, orb3X, orb3Y, 400);
      grad3.addColorStop(0, 'rgba(235, 210, 255, 0.35)');
      grad3.addColorStop(0.6, 'rgba(255, 225, 240, 0.1)');
      grad3.addColorStop(1, 'rgba(255, 247, 250, 0)');
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // 2. Interactive Cursor Spotlight Aura
      if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        const mouseGrad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          320
        );
        mouseGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        mouseGrad.addColorStop(0.3, 'rgba(248, 187, 208, 0.22)');
        mouseGrad.addColorStop(1, 'rgba(255, 247, 250, 0)');
        ctx.fillStyle = mouseGrad;
        ctx.fillRect(0, 0, width, height);

        // Add subtle spark trail on move
        if (Math.random() < 0.3) {
          trailParticles.push({
            x: mouseRef.current.x + (Math.random() - 0.5) * 30,
            y: mouseRef.current.y + (Math.random() - 0.5) * 30,
            size: Math.random() * 3 + 1,
            opacity: 0.9,
            life: 1
          });
        }
      }

      // 3. Render Floating Stardust & Diamond Sparkles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += p.spin;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentOpacity = (Math.sin(time * 3 + p.pulseSpeed * 100) * 0.5 + 0.5) * p.opacity;

        // Draw 4-point Swarovski Diamond Star
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = `rgba(222, 115, 143, ${currentOpacity * 0.85})`;
        ctx.shadowColor = 'rgba(255, 200, 220, 0.9)';
        ctx.shadowBlur = 8;

        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -s * 2.5);
        ctx.quadraticCurveTo(0, 0, s * 2.5, 0);
        ctx.quadraticCurveTo(0, 0, 0, s * 2.5);
        ctx.quadraticCurveTo(0, 0, -s * 2.5, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s * 2.5);
        ctx.fill();

        // Inner glowing core
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // 4. Render Interactive Cursor Trails
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const tp = trailParticles[i];
        tp.y -= 0.6; // gentle float
        tp.life -= 0.025;
        if (tp.life <= 0) {
          trailParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(tp.x, tp.y);
        ctx.fillStyle = `rgba(222, 115, 143, ${tp.life * 0.65})`;
        ctx.shadowColor = '#FFF';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(0, 0, tp.size * tp.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};
