// sium-runtime.js
// Runtime profesional de SIUM
// Totalmente genérico: parsea .sium, monta HTML, conecta funciones y eventos automáticamente

class TiempoEjecucionSium {
  constructor(appId='app') {
    this.app = document.getElementById(appId);
    this.funciones = {};     // Aquí se registran las funciones declaradas en cada .sium
    this.componentes = {};   // Componentes declarados en .sium
    window.addEventListener('hashchange', ()=>this.cargarRuta());
    this.cargarRuta();
  }

  async cargarComponentesGlobales() {
    // Carga todos los componentes de la carpeta /componentes/
    const componentes = ['navegacion', 'pie-pagina'];
    
    for (const comp of componentes) {
      try {
        const res = await fetch(`componentes/${comp}.sium`);
        if (res.ok) {
          const texto = await res.text();
          // Extraer el componente [componente nombre]...[/componente]
          const regex = /\[componente\s+([\w-]+)\]([\s\S]*?)\[\/componente\]/i;
          const match = texto.match(regex);
          if (match) {
            this.componentes[match[1]] = match[2].trim();
          }
        }
      } catch(e) {
        console.warn(`No se pudo cargar componente: ${comp}`);
      }
    }
  }

  async cargarRuta() {
    // Cargar componentes globales primero (si no están ya cargados)
    if (Object.keys(this.componentes).length === 0) {
      await this.cargarComponentesGlobales();
    }

    // Detecta la página según hash, por defecto carga inicio.sium
    let pagina = location.hash.replace('#','') || 'inicio';
    
    try {
      // Determina la ruta del archivo
      let rutaArchivo, rutaEstilo;
      
      // Si la página tiene /, intenta cargar de esa ruta directamente
      // Ejemplo: #tienda/zapatos → tienda/zapatos.sium
      // Ejemplo: #paginas/articulos → paginas/articulos.sium
      if (pagina.includes('/')) {
        rutaArchivo = `${pagina}.sium`;
        rutaEstilo = `${pagina}.estil`;
      } else {
        // Si no tiene /, es una página de raíz como #inicio
        rutaArchivo = `${pagina}.sium`;
        rutaEstilo = `${pagina}.estil`;
      }
      
      const res = await fetch(rutaArchivo);
      if (!res.ok) {
        throw new Error(`No se encontró la página: ${rutaArchivo}`);
      }
      const texto = await res.text();
      
      // Intenta cargar el archivo .estil asociado
      let css = '';
      try {
        const resEstil = await fetch(rutaEstilo);
        if (resEstil.ok) {
          css = await resEstil.text();
        }
      } catch(e) {
        // Si no existe el archivo .estil, simplemente continúa sin él
      }
      
      this.parsearSium(texto, css);
    } catch(e) {
      this.app.innerHTML = `<p style="color: red; padding: 20px;">⚠️ ${e.message}</p>`;
    }
  }

  parsearSium(texto, css = '') {
    // Reset funciones y HTML de la página
    this.funciones = {};
    this.app.innerHTML = '';

    // Inyectar CSS si existe archivo .estil
    if (css) {
      let styleTag = document.getElementById('sium-style');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'sium-style';
        document.head.appendChild(styleTag);
      }
      // Traducir CSS español a CSS estándar
      const cssTraducido = this.traducirCSS(css);
      styleTag.textContent = cssTraducido;
    }

    // Extraer componentes declarados [componente nombre]...[/componente]
    // Permite nombres con guiones
    const componenteRegex = /\[componente\s+([\w-]+)\]([\s\S]*?)\[\/componente\]/gi;
    let match;
    while((match = componenteRegex.exec(texto)) !== null) {
      const nombre = match[1];
      const cuerpo = match[2].trim();
      this.componentes[nombre] = cuerpo;
    }

    // Extraer funciones [funcion nombre()]...[/funcion]
    const funcionRegex = /\[funcion\s+(\w+)\(\)\]([\s\S]*?)\[\/funcion\]/gi;
    while((match = funcionRegex.exec(texto)) !== null) {
      const nombre = match[1];
      const cuerpo = match[2].trim();
      this.registrarFuncion(nombre, cuerpo);
    }

