const API_BASE_URL = 'http://localhost/letter/backend/api';

export const api = {
    auth: {
        login: async (email, password) => {
            const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return response.json();
        },
        register: async (email, password, name) => {
            const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            });
            return response.json();
        },
        updateProfile: async (userData) => {
            const response = await fetch(`${API_BASE_URL}/auth/update_profile.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            return response.json();
        },
        uploadAvatar: async (formData) => {
            const response = await fetch(`${API_BASE_URL}/auth/upload_avatar.php`, {
                method: 'POST',
                // No Content-Type header needed; fetch sets it automatically for FormData
                body: formData
            });
            return response.json();
        }
    },
    letters: {
        list: async (userId) => {
            const response = await fetch(`${API_BASE_URL}/letters/list.php?user_id=${userId}`);
            return response.json();
        },
        create: async (userId, letterData) => {
            const response = await fetch(`${API_BASE_URL}/letters/create.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, ...letterData })
            });
            return response.json();
        },
        view: async (id, userId) => {
            const response = await fetch(`${API_BASE_URL}/letters/view.php?id=${id}&user_id=${userId}`);
            return response.json();
        },
        open: async (id) => {
            const response = await fetch(`${API_BASE_URL}/letters/open.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            return response.json();
        },
        delete: async (id, user_id) => {
            const response = await fetch(`${API_BASE_URL}/letters/delete.php?id=${id}&user_id=${user_id}`, {
                method: 'DELETE'
            });
            return response.json();
        },
        deleteAll: async (user_id) => {
            const response = await fetch(`${API_BASE_URL}/letters/delete_all.php?user_id=${user_id}`, {
                method: 'DELETE'
            });
            return response.json();
        }
    }
};
