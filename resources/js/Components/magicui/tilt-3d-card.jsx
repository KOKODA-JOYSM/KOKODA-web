import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Tilt3DCard({ children, className, depth = 32, ...props }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 220, damping: 22 };
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [14, -14]), springConfig);
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), springConfig);

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d' }}
            className={cn(className)}
            {...props}
        >
            <div style={{ transform: `translateZ(${depth}px)`, transformStyle: 'preserve-3d' }}>
                {children}
            </div>
        </motion.div>
    );
}
