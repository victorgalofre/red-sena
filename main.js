// Funcionalidad básica de la red social

import { fetchPosts, createPost, likePost, commentPost, login, logout } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Manejar el modo oscuro
    const toggle = document.getElementById('toggle');
    const html = document.querySelector('html');
    
    // Verificar preferencia guardada o usar preferencia del sistema
    if (localStorage.getItem('darkMode') === 'true' || 
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
        toggle.checked = true;
    }
    
    toggle.addEventListener('change', function() {
        if (this.checked) {
            html.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            html.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    });

    // Manejar el menú desplegable del usuario
    const userMenu = document.getElementById('user-menu');
    const userDropdown = document.getElementById('user-dropdown');
    
    userMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('hidden');
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function() {
        userDropdown.classList.add('hidden');
    });

    // Cargar posts al inicio
    try {
        const posts = await fetchPosts();
        renderPosts(posts);
    } catch (error) {
        console.error('Error loading posts:', error);
    }

    // Manejar likes en las publicaciones
    document.querySelectorAll('.post-like').forEach(button => {
        button.addEventListener('click', async function() {
            const postId = this.closest('.post').dataset.id;
            try {
                await likePost(postId);
                // Actualizar la interfaz
                const icon = this.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas', 'text-blue-500');
                    this.querySelector('span').textContent = 'Me gusta';
                } else {
                    icon.classList.remove('fas', 'text-blue-500');
                    icon.classList.add('far');
                    this.querySelector('span').textContent = 'Me gusta';
                }
            } catch (error) {
                console.error('Error liking post:', error);
            }
        });
    });

    // Manejar comentarios
    document.querySelectorAll('.comment-input').forEach(input => {
        input.addEventListener('keypress', async function(e) {
            if (e.key === 'Enter' && e.target.value.trim()) {
                const postId = this.closest('.comments-section').dataset.postId;
                try {
                    await commentPost(postId, e.target.value);
                    // Actualizar la interfaz
                    const commentContainer = this.closest('.comments-section');
                    const newComment = document.createElement('div');
                    newComment.className = 'flex items-start mb-3';
                    newComment.innerHTML = `
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" class="h-8 w-8 rounded-full mr-2">
                        <div class="flex-1 bg-white dark:bg-gray-600 rounded-lg p-2">
                            <p class="font-medium text-sm dark:text-white">Tu nombre</p>
                            <p class="text-sm dark:text-gray-300">${e.target.value}</p>
                            <div class="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span>Hace unos segundos</span>
                                <button class="ml-3 font-medium">Me gusta</button>
                                <button class="ml-3 font-medium">Responder</button>
                            </div>
                        </div>
                    `;
                    commentContainer.insertBefore(newComment, this.parentElement);
                    e.target.value = '';
                } catch (error) {
                    console.error('Error commenting:', error);
                }
            }
        });
    });

    // Función para renderizar posts
    function renderPosts(posts) {
        const postsContainer = document.getElementById('posts-container');
        posts.forEach(post => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
        });
    }

    // Función para crear elementos de post
    function createPostElement(post) {
        const postElement = document.createElement('div');
        postElement.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 post-animation';
        postElement.innerHTML = `
            <div class="p-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <img src="${post.user.avatar}" alt="${post.user.name}" class="h-10 w-10 rounded-full mr-3">
                        <div>
                            <h4 class="font-semibold dark:text-white">${post.user.name}</h4>
                            <p class="text-gray-500 dark:text-gray-400 text-xs">${formatTime(post.createdAt)}</p>
                        </div>
                    </div>
                    <button class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
                
                <div class="mt-3 dark:text-white">
                    <p>${post.content}</p>
                </div>
                
                ${post.image ? `<div class="mt-3 rounded-lg overflow-hidden">
                    <img src="${post.image}" alt="${post.content}" class="w-full h-auto">
                </div>` : ''}
                
                <div class="flex justify-between mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex items-center">
                        <div class="flex items-center -space-x-1">
                            ${post.likes.map(like => `<div class="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">👍</div>`).join('')}
                        </div>
                        <span class="ml-1">${post.likes.length}</span>
                    </div>
                    <div>
                        <span>${post.comments.length} comentarios</span>
                    </div>
                </div>
                
                <div class="flex justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <button class="flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-3 py-1 flex-1 post-like" data-post-id="${post.id}">
                        <i class="far fa-thumbs-up mr-2"></i>
                        <span>Me gusta</span>
                    </button>
                    <button class="flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-3 py-1 flex-1">
                        <i class="far fa-comment mr-2"></i>
                        <span>Comentar</span>
                    </button>
                    <button class="flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-3 py-1 flex-1">
                        <i class="far fa-share-square mr-2"></i>
                        <span>Compartir</span>
                    </button>
                </div>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-200 dark:border-gray-600 comments-section" data-post-id="${post.id}">
                ${post.comments.map(comment => `
                    <div class="flex items-start mb-3">
                        <img src="${comment.user.avatar}" alt="${comment.user.name}" class="h-8 w-8 rounded-full mr-2">
                        <div class="flex-1 bg-white dark:bg-gray-600 rounded-lg p-2">
                            <p class="font-medium text-sm dark:text-white">${comment.user.name}</p>
                            <p class="text-sm dark:text-gray-300">${comment.content}</p>
                            <div class="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span>${formatTime(comment.createdAt)}</span>
                                <button class="ml-3 font-medium">Me gusta</button>
                                <button class="ml-3 font-medium">Responder</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
                
                <div class="flex items-center">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" class="h-8 w-8 rounded-full mr-2">
                    <div class="flex-1">
                        <input type="text" placeholder="Escribe un comentario..." 
                               class="w-full bg-gray-100 dark:bg-gray-600 dark:text-white rounded-full py-2 px-4 focus:outline-none text-sm comment-input">
                    </div>
                </div>
            </div>
        `;
        return postElement;
    }

    // Función para formatear tiempo
    function formatTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `Hace ${minutes} min`;
        
        const hours = Math.floor(diff / 3600000);
        if (hours < 24) return `Hace ${hours} h`;
        
        const days = Math.floor(diff / 86400000);
        if (days < 7) return `Hace ${days} d`;
        
        return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(time);
    }
});
