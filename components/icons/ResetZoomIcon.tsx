import React from 'react';

interface IconProps {
    className?: string;
}

export const ResetZoomIcon: React.FC<IconProps> = ({ className }) => {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M3 2.812A9.94 9.94 0 0 1 12 2a10 10 0 0 1 10 10c0 3.9-2.2 7.2-5.3 8.8"></path>
            <path d="M17.8 14.2A9.94 9.94 0 0 1 12 22a10 10 0 0 1-10-10c0-3.9 2.2-7.2 5.3-8.8"></path>
            <path d="M2 12H5.5"></path><path d="M18.5 12H22"></path>
            <path d="M12 2V5.5"></path><path d="M12 18.5V22"></path>
            <circle cx="12" cy="12" r="2"></circle>
        </svg>
    );
};
