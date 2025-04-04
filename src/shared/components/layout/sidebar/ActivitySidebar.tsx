import React from 'react';
import EmptyState from '../EmptyState';

interface ActivitySidebarProps {
    children?: React.ReactNode;
    showEmptyState?: boolean;
}

const ActivitySidebar: React.FC<ActivitySidebarProps> = ({
 children,
 showEmptyState = true
}) => {
    return (
        <div className="w-60 border-l border-gray-700 bg-gray-800 hidden md:block h-full">
            {children ? (
                children
            ) : showEmptyState ? (
                <EmptyState />
            ) : null}
        </div>
    );
};

export default ActivitySidebar;