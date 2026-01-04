import { useEffect } from 'react';

const usePageTitle = (title) => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = title;

        return () => {
            // Optional: Restore previous title on unmount? 
            // Usually not needed for SPA page transitions as the next page overwrites it immediately.
            // But good practice if unmounting to a "no-title" state. 
            // For now, simple set is enough.
        };
    }, [title]);
};

export default usePageTitle;
