export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth',
    },
    USERS: {
        REGISTER: '/users',
        ME: '/users/me'
    },
    MESSAGES: {},
    TEAMS: {
        CURRENT_USER_TEAMS: '/users/me/teams',
        CREATE_TEAM: '/teams/'
    },
    DM_CHANNELS: {},
    FRIENDSHIPS: {},
} as const;