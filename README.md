<<<<<<< HEAD
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
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> fd05dfcffb682b127e57bf03123a5abd8d5b1f0f
