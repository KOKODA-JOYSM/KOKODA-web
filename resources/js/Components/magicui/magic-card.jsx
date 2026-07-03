import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function MagicCard({
    children,
    className,
    gradientSize = 250,
    gradientColor = '#FFE7A3',
    gradientOpacity = 0.6,
    lift = true,
}) {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: -gradientSize, y: -gradientSize });

    const handleMouseMove = useCallback((e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setPosition({ x: -gradientSize, y: -gradientSize });
    }, [gradientSize]);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={lift ? { y: -10, boxShadow: '0 20px 40px -12px rgba(192,151,108,0.35)' } : undefined}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className={cn('relative overflow-hidden', className)}
        >
            <motion.div
                className="pointer-events-none absolute inset-0 z-0"
                animate={{ opacity: gradientOpacity }}
                style={{
                    background: `radial-gradient(${gradientSize}px circle at ${position.x}px ${position.y}px, ${gradientColor}, transparent 70%)`,
                }}
            />
            <div className="relative z-10 h-full">{children}</div>
        </motion.div>
    );
}
