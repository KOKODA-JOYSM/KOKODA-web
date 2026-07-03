import { cn } from '@/lib/utils';

export function BorderBeam({
    className,
    size = 70,
    duration = 8,
    delay = 0,
    colorFrom = '#FFE7A3',
    colorTo = '#311A05',
}) {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
            <div
                className={cn(
                    'absolute -translate-x-1/2 -translate-y-1/2 animate-beam-orbit rounded-full blur-md',
                    className,
                )}
                style={{
                    width: size,
                    height: size,
                    '--duration': duration,
                    background: `radial-gradient(circle, ${colorFrom}, ${colorTo}00 70%)`,
                    animationDelay: `${-delay}s`,
                }}
            />
        </div>
    );
}
