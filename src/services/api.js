const API_BASE_URL = 'http://localhost/Letters-From-The-past/backend/api';

const handleResponse = async (response) => {
    const text = await response.text();
    try {
        if (!response.ok) {
            // Include status code in the error message for better debugging
            console.error(`API Error: ${response.status} ${response.statusText}`, text);
            try {
                const errorData = JSON.parse(text);
                return { status: 'error', message: errorData.message || `Server error (${response.status})` };
            } catch (e) {
                return { status: 'error', message: `Server error (${response.status}): ${text.substring(0, 50)}` };
            }
        }
        return JSON.parse(text);
    } catch (err) {
        console.error('API Error: Non-JSON response', text);
        return { status: 'error', message: 'Server returned an invalid response. Please check if the backend is running and the database is connected.' };
    }
};

export const api = {
    auth: {
        login: async (email, password) => {
            const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return handleResponse(response);
        },
        register: async (email, password, name) => {
            const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            });
            return handleResponse(response);
        },
        updateProfile: async (userData) => {
            const response = await fetch(`${API_BASE_URL}/auth/update_profile.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            return handleResponse(response);
        },
        uploadAvatar: async (formData) => {
            const response = await fetch(`${API_BASE_URL}/auth/upload_avatar.php`, {
                method: 'POST',
                body: formData
            });
            return handleResponse(response);
        },
        changePassword: async (userId, currentPassword, newPassword) => {
            const response = await fetch(`${API_BASE_URL}/auth/change_password.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, current_password: currentPassword, new_password: newPassword })
            });
            return handleResponse(response);
        }
    },
    letters: {
        list: async (userId) => {
            const response = await fetch(`${API_BASE_URL}/letters/list.php?user_id=${userId}`);
            return handleResponse(response);
        },
        create: async (userId, letterData) => {
            const response = await fetch(`${API_BASE_URL}/letters/create.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, ...letterData })
            });
            return handleResponse(response);
        },
        view: async (id, userId) => {
            const response = await fetch(`${API_BASE_URL}/letters/view.php?id=${id}&user_id=${userId}`);
            return handleResponse(response);
        },
        open: async (id) => {
            const response = await fetch(`${API_BASE_URL}/letters/open.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            return handleResponse(response);
        },
        delete: async (id, user_id) => {
            const response = await fetch(`${API_BASE_URL}/letters/delete.php?id=${id}&user_id=${user_id}`, {
                method: 'DELETE'
            });
            return handleResponse(response);
        },
        deleteAll: async (user_id) => {
            const response = await fetch(`${API_BASE_URL}/letters/delete_all.php?user_id=${user_id}`, {
                method: 'DELETE'
            });
            return handleResponse(response);
        }
    }
};
