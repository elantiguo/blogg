# 📚 Blog Personal con SIUM Framework

Un ejemplo completo de un blog personal creado 100% con **SIUM Framework**, dividido en carpetas y componentes reutilizables.

## 📁 Estructura del Proyecto

```
blog/
├── paginas/                    # Páginas principales del blog
│   ├── inicio.sium            # Página de inicio con resumen
│   ├── articulos.sium         # Listado de todos los artículos
│   ├── articulo-detalle.sium  # Vista detallada de un artículo
│   ├── sobre-mi.sium          # Página de perfil del autor
│   └── contacto.sium          # Formulario de contacto
│
├── componentes/               # Componentes reutilizables
│   ├── navegacion.sium        # Barra de navegación
│   ├── pie-pagina.sium        # Footer del sitio
│   ├── tarjeta-articulo.sium  # Tarjeta de artículo
│   └── comentario.sium        # Componente de comentarios
│
├── utilidades/                # Funciones y helpers
│   └── helpers.js             # Funciones JavaScript utilitarias
│
└── README.md                  # Este archivo
```

## 🎯 Características Implementadas

### 1. **Componentes Reutilizables**

- **Navegación**: Barra de menú consistente en todas las páginas
- **Pie de Página**: Footer con información y enlaces sociales
- **Tarjetas de Artículos**: Componente para mostrar artículos
- **Comentarios**: Sistema de comentarios modular

### 2. **Páginas Principales**

- **Inicio**: Página principal con hero section y resumen de contenidos
- **Artículos**: Listado completo con categorías y búsqueda
- **Artículo Detallado**: Vista individual con comentarios
- **Sobre Mí**: Perfil del autor con experiencia y habilidades
- **Contacto**: Formulario de contacto funcional

### 3. **Funcionalidades**

