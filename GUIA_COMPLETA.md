# 📖 Guía Completa: Blog Personal con SIUM

## 1️⃣ Estructura Base Explicada

### Por qué esta estructura

```
blog/
├── paginas/        ← Cada página es un archivo .sium separado
├── componentes/    ← Código reutilizable en múltiples páginas
├── utilidades/     ← Funciones JavaScript compartidas
├── index.html      ← Archivo HTML principal
└── README.md       ← Documentación
```

**Ventajas:**

- 🔄 DRY (Don't Repeat Yourself) - Componentes reutilizables
- 📦 Modular - Fácil de mantener y escalar
- 🎯 Específico - Cada carpeta tiene un propósito claro
- 🚀 Escalable - Agrega páginas sin modificar las existentes

---

## 2️⃣ Anatomía de una Página SIUM

### Estructura típica de inicio.sium

```sium
[componente navegacion]
<!-- Código de navegación reutilizable -->
[/componente]

<contenedor estilo="max-width: 1200px; margin: 0 auto;">
  <!-- Contenido específico de la página -->
</contenedor>

[componente pie-pagina]
<!-- Código de footer reutilizable -->
[/componente]
```

**Flujo:**

1. Carga componente de navegación
2. Muestra contenido específico
3. Carga componente de pie de página

---

## 3️⃣ Componentes Reutilizables

### Ejemplo: navegacion.sium

```sium
[componente navegacion]
<nav estilo="background-color: #2c3e50; padding: 15px 0;">
  <contenedor estilo="max-width: 1200px; margin: 0 auto;">
    <t1 estilo="color: #ecf0f1;">Mi Blog</t1>
    <div estilo="display: flex; gap: 20px;">
      <enlace href="#inicio" texto="Inicio">
      <enlace href="#articulos" texto="Artículos">
      <enlace href="#contacto" texto="Contacto">
    </div>
  </contenedor>
</nav>
[/componente]
```

**Por qué funciona:**

- Se define una sola vez en `navegacion.sium`
- Se usa en TODAS las páginas
- Si cambias el diseño, cambia en todas partes automáticamente

---

## 4️⃣ Sistema de Funciones

### Funciones declarativas

```sium
[funcion validarLogin()]
variable usuario = document.getElementById("usuario").value
variable contrasena = document.getElementById("contraseña").value

[si usuario && contrasena]
  mostrar "Login correcto"
  guardarEnLocal("usuario", usuario)
  redirigir("#inicio")
[sino]
  mostrar "Datos incompletos"
[/sino]
[/funcion]
```

### Flujo de ejecución:

1. Lee valores de inputs
2. Valida condiciones
3. Ejecuta acciones
4. Redirige si es necesario

---

## 5️⃣ Enrutamiento (Router)

### Cómo funciona el hash routing

```
URL: http://localhost/#inicio
     ↓
sium-runtime.js lee el hash
     ↓
Busca archivo inicio.sium
     ↓
Carga y parsea el archivo
     ↓
Muestra contenido en #app
```

### Rutas disponibles en el blog:

| URL                 | Archivo                         | Descripción          |
| ------------------- | ------------------------------- | -------------------- |
| `#inicio`           | `paginas/inicio.sium`           | Página principal     |
| `#articulos`        | `paginas/articulos.sium`        | Listado de artículos |
| `#articulo-detalle` | `paginas/articulo-detalle.sium` | Detalle completo     |
| `#sobre-mi`         | `paginas/sobre-mi.sium`         | Perfil del autor     |
| `#contacto`         | `paginas/contacto.sium`         | Formulario contacto  |

---

## 6️⃣ Grid y Layout Responsivo

### Grid básico (3 columnas)

```sium
<div estilo="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
  <div>Columna 1</div>
  <div>Columna 2</div>
  <div>Columna 3</div>
</div>
```

### Grid responsivo (auto-fit)

```sium
<div estilo="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
  <article>Artículo 1</article>
  <article>Artículo 2</article>
  <article>Artículo 3</article>
</div>
```

**Cómo funciona:**

- En desktop: 4 columnas de 300px mín.
- En tablet: 2-3 columnas
- En móvil: 1 columna automáticamente

### Flexbox para navegación

```sium
<div estilo="display: flex; justify-content: space-between; align-items: center;">
  <logo>Logo</logo>
  <menu estilo="display: flex; gap: 20px;">
    <enlace>Inicio</enlace>
    <enlace>Blog</enlace>
  </menu>
</div>
```

---

## 7️⃣ Formularios y Validación

### Estructura básica

```sium
<parrafo>
  <etiqueta para="email">Email:</etiqueta>
  <entrada tipo="email" id="email" marcador="tu@email.com">
</parrafo>

<boton cuando_clic="enviarFormulario()">Enviar</boton>

[funcion enviarFormulario()]
variable email = document.getElementById("email").value
[si email.includes("@")]
  mostrar "Email válido"
[sino]
  mostrar "Email inválido"
[/sino]
[/funcion]
```

### Validación avanzada

```sium
[funcion validarContacto()]
variable nombre = document.getElementById("nombre").value
variable email = document.getElementById("email").value
variable mensaje = document.getElementById("mensaje").value

[si !nombre || !email || !mensaje]
  mostrar "Todos los campos son requeridos"
[sino si !email.includes("@")]
  mostrar "Email inválido"
[sino]
  mostrar "Mensaje enviado"
  guardarEnLocal("ultimoContacto", {nombre, email, mensaje})
[/sino]
[/funcion]
```

---

## 8️⃣ Almacenamiento de Datos

### localStorage en SIUM

```sium
[funcion guardarDatos()]
variable usuario = "Juan"
variable edad = 25

guardarEnLocal("usuario", usuario)
guardarEnLocal("perfil", {usuario, edad})

mostrar "Datos guardados"
[/funcion]

[funcion obtenerDatos()]
variable usuario = obtenerDelLocal("usuario")
variable perfil = obtenerDelLocal("perfil")

mostrar usuario
mostrar perfil.edad
[/funcion]
```

---

## 9️⃣ Estilos y Paleta de Colores

### Colores del Blog

```css
Primario:       #667eea  (Azul)
Oscuro:         #2c3e50  (Gris oscuro)
Claro:          #ecf0f1  (Gris claro)
Éxito:          #27ae60  (Verde)
Error:          #e74c3c  (Rojo)
Warning:        #f39c12  (Naranja)
Info:           #3498db  (Azul claro)
```

### Aplicar en elementos

```sium
<!-- Botón primario -->
<boton estilo="background-color: #667eea; color: white;">
  Botón
</boton>

<!-- Texto de error -->
<parrafo estilo="color: #e74c3c;">
  Mensaje de error
</parrafo>

<!-- Fondo de éxito -->
<div estilo="background-color: #d5f4e6; color: #27ae60;">
  Mensaje de éxito
</div>
```

---

## 🔟 Mejores Prácticas

### ✅ Haz esto:

- Crea componentes reutilizables
- Mantén un archivo CSS/JS separado para estilos
- Usa nombres descriptivos
- Documenta funciones complejas
- Organiza archivos por tipo (páginas, componentes, etc.)

### ❌ No hagas esto:

- No repitas código en múltiples páginas
- No mezcles lógica con presentación
- No uses nombres genéricos (div, contenedor, etc.)
- No ignores la responsividad
- No olvides validar formularios

---

## 📚 Ejemplos Prácticos

### Crear una página nueva

1. **Crea el archivo** `blog/paginas/servicios.sium`

```sium
[componente navegacion]
<nav>...</nav>
[/componente]

<contenedor>
  <t1>Mis Servicios</t1>
  <parrafo>Aquí van mis servicios...</parrafo>
</contenedor>

[componente pie-pagina]
<footer>...</footer>
[/componente]
```

2. **Actualiza navegación** en `blog/componentes/navegacion.sium`

```sium
<enlace href="#servicios" texto="Servicios">
```

3. **Accede a la página** en `http://localhost/#servicios`

### Crear un componente personalizado

1. **Crea** `blog/componentes/tarjeta-servicio.sium`

```sium
[componente tarjeta-servicio]
<div estilo="border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
  <t3>Servicio</t3>
  <parrafo>Descripción del servicio</parrafo>
  <boton cuando_clic="verDetalle()">Ver más</boton>
</div>
[/componente]
```

2. **Úsalo en cualquier página**

```sium
[componente tarjeta-servicio]
[/componente]
[componente tarjeta-servicio]
[/componente]
```

---

## 🎓 Conclusión

Con SIUM puedes crear blogs y aplicaciones web modernas sin necesidad de:

- ❌ React, Vue, Angular
- ❌ Build tools complejos
- ❌ Configuraciones largas

Todo lo que necesitas está en las carpetas `paginas/`, `componentes/` y `utilidades/`.

**¡Happy coding! 🚀**
