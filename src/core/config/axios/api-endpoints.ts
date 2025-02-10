export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth',
    },
    USERS: {
        REGISTER: '/users',
        ME: '/users/me'
    },
    MESSAGES: {
        DM_CHANNEL_MESSAGES: '/channels/{channelId}/messages'
    },
    TEAMS: {
        CURRENT_USER_TEAMS: '/users/me/teams',
        CREATE_TEAM: '/teams/'
    },
    DM_CHANNELS: {
        CURRENT_USER_DM_CHANNELS: '/users/me/channels'
    },
    FRIENDSHIPS: {
        CURRENT_USER_FRIENDSHIPS: '/users/me/relationships',
        CURRENT_USER_OUTGOING_FRIENDSHIPS: '/users/me/friendships/outgoing-requests',
        CURRENT_USER_INCOMING_FRIENDSHIPS: '/users/me/friendships/incoming-requests',
    },
    PROFILE: {
        CURRENT_USER_PROFILE: '/users/me/profile'
    },
} as const;