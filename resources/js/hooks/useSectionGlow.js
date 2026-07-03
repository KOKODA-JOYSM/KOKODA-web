import { useCallback, useRef } from 'react';

export function useSectionGlow() {
    const ref = useRef(null);

    const onMouseMove = useCallback((e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    }, []);

    return { ref, onMouseMove };
}
