import { useEffect, useRef } from "react";

const InteractiveGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      // Disable interaction on touch/mobile devices
      if (window.matchMedia("(hover: none)").matches) return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    const spacing = 40;
    
    let animationFrameId: number;

    const draw = () => {
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#E5E5E5");
      gradient.addColorStop(1, "#8A8A8A");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      const cols = Math.floor(width / spacing) + 2;
      const rows = Math.floor(height / spacing) + 2;

      ctx.beginPath();
      ctx.strokeStyle = "rgba(17, 17, 17, 0.15)";
      ctx.lineWidth = 1;

      // Draw horizontal lines
      for (let i = 0; i <= rows; i++) {
        for (let j = 0; j <= cols; j++) {
          const baseX = j * spacing;
          const baseY = i * spacing;
          
          let dx = mouse.x - baseX;
          let dy = mouse.y - baseY;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          // Repulsion
          let offsetX = 0;
          let offsetY = 0;
          const radius = 200;
          if (distance < radius) {
            const force = Math.pow((radius - distance) / radius, 2);
            offsetX = -(dx / distance) * force * 30; // max 30px displacement
            offsetY = -(dy / distance) * force * 30;
          }

          const x = baseX + offsetX;
          const y = baseY + offsetY;

          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }

      // Draw vertical lines
      for (let j = 0; j <= cols; j++) {
        for (let i = 0; i <= rows; i++) {
          const baseX = j * spacing;
          const baseY = i * spacing;
          
          let dx = mouse.x - baseX;
          let dy = mouse.y - baseY;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          let offsetX = 0;
          let offsetY = 0;
          const radius = 200;
          if (distance < radius) {
            const force = Math.pow((radius - distance) / radius, 2);
            offsetX = -(dx / distance) * force * 30;
            offsetY = -(dy / distance) * force * 30;
          }

          const x = baseX + offsetX;
          const y = baseY + offsetY;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1]"
    />
  );
};

export default InteractiveGrid;
