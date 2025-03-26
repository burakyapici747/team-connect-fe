import React from 'react';

const getRandomWidth = () => {
    return `${Math.floor(Math.random() * 60) + 30}%`;
};

const getRandomMessageWidths = () => {
    const lineCount = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: lineCount }, () => getRandomWidth());
};

const SkeletonMessage = ({ isFirstInGroup = true }) => {
    const messageWidths = getRandomMessageWidths();

    return (
        <div className={`flex items-start gap-4 px-2 ${isFirstInGroup ? "mt-[17px]" : "mt-0.5"}`}>
            {isFirstInGroup ? (
                <div
                    className="w-10 h-10 rounded-full flex-shrink-0 animate-pulse"
                    style={{ background: "var(--discord-tertiary-bg)" }}
                />
            ) : (
                <div className="w-10 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0 py-0.5">
                {isFirstInGroup && (
                    <div className="flex items-center gap-2 mb-1">
                        <div
                            className="h-4 w-24 rounded animate-pulse"
                            style={{ background: "var(--discord-tertiary-bg)" }}
                        />
                        <div
                            className="h-3 w-12 rounded animate-pulse"
                            style={{ background: "var(--discord-tertiary-bg)" }}
                        />
                    </div>
                )}

                {/* Rastgele uzunlukta mesaj satırları */}
                {messageWidths.map((width, idx) => (
                    <div
                        key={idx}
                        className={`h-4 rounded animate-pulse mb-1 ${idx === messageWidths.length - 1 ? '' : 'mb-1'}`}
                        style={{
                            width: width,
                            background: "var(--discord-tertiary-bg)"
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

const createMessageGroups = (count: number) => {
    let messages = [];
    let currentGroup = 0;
    let messagesInCurrentGroup = 0;

    for (let i = 0; i < count; i++) {
        const isFirstInGroup = messagesInCurrentGroup === 0;

        messages.push({
            id: `skeleton-${i}`,
            isFirstInGroup,
            groupId: currentGroup
        });

        messagesInCurrentGroup++;

        const groupLength = Math.floor(Math.random() * 4) + 1;

        if (messagesInCurrentGroup >= groupLength) {
            messagesInCurrentGroup = 0;
            currentGroup++;
        }
    }

    return messages;
};

const SkeletonMessages = ({ count = 5 }) => {
    const skeletonMessages = createMessageGroups(count);

    return (
        <div>
            {skeletonMessages.map((skeleton) => (
                <SkeletonMessage
                    key={skeleton.id}
                    isFirstInGroup={skeleton.isFirstInGroup}
                />
            ))}
        </div>
    );
};

export default SkeletonMessages;