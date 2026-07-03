import { useMemo } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.05,
        },
    },
};

export function StaggerGroup({ children, className, once = true, amount = 0.2, as = 'div' }) {
    const MotionTag = useMemo(() => motion.create(as), [as]);

    return (
        <MotionTag
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount }}
            variants={containerVariants}
        >
            {children}
        </MotionTag>
    );
}

const itemVariants = {
    hidden: { opacity: 0, y: 48, rotateX: -25 },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
};

export function StaggerItem({ children, className, style, as = 'div' }) {
    const MotionTag = useMemo(() => motion.create(as), [as]);

    return (
        <MotionTag
            className={className}
            variants={itemVariants}
            style={{ transformPerspective: 800, ...style }}
        >
            {children}
        </MotionTag>
    );
}
