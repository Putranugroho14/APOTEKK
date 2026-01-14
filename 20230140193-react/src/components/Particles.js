// src/components/Particles.js
import React, { useEffect, useRef } from 'react';

const Particles = ({
    count = 60,
    colors = ['#06b6d4', '#84cc16', '#ffffff'],
    opacity = 0.4,
    speed = 0.5,
    fullScreen = true
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const particles = [];
        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.z = Math.random() * canvas.width;
                this.size = Math.random() * 2 + 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.velocity = speed + Math.random() * speed;
            }
            update() {
                this.z -= this.velocity;
                if (this.z <= 0) {
                    this.reset();
                }
            }
            draw() {
                // Ensure z is not 0 to avoid division by zero
                const zFactor = canvas.width / (this.z || 0.1);
                const x = (this.x - canvas.width / 2) * zFactor + canvas.width / 2;
                const y = (this.y - canvas.height / 2) * zFactor + canvas.height / 2;

                // Radius increases as it gets "closer" (smaller z)
                const radius = Math.max(0.5, (1 - this.z / canvas.width) * 3);
                const alpha = Math.max(0, (1 - this.z / canvas.width) * opacity);

                if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.globalAlpha = alpha;
                    ctx.fill();
                }
            }
        }

        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [count, colors, opacity, speed]);

    return (
        <canvas
            ref={canvasRef}
            className={`${fullScreen ? 'fixed' : 'absolute'} inset-0 pointer-events-none`}
            style={{
                zIndex: 1,
                mixBlendMode: 'multiply',
                display: 'block'
            }}
        />
    );
};

export default Particles;
