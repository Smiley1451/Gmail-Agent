// src/config/api.js
 //export const API_BASE_URL = 'https://email-agent-sv9x.onrender.com/api';
export const API_BASE_URL ='http://localhost:8080/api';
export const API_ENDPOINTS = {
    AUTH: {
        START: `${API_BASE_URL}/auth/start`,
        STATUS: `${API_BASE_URL}/auth/status`,
    },
    EMAILS: {
        ALL: `${API_BASE_URL}/fetch-emails/all`,
        BY_STATUS: (status) => `${API_BASE_URL}/fetch-emails/status/${status}`,
        BY_CATEGORY: (category) => `${API_BASE_URL}/categorize-emails/category/${category}`,
        SYNC: `${API_BASE_URL}/fetch-emails/sync`,
        DETAIL: (id) => `${API_BASE_URL}/fetch-emails/${id}`,
    },
    CATEGORIZE: {
        RUN: `${API_BASE_URL}/categorize-emails/run`,
        CATEGORIZE: (id) => `${API_BASE_URL}/categorize-emails/categorize/${id}`,
    },
    REPLIES: {
        GENERATE: (id) => `${API_BASE_URL}/generate-reply/generate/${id}`,
        GET: (id) => `${API_BASE_URL}/generate-reply/${id}`,
        BY_STATUS: (status) => `${API_BASE_URL}/generate-reply/email/${status}`,
        SEND_ALL: `${API_BASE_URL}/emails/send-generated`,
        DRAFT_ALL: `${API_BASE_URL}/emails/draft-generated`,
        SEND: (id) => `${API_BASE_URL}/emails/${id}/send`,
        DRAFT: (id) => `${API_BASE_URL}/emails/${id}/draft`,
    },
    AUTO_AGENT: {
        STATUS: `${API_BASE_URL}/auto-agent/status`,
        RUN: `${API_BASE_URL}/auto-agent/run`,
        STOP: `${API_BASE_URL}/auto-agent/stop`,
    },
    STATS: {
        TIME: `${API_BASE_URL}/email-stats/time`,
    },
    SETTINGS: {
        GET: `${API_BASE_URL}/settings`,
        UPDATE: `${API_BASE_URL}/settings/update`,
        BUSINESS_DOCS: `${API_BASE_URL}/settings/business-docs`,
        VECTORIZE: (id) => `${API_BASE_URL}/settings/vectorize/${id}`,
        DELETE_DOC: (id) => `${API_BASE_URL}/settings/business-docs/${id}`,
    },
    BUSINESS: {
        UPDATE: `${API_BASE_URL}/business/update`,
    }
};