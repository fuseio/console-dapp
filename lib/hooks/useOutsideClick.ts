import { useEffect, useRef } from 'react';

export const useOutsideClick = <T extends HTMLElement = HTMLDivElement>(callback: (event: MouseEvent) => void) => {
    const ref = useRef<T>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback(event);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [callback]);

    return ref;
};