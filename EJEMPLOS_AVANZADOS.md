// ===================================================
// EJEMPLOS AVANZADOS - Cómo Extender el Blog SIUM
// ===================================================

// ============================================
// 1. CREAR UNA NUEVA PÁGINA
// ============================================

// Paso 1: Crear el archivo blog/paginas/portafolio.sium

/\*
[componente navegacion]

<nav>...</nav>
[/componente]

<contenedor estilo="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
  <t1>Mis Proyectos</t1>
  
  <div estilo="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
    <proyecto-card>
    <proyecto-card>
    <proyecto-card>
  </div>
</contenedor>

[componente pie-pagina]

<footer>...</footer>
[/componente]

[funcion verProyecto()]
variable proyecto = obtenerProyectos()[0]
mostrar proyecto.titulo
[/funcion]
\*/

// ============================================
// 2. CREAR UN COMPONENTE PERSONALIZADO
// ============================================

// Crear archivo: blog/componentes/proyecto-card.sium

/\*
[componente proyecto-card]

<div estilo="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s;">
  <div estilo="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 48px;">
    🎨
  </div>
  <div estilo="padding: 20px;">
    <t3 estilo="margin-top: 0;">Nombre del Proyecto</t3>
    <parrafo estilo="color: #7f8c8d;">Descripción breve del proyecto</parrafo>
    <div estilo="display: flex; gap: 10px; flex-wrap: wrap;">
      <span estilo="background: #667eea; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px;">React</span>
      <span estilo="background: #667eea; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px;">Node.js</span>
    </div>
    <div estilo="display: flex; gap: 10px; margin-top: 15px;">
      <enlace href="#" texto="Ver Proyecto" estilo="flex: 1; text-align: center;">
      <enlace href="#" texto="GitHub" estilo="flex: 1; text-align: center;">
    </div>
  </div>
</div>
[/componente]
*/

// ============================================
// 3. AGREGAR FUNCIONALIDADES JAVASCRIPT
// ============================================

// Agregar a helpers.js:

// Obtener proyectos simulados
function obtenerProyectos() {
return [
{
id: 1,
titulo: 'E-Commerce SIUM',
descripcion: 'Plataforma de ventas con SIUM Framework',
tecnologias: ['SIUM', 'JavaScript', 'CSS Grid'],
url: 'https://ejemplo.com',
github: 'https://github.com'
},
{
id: 2,
titulo: 'Blog Personal',
descripcion: 'Blog construido 100% con SIUM',
tecnologias: ['SIUM', 'HTML5', 'CSS3'],
url: 'https://ejemplo.com',
github: 'https://github.com'
},
{
id: 3,
titulo: 'Dashboard Analytics',
descripcion: 'Panel de control con gráficos',
tecnologias: ['SIUM', 'Chart.js', 'API REST'],
url: 'https://ejemplo.com',
github: 'https://github.com'
}
];
}

// Filtrar proyectos por tecnología
function obtenerProyectosPorTecnologia(tecnologia) {
return obtenerProyectos().filter(p =>
p.tecnologias.includes(tecnologia)
);
}

// ============================================
// 4. AGREGAR SISTEMA DE BUSQUEDA
// ============================================

// Crear archivo: blog/paginas/busqueda.sium

/\*
<contenedor estilo="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
<t1>Buscar Artículos</t1>

  <div estilo="margin-bottom: 30px;">
    <entrada tipo="texto" id="termino-busqueda" marcador="Buscar..." estilo="width: 100%; padding: 15px; border: 2px solid #667eea; border-radius: 8px; font-size: 16px;">
  </div>
  
  <div id="resultados-busqueda"></div>
</contenedor>

[funcion buscar()]
variable termino = document.getElementById("termino-busqueda").value
variable articulos = obtenerArticulos()
variable resultados = articulos.filter(a =>
a.titulo.toLowerCase().includes(termino.toLowerCase()) ||
a.resumen.toLowerCase().includes(termino.toLowerCase())
)

mostrar "Se encontraron " + resultados.length + " resultados"
[/funcion]
\*/

// ============================================
// 5. AGREGAR COMENTARIOS CON PERSISTENCIA
// ============================================

// Agregar a helpers.js:

function guardarComentario(articuloId, nombre, texto) {
const comentarios = obtenerDelLocal('comentarios') || {};

if(!comentarios[articuloId]) {
comentarios[articuloId] = [];
}

comentarios[articuloId].push({
nombre,
texto,
fecha: new Date().toLocaleDateString('es-ES'),
id: Date.now()
});

guardarEnLocal('comentarios', comentarios);
return true;
}

function obtenerComentarios(articuloId) {
const comentarios = obtenerDelLocal('comentarios') || {};
return comentarios[articuloId] || [];
}

function eliminarComentario(articuloId, comentarioId) {
const comentarios = obtenerDelLocal('comentarios') || {};

if(comentarios[articuloId]) {
comentarios[articuloId] = comentarios[articuloId].filter(c =>
c.id !== comentarioId
);
guardarEnLocal('comentarios', comentarios);
return true;
}

return false;
}

// ============================================
// 6. AGREGAR SISTEMA DE SUSCRIPCION
// ============================================

// Agregar a helpers.js:

