import React from 'react';

interface EmptyStateProps {
    title?: string;
    message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
   title = "Şimdi Aktif",
    message = "Burası şimdilik sessiz... Bir arkadaşın, bir oyun oynamak veya sesli sohbete katılmak gibi bir etkinliğe başladığında burada göstereceğiz!"
}) => {
    return (
        <div className="flex flex-col h-full bg-[#2B2D31] text-white">
            <div className="px-4 py-6">
                <h2 className="text-2xl font-semibold mb-6">{title}</h2>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 px-8 text-center">
                <p className="text-sm text-gray-400 max-w-md leading-5">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default EmptyState;