document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    
    // Crear la estructura básica de la aplicación
    const app = document.createElement('div');
    app.className = 'app';
    
    // Barra de navegación
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.innerHTML = `
        <div class="logo">Red SENA</div>
        <div class="nav-items">
            <button class="nav-item active">Inicio</button>
            <button class="nav-item">Mensajes</button>
            <button class="nav-item">Historias</button>
        </div>
    `;
    
    // Contenido principal
    const main = document.createElement('main');
    main.className = 'main-content';
    main.innerHTML = `
        <div class="welcome-message">
            <h1>Bienvenido a Red SENA</h1>
            <p>La red social de la comunidad SENA</p>
        </div>
    `;
    
    // Agregar los elementos al DOM
    app.appendChild(nav);
    app.appendChild(main);
    root.appendChild(app);
});
