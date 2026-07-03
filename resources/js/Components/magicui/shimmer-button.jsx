import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ShimmerButton({
    as: Component = 'button',
    children,
    className,
    shimmerColor = '#FFE7A3',
    background = '#311A05',
    ...props
}) {
    const MotionComponent = useMemo(() => motion.create(Component), [Component]);

    return (
        <MotionComponent
            {...props}
            whileHover={{ y: -4, boxShadow: '0 20px 30px -10px rgba(49,26,5,0.45)' }}
            whileTap={{ y: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
                '--shimmer-color': shimmerColor,
                background,
            }}
            className={cn(
                'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-full px-8 py-4 text-base font-bold text-base shadow-xl',
                className,
            )}
        >
            <div className="absolute inset-0 overflow-visible [container-type:size]">
                <div className="absolute inset-0 h-[100cqh] animate-shimmer bg-[linear-gradient(-75deg,transparent_40%,var(--shimmer-color)_50%,transparent_60%)] bg-[length:200%_100%] opacity-60" />
            </div>
            <span className="relative z-10 flex items-center gap-2">{children}</span>
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-full shadow-[inset_0_-8px_10px_-8px_rgba(255,255,255,0.3)] transition-shadow duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_-6px_rgba(255,255,255,0.4)] group-active:shadow-[inset_0_-10px_10px_-8px_rgba(255,255,255,0.3)]" />
        </MotionComponent>
    );
}
