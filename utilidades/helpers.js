// ============================================
// Utilidades Globales para el Blog SIUM
// ============================================

// Función para cambiar página del blog
function irAPagina(nombrePagina) {
  window.location.hash = '#' + nombrePagina;
}

// Función para ir al inicio
function irAlInicio() {
  irAPagina('inicio');
}

// Función para obtener artículos (simulado)
function obtenerArticulos() {
  return [
    {
      id: 1,
      titulo: 'Introducción a SIUM Framework',
      fecha: '18 de Noviembre, 2025',
      categoria: 'Frameworks',
      autor: 'Juan Pérez',
      resumen: 'Descubre cómo SIUM simplifica el desarrollo web...',
      lectura: '8 min'
    },
    {
      id: 2,
      titulo: 'Mejores Prácticas en JavaScript',
      fecha: '15 de Noviembre, 2025',
      categoria: 'JavaScript',
      autor: 'Juan Pérez',
      resumen: 'Aprende las mejores prácticas para escribir código JavaScript...',
      lectura: '12 min'
    },
    {
      id: 3,
      titulo: 'Diseño Responsivo con CSS Grid',
      fecha: '12 de Noviembre, 2025',
      categoria: 'CSS',
      autor: 'Juan Pérez',
      resumen: 'Domina CSS Grid y crea layouts responsivos...',
      lectura: '10 min'
    }
  ];
}

// Función para obtener artículos por categoría
function obtenerArticulosPorCategoria(categoria) {
  return obtenerArticulos().filter(articulo => articulo.categoria === categoria);
}

// Función para validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Función para formatear fecha
function formatearFecha(fecha) {
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

// Función para contar palabras
function contarPalabras(texto) {
  return texto.trim().split(/\s+/).length;
}

// Función para generar slug desde un título
function generarSlug(titulo) {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-');
}

// Función para obtener tiempo de lectura estimado
function calcularTiempoLectura(texto) {
  const palabras = contarPalabras(texto);
  const minutos = Math.ceil(palabras / 200);
  return minutos + ' min';
}

// Función para guardar en localStorage
function guardarEnLocal(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// Función para obtener de localStorage
function obtenerDelLocal(clave) {
  const valor = localStorage.getItem(clave);
  return valor ? JSON.parse(valor) : null;
}

// Función para limpiar localStorage
function limpiarLocal(clave) {
  localStorage.removeItem(clave);
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'info') {
  const notificacion = document.createElement('div');
  const colores = {
    'exito': '#27ae60',
    'error': '#e74c3c',
    'info': '#3498db',
    'advertencia': '#f39c12'
  };
  
  notificacion.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: ${colores[tipo]};
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 9999;
    font-weight: bold;
  `;
  notificacion.textContent = mensaje;
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.remove();
  }, 3000);
}

// Función para hacer scroll suave
function scrollSuave(elementoId) {
  const elemento = document.getElementById(elementoId);
  if(elemento) {
    elemento.scrollIntoView({ behavior: 'smooth' });
  }
}

// ============================================
// Funciones de Utilidad para Desarrollo
// ============================================

console.log('✅ Utilidades del Blog SIUM cargadas correctamente');
