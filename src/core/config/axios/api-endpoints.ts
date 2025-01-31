export const API_ENDPOINTS = {
    AUTH: {
        login: '/auth',
    },
    USERS: {
        register: '/users',
        me: '/users/me'
    },
    MESSAGES: {},
    TEAMS: {},
    DM_CHANNELS: {},
    FRIENDSHIPS: {},
} as const;