function suscribirse(email) {
if(!validarEmail(email)) {
return { exito: false, mensaje: 'Email inválido' };
}

const suscriptores = obtenerDelLocal('suscriptores') || [];

if(suscriptores.includes(email)) {
return { exito: false, mensaje: 'Ya estás suscrito' };
}

suscriptores.push(email);
guardarEnLocal('suscriptores', suscriptores);

return {
exito: true,
mensaje: 'Gracias por suscribirte',
cantidad: suscriptores.length
};
}

function desuscribirse(email) {
const suscriptores = obtenerDelLocal('suscriptores') || [];
const nuevos = suscriptores.filter(s => s !== email);
guardarEnLocal('suscriptores', nuevos);
return true;
}

// ============================================
// 7. AGREGAR DARK MODE
// ============================================

// Agregar a helpers.js:

function activarDarkMode() {
document.body.style.backgroundColor = '#1a1a1a';
document.body.style.color = '#ecf0f1';
guardarEnLocal('darkMode', true);
}

function desactivarDarkMode() {
document.body.style.backgroundColor = '#f5f7fa';
document.body.style.color = '#34495e';
guardarEnLocal('darkMode', false);
}

function toggleDarkMode() {
const darkMode = obtenerDelLocal('darkMode') || false;

if(darkMode) {
desactivarDarkMode();
} else {
activarDarkMode();
}
}

// En index.html, al cargar:
document.addEventListener('DOMContentLoaded', function() {
const darkMode = obtenerDelLocal('darkMode') || false;
if(darkMode) {
activarDarkMode();
}
});

// En navegación:
/_
<boton cuando_clic="toggleDarkMode()" estilo="background: transparent; border: 2px solid white; color: white; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
🌙 Dark Mode
</boton>
_/

// ============================================
// 8. CREAR PAGINA DE ESTADISTICAS
// ============================================

// Crear archivo: blog/paginas/stats.sium

/\*
<contenedor estilo="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
<t1>Estadísticas del Blog</t1>

  <div estilo="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
    <div estilo="background: white; padding: 20px; border-radius: 8px; text-align: center;">
      <parrafo estilo="font-size: 32px; color: #667eea; margin: 0;">12</parrafo>
      <parrafo estilo="color: #7f8c8d; margin: 0;">Artículos Publicados</parrafo>
    </div>
    
    <div estilo="background: white; padding: 20px; border-radius: 8px; text-align: center;">
      <parrafo estilo="font-size: 32px; color: #27ae60; margin: 0;">2.5K</parrafo>
      <parrafo estilo="color: #7f8c8d; margin: 0;">Lectores Mensuales</parrafo>
    </div>
    
    <div estilo="background: white; padding: 20px; border-radius: 8px; text-align: center;">
      <parrafo estilo="font-size: 32px; color: #3498db; margin: 0;">847</parrafo>
      <parrafo estilo="color: #7f8c8d; margin: 0;">Suscriptores</parrafo>
    </div>
  </div>
</contenedor>

[funcion obtenerStats()]
variable articulos = obtenerArticulos().length
variable comentarios = obtenerDelLocal("comentarios") || {}
variable suscriptores = obtenerDelLocal("suscriptores") || []
variable totalComentarios = Object.values(comentarios).reduce((a, b) => a + b.length, 0)

mostrar "Total: " + articulos + " artículos"
mostrar "Comentarios: " + totalComentarios
mostrar "Suscriptores: " + suscriptores.length
[/funcion]
\*/

// ============================================
// 9. AGREGAR GALERIA DE FOTOS
// ============================================

// Función para obtener imágenes
function obtenerGaleria() {
return [
{ id: 1, titulo: 'Foto 1', url: 'imagen1.jpg', categoria: 'natureza' },
{ id: 2, titulo: 'Foto 2', url: 'imagen2.jpg', categoria: 'viajes' },
{ id: 3, titulo: 'Foto 3', url: 'imagen3.jpg', categoria: 'natureza' }
];
}

// ============================================
// 10. AGREGAR SISTEMA DE NOTIFICACIONES
// ============================================

// Mejor versión de notificaciones
function mostrarToast(mensaje, tipo = 'info', duracion = 3000) {
const colores = {
'exito': '#27ae60',
'error': '#e74c3c',
'info': '#3498db',
'advertencia': '#f39c12'
};

const toast = document.createElement('div');
toast.style.cssText = `    position: fixed;
    top: 20px;
    right: 20px;
    background-color: ${colores[tipo]};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    z-index: 9999;
    font-weight: bold;
    animation: slideIn 0.3s ease-out;
 `;

toast.textContent = mensaje;
document.body.appendChild(toast);

setTimeout(() => {
toast.style.animation = 'slideOut 0.3s ease-out';
setTimeout(() => toast.remove(), 300);
}, duracion);
}

// ============================================
// RESUMEN DE EXTENSIONES
// ============================================

/\*
Con estos ejemplos puedes agregar:

✅ Nuevas páginas
✅ Componentes personalizados  
✅ Búsqueda de artículos
✅ Comentarios persistentes
✅ Sistema de suscripción
✅ Dark mode
✅ Estadísticas
✅ Galerías de fotos
✅ Notificaciones mejoradas

Todos 100% con SIUM Framework y JavaScript Vanilla.
\*/