- ✅ Enrutamiento basado en hash (#inicio, #articulos, etc.)
- ✅ Componentes reutilizables con [componente]...[/componente]
- ✅ Funciones declarativas con [funcion nombre()]...[/funcion]
- ✅ Formularios con validación
- ✅ Estilos inline con CSS Grid y Flexbox
- ✅ Eventos onClick con cuando_clic
- ✅ localStorage para persistencia de datos

## 🚀 Cómo Usar

### 1. Cargar el Blog

```
Los archivos .sium se cargan automáticamente según el hash:
- http://localhost/#inicio     → Carga inicio.sium
- http://localhost/#articulos  → Carga articulos.sium
- http://localhost/#sobre-mi    → Carga sobre-mi.sium
- http://localhost/#contacto    → Carga contacto.sium
```

### 2. Crear Nuevas Páginas

1. Crea un archivo `nombre-pagina.sium` en la carpeta `paginas/`
2. Usa componentes importándolos con `[componente nombre]...[/componente]`
3. Accede a través de `#nombre-pagina`

### 3. Crear Nuevos Componentes

1. Crea un archivo `componente.sium` en la carpeta `componentes/`
2. Escribe el componente:

```sium
[componente mi-componente]
<contenedor estilo="...">
  <t1>Mi Componente</t1>
  <parrafo>Contenido aquí</parrafo>
</contenedor>
[/componente]
```

3. Úsalo en cualquier página

## 💡 Ejemplos de Código

### Crear una Función

```sium
[funcion saludar()]
variable nombre = document.getElementById("nombre").value
mostrar "Hola, " + nombre
[/funcion]
```

### Usar Componentes

```sium
[componente navegacion]
<nav estilo="background-color: #333;">
  <enlace href="#inicio" texto="Inicio">
</nav>
[/componente]
```

### Formulario con Validación

```sium
<entrada tipo="email" id="email" marcador="Tu email">
<boton cuando_clic="validarEmail()">Enviar</boton>

[funcion validarEmail()]
variable email = document.getElementById("email").value
[si email.includes("@")]
mostrar "Email válido"
[/si]
[/funcion]
```

### Grid Responsivo

```sium
<div estilo="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
  <div>Columna 1</div>
  <div>Columna 2</div>
  <div>Columna 3</div>
</div>
```

## 📝 Páginas y Funciones

### Página Inicio (inicio.sium)

- Hero section con gradiente
- 3 tarjetas de características
- Últimos artículos destacados
- Navegación y footer

### Página Artículos (articulos.sium)

- Listado de artículos con tarjetas
- Categorías en sidebar
- Artículos populares
- Newsletter suscripción

### Artículo Detallado (articulo-detalle.sium)

- Contenido completo del artículo
- Metadata (fecha, autor, tiempo lectura)
- Sección de comentarios
- Sistema de comentarios funcional

### Página Sobre Mí (sobre-mi.sium)

- Foto/Avatar del autor
- Biografía completa
- Habilidades técnicas con tags
- Experiencia laboral
- Enlaces a redes sociales
- Botón descargar CV

### Página Contacto (contacto.sium)

- Formulario de contacto completo
- Validación de campos
- Información de contacto
- Enlaces a redes sociales
- Respuestas del formulario

## 🎨 Paleta de Colores

| Color          | Código  | Uso                            |
| -------------- | ------- | ------------------------------ |
| Azul Principal | #667eea | Acentos, botones               |
| Gris Oscuro    | #2c3e50 | Fondos oscuros, textos títulos |
| Gris Claro     | #ecf0f1 | Textos en fondos oscuros       |
| Verde Éxito    | #27ae60 | Mensajes de éxito              |
| Rojo Error     | #e74c3c | Mensajes de error              |
| Naranja Info   | #f39c12 | Información general            |

## 📱 Diseño Responsivo

Todas las páginas usan:

- **CSS Grid**: Para layouts complejos
- **Flexbox**: Para alineación y espaciado
- **Media Queries**: Aunque principalmente Flexbox y Grid manejan la responsividad
- **Viewport Meta**: Configurado en index.html

## 🔧 Funciones Disponibles (helpers.js)

```javascript
irAPagina(nombrePagina); // Navega a una página
irAlInicio(); // Vuelve al inicio
obtenerArticulos(); // Retorna lista de artículos
obtenerArticulosPorCategoria(); // Filtra por categoría
validarEmail(email); // Valida formato de email
formatearFecha(fecha); // Formatea fechas
contarPalabras(texto); // Cuenta palabras
generarSlug(titulo); // Convierte título a URL
calcularTiempoLectura(texto); // Calcula min de lectura
guardarEnLocal(clave, valor); // Guarda en localStorage
obtenerDelLocal(clave); // Obtiene de localStorage
limpiarLocal(clave); // Limpia localStorage
mostrarNotificacion(msg, tipo); // Muestra notificación
scrollSuave(elementoId); // Scroll suave a elemento
```

## 🎯 Mejoras Futuras

1. **Base de Datos**: Integrar con una API para artículos dinámicos
2. **Sistema de Comentarios**: Guardar comentarios en servidor
3. **Búsqueda**: Agregar funcionalidad de búsqueda
4. **Categorías Dinámicas**: Cargar categorías desde API
5. **Sistema de Autenticación**: Para editar artículos
6. **Dark Mode**: Tema oscuro para el blog
7. **Analytics**: Rastrear visualizaciones
8. **Social Share**: Botones para compartir en redes

## 🚀 Implementación Local

1. Copia la carpeta `blog/` a tu proyecto SIUM
2. Actualiza los archivos `.sium` con tu contenido
3. Personaliza colores y estilos según tu marca
4. Sirve con `serve` en la carpeta raíz
5. Accede a `http://localhost:3000`

## 📄 Notas de Desarrollo

- Los artículos están hardcodeados (reemplaza con API en producción)
- Los comentarios se guardan en RAM (usa localStorage o API)
- Las imágenes usan emojis (reemplaza con URLs en producción)
- Los formularios no envían a servidor (agrega backend si es necesario)

## 👨‍💻 Autor

Juan Pérez - Desarrollador Web Full Stack

## 📝 Licencia

MIT License - Siéntete libre de usar este proyecto como base

---

**Hecho con 💙 usando SIUM Framework**
