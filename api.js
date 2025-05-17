// Configuración de las rutas API
const API_BASE_URL = 'https://api.redsena.com'; // URL del backend

// Funciones para manejar las peticiones
export const fetchPosts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const createPost = async (post) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(post)
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

export const likePost = async (postId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error liking post:', error);
        throw error;
    }
};

export const commentPost = async (postId, comment) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ content: comment })
        });
        return await response.json();
    } catch (error) {
        console.error('Error commenting post:', error);
        throw error;
    }
};

export const fetchUser = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            return data;
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};
