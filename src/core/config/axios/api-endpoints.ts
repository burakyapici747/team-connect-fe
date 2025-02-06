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
    DM_CHANNELS: {
        GET_CURRENT_USER_DM_CHANNELS: '/users/me/channels'
    },
    FRIENDSHIPS: {},
} as const;