    // Eliminar bloques de componente y función del HTML
    // IMPORTANTE: Usar versiones nuevas del regex sin la flag global modificada
    let htmlLimpio = texto
      .replace(/\[componente\s+([\w-]+)\]([\s\S]*?)\[\/componente\]/gi, '')
      .replace(/\[funcion\s+(\w+)\(\)\]([\s\S]*?)\[\/funcion\]/gi, '')
      .trim();

    // Procesar componentes Y LUEGO traducir sintaxis
    const htmlConComponentes = this.procesarComponentes(htmlLimpio);
    const htmlFinal = this.traducirSintaxis(htmlConComponentes);
    
    this.app.innerHTML = htmlFinal;

    // Conectar eventos declarativos como cuando_clic
    this.conectarEventos();
  }

  registrarFuncion(nombre, cuerpo) {
    // Evalúa la función dentro del runtime para poder llamarla desde eventos
    // NOTA: para producción deberías usar un parser seguro, aquí es simplificado
    this.funciones[nombre] = () => {
      const lines = cuerpo.split('\n').map(l=>l.trim()).filter(l=>l);
      lines.forEach(line=>{
        // Variables: variable x = valor
        let varMatch = line.match(/^variable\s+(\w+)\s*=\s*(.*)$/i);
        if(varMatch){
          window[varMatch[1]] = this.evaluarValor(varMatch[2]);
          return;
        }

        // If simple: [si cond] ... [/si]
        let ifMatch = line.match(/^\[si\s+(.+)\]/i);
        if(ifMatch){
          // eval cond en contexto global (simplificado)
          const cond = this.traducirExpresion(ifMatch[1]);
          window._si_cond = eval(cond);
          return;
        }

        if(line.match(/^\[sino\]/i)){
          window._si_cond = !window._si_cond;
          return;
        }

        if(line.match(/^\[\/si\]/i)){
          window._si_cond = undefined;
          return;
        }

        // redirigir("#home")
        let redir = line.match(/^redirigir\("([^"]+)"\)/i);
        if(redir){
          location.hash = redir[1];
          return;
        }

        // Acceso a elementos por identificador y propiedad texto
        let elemMatch = line.match(/^#(\w+)\.texto\s*=\s*"([^"]+)"/i);
        if(elemMatch){
          const el = document.getElementById(elemMatch[1]);
          if(el) el.textContent = elemMatch[2];
          return;
        }

        // mostrar mensajes simples
        let mostrarMatch = line.match(/^mostrar\s+"([^"]+)"/i);
        if(mostrarMatch){
          alert(mostrarMatch[1]);
          return;
        }
      });
    }
  }

  evaluarValor(valor) {
    // Simplificado: strings y números
    valor = valor.trim();
    if(valor.startsWith('"') && valor.endsWith('"')) return valor.slice(1,-1);
    if(!isNaN(Number(valor))) return Number(valor);
    // referencias globales
    if(window[valor]!==undefined) return window[valor];
    return valor;
  }

  traducirExpresion(exp) {
    // traducciones básicas: y -> &&, o -> ||
    return exp.replace(/\by\b/gi,'&&').replace(/\bo\b/gi,'||');
  }

  procesarComponentes(html) {
    // Reemplaza <nombre_componente ...> con el HTML del componente
    let result = html;
    Object.keys(this.componentes).forEach(nombre=>{
      // Regex que acepta nombres con guiones y subrayos
      const regex = new RegExp(`<${nombre.replace(/[-]/g, '\\-')}(\\s+[^>]*)?>([\\s\\S]*?)<\\/${nombre}>`, 'gi');
      result = result.replace(regex,(match, attrs, contenido)=>{
        let compHTML = this.componentes[nombre];
        
        // Reemplaza {{param}} si viene en attrs
        if(attrs){
          // Regex mejorado para capturar atributos CON ACENTOS y valores con espacios
          const paramRegex = /[\w\u00C0-\u00FF]+(?:-[\w\u00C0-\u00FF]+)*="([^"]*)"/g;
          let m;
          // Extraer atributos de forma más simple
          const attrsPairs = attrs.match(/[\w\u00C0-\u00FF]+(?:-[\w\u00C0-\u00FF]+)*="[^"]*"/g) || [];
          attrsPairs.forEach(pair => {
            const [key, ...valueParts] = pair.split('=');
            const val = valueParts.join('=').slice(1, -1); // Remove quotes
            compHTML = compHTML.replace(new RegExp(`{{${key}}}`, 'g'), val);
          });
        }
        
        // {{contenido}} reemplaza con contenido dentro del tag
        compHTML = compHTML.replace(/{{contenido}}/g, contenido || '');
        
        return compHTML;
      });
    });
    
    return result;
  }

  traducirCSS(css) {
    let result = css;
    
    // Mapa de traducción CSS español a inglés
    const mapeoCSS = {
      'color-fondo': 'background-color',
      'espaciado': 'padding',
      'espaciado-superior': 'padding-top',
      'espaciado-inferior': 'padding-bottom',
      'espaciado-izquierdo': 'padding-left',
      'espaciado-derecho': 'padding-right',
      'sombra': 'box-shadow',
      'ancho-máximo': 'max-width',
      'ancho-mínimo': 'min-width',
      'ancho': 'width',
      'altura': 'height',
      'margen': 'margin',
      'margen-superior': 'margin-top',
      'margen-inferior': 'margin-bottom',
      'margen-izquierdo': 'margin-left',
      'margen-derecho': 'margin-right',
      'exhibición': 'display',
      'justificar-contenido': 'justify-content',
      'alinear-elementos': 'align-items',
      'alinear-contenido': 'align-content',
      'grosor-fuente': 'font-weight',
      'tamaño-fuente': 'font-size',
      'sin-decoración': 'text-decoration',
      'alineación-texto': 'text-align',
      'color': 'color',
      'radio-esquina': 'border-radius',
      'radio-borde': 'border-radius',
      'borde': 'border',
      'borde-superior': 'border-top',
      'borde-inferior': 'border-bottom',
      'borde-izquierdo': 'border-left',
      'borde-derecho': 'border-right',
      'cursor': 'cursor',
      'transición': 'transition',
      'transformar': 'transform',
      'posición': 'position',
      'superior': 'top',
      'inferior': 'bottom',
      'izquierdo': 'left',
      'derecho': 'right',
      'z-índice': 'z-index',
      'opacidad': 'opacity',
      'estilo-lista': 'list-style',
      'altura-línea': 'line-height',
      'espacio-blanco': 'white-space',
      'cambio-tamaño-caja': 'box-sizing',
      'fondo': 'background',
      'visibilidad': 'visibility',
      'desbordamiento': 'overflow',
      'columnas-cuadrícula': 'grid-template-columns',
      'filas-cuadrícula': 'grid-template-rows',
      'espacio': 'gap',
      'al-pasar': 'hover',
      'pegajoso': 'sticky',
      'contenido-ajustado': 'fit-content',
      'espacio-entre': 'space-between',
      'espacio-alrededor': 'space-around',
      'espacio-distribuido': 'space-evenly',
      'inicio-flex': 'flex-start',
      'fin-flex': 'flex-end',
      'centro': 'center',
      'cuadrícula': 'grid',
      'bloque': 'block',
      'ninguno': 'none',
      'ninguna': 'none',
      'puntero': 'pointer',
      'blanco': 'white',
      'negro': 'black',
      'negrita': 'bold',
      'cursiva': 'italic',
      'subrayar': 'underline',
      'sólido': 'solid',
      'punteado': 'dotted',
      'discontinuo': 'dashed',
      'gradiente-lineal': 'linear-gradient',
      'gradiente-radial': 'radial-gradient',
      'grados': 'deg',
      'trasladarY': 'translateY',
      'trasladarX': 'translateX',
      'rotar': 'rotate',
      'escalar': 'scale',
      'marcador': 'placeholder'
    };
    
    // Aplicar reemplazos
    Object.entries(mapeoCSS).forEach(([español, inglés]) => {
      // Reemplazar propiedades CSS
      result = result.replace(new RegExp(español + ':', 'g'), inglés + ':');
      // Reemplazar pseudo-clases y valores
      result = result.replace(new RegExp(':' + español, 'g'), ':' + inglés);
      result = result.replace(new RegExp('\\(' + español, 'g'), '(' + inglés);
      result = result.replace(new RegExp(' ' + español, 'g'), ' ' + inglés);
      result = result.replace(new RegExp(',' + español, 'g'), ',' + inglés);
      result = result.replace(new RegExp('^' + español, 'g'), inglés);
    });
    
    return result;
  }

  traducirSintaxis(html) {
    let result = html;
    
    // Reemplazar estilo= por style=
    result = result.replace(/\bestilo=/gi, 'style=');
    
    // Reemplazar clase= por class=
    result = result.replace(/\bclase=/gi, 'class=');
    
    // Reemplazar marcador= por placeholder=
    result = result.replace(/\bmarcador=/gi, 'placeholder=');
    
    // Reemplazar tipo= por type=
    result = result.replace(/\btipo=/gi, 'type=');
    
    // Títulos: <t1> a <t6> - preservar atributos
    for(let i = 1; i <= 6; i++) {
      result = result.replace(new RegExp(`<t${i}([^>]*)>`, 'gi'), `<h${i}$1>`);
      result = result.replace(new RegExp(`</t${i}>`, 'gi'), `</h${i}>`);
    }
    
    // Párrafos - preservar atributos
    result = result.replace(/<parrafo([^>]*)>/gi, '<p$1>');
    result = result.replace(/<\/parrafo>/gi, '</p>');
    
    // Artículos: <articulo> a <article>
    result = result.replace(/<articulo([^>]*)>/gi, '<article$1>');
    result = result.replace(/<\/articulo>/gi, '</article>');
    
    // Barra lateral: <barra-lateral> a <aside>
    result = result.replace(/<barra-lateral([^>]*)>/gi, '<aside$1>');
    result = result.replace(/<\/barra-lateral>/gi, '</aside>');
    
    // Pie de página: <pie-pagina> a <footer>
    result = result.replace(/<pie-pagina([^>]*)>/gi, '<footer$1>');
    result = result.replace(/<\/pie-pagina>/gi, '</footer>');
    
    // Botones - preservar atributos
    result = result.replace(/<boton([^>]*)>/gi, '<button$1>');
    result = result.replace(/<\/boton>/gi, '</button>');
    
    // Contenedor con clase: <contenedor clase="miclase">
    result = result.replace(/<contenedor\s+clase="([^"]*)"([^>]*)>/gi, '<div class="$1"$2>');
    result = result.replace(/<\/contenedor>/gi, '</div>');
    
    // Contenedor sin clase: <contenedor ...> o <div_contenedor>
    result = result.replace(/<contenedor([^>]*)>/gi, '<div$1>');
    result = result.replace(/<div_contenedor([^>]*)>/gi, '<div$1>');
    result = result.replace(/<\/div_contenedor>/gi, '</div>');
    
    // Enlaces: <enlace href="url" texto="texto"> -> <a href="url">texto</a>
    result = result.replace(/<enlace\s+href="([^"]*)"\s+texto="([^"]*)"([^>]*)>/gi, '<a href="$1"$3>$2</a>');
    
    // Entradas: <entrada tipo="texto" id="nombre">
    result = result.replace(/<entrada([^>]*)>/gi, '<input$1>');
    
    // Área de texto: <área-texto></área-texto>
    result = result.replace(/<área-texto([^>]*)>/gi, '<textarea$1>');
    result = result.replace(/<\/área-texto>/gi, '</textarea>');
    
    // Etiquetas: <etiqueta></etiqueta>
    result = result.replace(/<etiqueta([^>]*)>/gi, '<label$1>');
    result = result.replace(/<\/etiqueta>/gi, '</label>');
    
    return result;
  }

  conectarEventos() {
    // Conecta botones con cuando_clic
    this.app.querySelectorAll('[cuando_clic]').forEach(btn=>{
      const funcName = btn.getAttribute('cuando_clic').replace(/\(\)/,'');
      if(this.funciones[funcName]){
        btn.addEventListener('click', ()=>this.funciones[funcName]());
      }
    });
  }
}

// Inicializa runtime
window.sium = new TiempoEjecucionSium();
