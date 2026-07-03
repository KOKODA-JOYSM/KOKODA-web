import { cn } from '@/lib/utils';

export function Marquee({
    className,
    reverse = false,
    pauseOnHover = false,
    children,
    vertical = false,
    repeat = 4,
    ...props
}) {
    return (
        <div
            {...props}
            className={cn(
                'flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
                {
                    'flex-row': !vertical,
                    'flex-col': vertical,
                },
                className,
            )}
        >
            {Array(repeat)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={i}
                        className={cn('flex shrink-0 justify-around [gap:var(--gap)]', {
                            'animate-marquee flex-row': !vertical,
                            'animate-marquee-vertical flex-col': vertical,
                            'has-[.marquee-item:hover]:[animation-play-state:paused]': pauseOnHover,
                            '[animation-direction:reverse]': reverse,
                        })}
                    >
                        {children}
                    </div>
                ))}
        </div>
    );
}
