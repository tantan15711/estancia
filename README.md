# Sistema de Gestión para Organizaciones Educativas

Sistema web desarrollado con React para la gestión de procesos administrativos y de planeación de la Universidad Politécnica de Tapachula.

## Descripción

Aplicación web que permite gestionar y generar reportes automatizados para procesos educativos, incluyendo:

- **Informe Trimestral** - Seguimiento de actividades trimestrales
- **Programa Anual de Trabajo (PAT)** - Planeación anual de actividades
- **Planeación Cuatrimestral** - Seguimiento de actividades por cuatrimestre

## Inicio Rápido

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm (viene incluido con Node.js)

### Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd Estancia
```

2. Instala las dependencias:
```bash
npm install
```

### Ejecutar en Desarrollo

Inicia el servidor de desarrollo:

```bash
npm start
```

La aplicación se abrirá automáticamente en [http://localhost:3000](http://localhost:3000)

- La página se recargará automáticamente cuando hagas cambios
- Verás los errores de lint en la consola

### Compilar para Producción

Crea una versión optimizada para producción:

```bash
npm run build
```

Esto generará una carpeta `build/` con los archivos optimizados listos para desplegar.

## Estructura del Proyecto

```
Estancia/
├── public/
│   ├── assets/
│   │   └── images/          # Imágenes estáticas (logos, etc.)
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── Login/       # Componente de autenticación
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── forms/           # Formularios del sistema
│   │   │   ├── InformeTrimestral/
│   │   │   ├── PATForm/
│   │   │   └── PlaneacionCuatri/
│   │   └── layout/          # Componentes de layout (header, sidebar)
│   ├── routes/              # Configuración de rutas
│   │   ├── AppRoutes.jsx
│   │   └── UniversityRoutes.jsx
│   ├── App.jsx              # Componente principal
│   ├── App.css
│   └── index.js             # Punto de entrada
├── package.json
└── README.md
```

## Componentes Principales

### Autenticación
- **Login** - Sistema de inicio de sesión con validación de credenciales

### Dashboard
- **Dashboard** - Vista principal con acceso a todos los módulos

### Formularios
- **InformeTrimestral** - Registro de actividades trimestrales
- **PATForm** - Programa Anual de Trabajo
- **PlaneacionCuatri** - Planeación cuatrimestral de actividades

### Layout
- **UniversityLayout** - Layout principal con navegación lateral y header

## Tecnologías Utilizadas

- **React** 19.1.1 - Biblioteca de JavaScript para interfaces de usuario
- **React Router DOM** 6.30.1 - Navegación y enrutamiento
- **React Scripts** 5.0.1 - Scripts y configuración de Create React App
- **Font Awesome** - Iconos
- **SASS** - Preprocesador CSS para estilos avanzados

## Convenciones de Código

### Estructura de Componentes
- Cada componente tiene su propia carpeta
- Los archivos JSX usan extensión `.jsx`
- Los estilos pueden ser `.css` o `.scss` según el componente

### Nomenclatura
- Componentes: PascalCase (ej. `Dashboard.jsx`)
- Archivos de estilo: kebab-case o PascalCase matching component
- Carpetas: PascalCase para componentes, camelCase para utilidades

### Rutas
- Rutas principales definidas en `AppRoutes.jsx`
- Rutas de la universidad en `UniversityRoutes.jsx`
- Uso de React Router para navegación SPA (Single Page Application)

## Autenticación

El sistema utiliza autenticación basada en localStorage:
- Las credenciales se validan en el componente Login
- El token se almacena en localStorage
- La sesión persiste entre recargas de página

## Estilos

El proyecto utiliza una combinación de:
- CSS vanilla para componentes simples
- SCSS para componentes con estilos más complejos
- Variables CSS para temas consistentes

## Scripts Disponibles

### `npm start`
Ejecuta la aplicación en modo desarrollo

### `npm test`
Ejecuta los tests (si están configurados)

### `npm run build`
Compila la aplicación para producción

### `npm run eject`
**Nota:** Esta es una operación irreversible. Expone la configuración de webpack.

## Despliegue

La aplicación puede desplegarse en cualquier servicio de hosting estático:

- **Vercel** - Despliegue automático desde Git
- **Netlify** - Despliegue con CI/CD
- **GitHub Pages** - Hosting gratuito
- **Firebase Hosting** - Hosting de Google

Para desplegar, primero ejecuta:
```bash
npm run build
```

Luego sigue las instrucciones específicas de tu plataforma de hosting.

## Solución de Problemas

### El build falla
```bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Errores de rutas de imágenes
- Asegúrate de que las imágenes estén en `public/assets/images/`
- Las rutas deben comenzar con `/assets/images/`

### Errores de importación
- Verifica que las rutas de importación sean correctas
- Los componentes deben importarse desde sus nuevas ubicaciones en `src/components/`

## Recursos Adicionales

- [Documentación de React](https://reactjs.org/)
- [Documentación de React Router](https://reactrouter.com/)
- [Create React App](https://create-react-app.dev/)

## Contribución

Para contribuir al proyecto:

1. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios y haz commit: `git commit -m 'Agrega nueva funcionalidad'`
3. Push a la rama: `git push origin feature/nueva-funcionalidad`
4. Abre un Pull Request

## Licencia

Este proyecto es privado y pertenece a la Universidad Politécnica de Tapachula.

---

**Desarrollado para la Universidad Politécnica de Tapachula** 🎓
