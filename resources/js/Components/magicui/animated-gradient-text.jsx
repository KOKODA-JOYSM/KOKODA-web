import { cn } from '@/lib/utils';

export function AnimatedGradientText({ children, className, ...props }) {
    return (
        <div
            className={cn(
                'mx-auto w-fit rounded-full bg-gradient-to-r from-primary via-secondary to-tertiary bg-[length:200%_100%] p-[1.5px] shadow-sm animate-gradient-flow',
                className,
            )}
        >
            <div
                {...props}
                className="flex flex-row items-center justify-center rounded-full bg-base px-4 py-1.5 text-sm font-bold transition-shadow duration-500 ease-out hover:shadow-md"
            >
                {children}
            </div>
        </div>
    );
}

export function AnimatedGradientWords({ children, className }) {
    return (
        <span
            className={cn(
                'animate-gradient-flow bg-gradient-to-r from-secondary via-tertiary to-secondary bg-[length:200%_100%] bg-clip-text text-transparent',
                className,
            )}
        >
            {children}
        </span>
    );
}
