import React from 'react';

interface IconProps {
    className?: string;
}

export const ArchimateCapabilityIcon: React.FC<IconProps> = ({ className }) => {
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
            {/* Outer hexagon */}
            <path d="M12 2l8.66 5v10L12 22l-8.66-5V7l8.66-5z"></path>
            {/* Inner hexagon, as per ArchiMate 3.2 spec */}
            <path d="M12 6L17.2 9v6L12 18l-5.2-3V9L12 6z"></path>
        </svg>
    );
};
