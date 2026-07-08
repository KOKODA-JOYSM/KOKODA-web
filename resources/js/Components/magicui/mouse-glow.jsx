import { cn } from '@/lib/utils';

export function MouseGlow({ color = '244,199,153', size = 650, className }) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                'pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100',
                className,
            )}
            style={{
                background: `radial-gradient(${size}px circle at var(--mx, 50%) var(--my, 50%), rgba(${color}, 0.15), transparent 60%)`,
            }}
        />
    );
}
