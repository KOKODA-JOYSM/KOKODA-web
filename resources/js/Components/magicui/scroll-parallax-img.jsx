import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ScrollParallaxImg({ className, range = [-60, 60], scale = 1.15, ...props }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], range);

    return (
        <motion.img
            ref={ref}
            style={{ y, scale }}
            className={cn(className)}
            {...props}
        />
    );
}
