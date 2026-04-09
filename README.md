# ASERFINTEC Web

Sitio web corporativo de ASERFINTEC.
Desarrollado en HTML, CSS y JavaScript.
Publicado con Vercel e integrado con GitHub.

## 🚀 Características

- Diseño responsivo para móviles, tablets y desktop
- Formulario de contacto funcional con validación
- Integración con EmailJS para envío de correos
- Seguimiento de eventos con Google Analytics

## 📧 Configuración de EmailJS

Para que el formulario de contacto funcione correctamente, necesitas configurar EmailJS:

### 1. Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Regístrate con tu cuenta gratuita
3. Verifica tu email

### 2. Configurar Email Service
1. En el dashboard, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Conecta tu cuenta de email (aserfintec@hotmail.com)
5. Guarda el Service ID

### 3. Crear Email Template
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Configura el template con los siguientes campos:
   - **To Email**: `{{to_email}}`
   - **From Name**: `{{from_name}}`
   - **From Email**: `{{from_email}}`
   - **Subject**: `Nueva solicitud de contacto: {{service}}`
   - **Message**:
     ```
     Nombre: {{from_name}}
     Correo: {{from_email}}
     Empresa: {{company}}
     Teléfono: {{phone}}
     Servicio de interés: {{service}}

     Mensaje:
     {{message}}
     ```
4. Guarda el Template ID

### 4. Obtener Public Key
1. Ve a "Account" → "General"
2. Copia tu Public Key

### 5. Actualizar el código
Edita el archivo `js/main.js` y reemplaza:
- `YOUR_PUBLIC_KEY` con tu Public Key
- `YOUR_SERVICE_ID` con tu Service ID
- `YOUR_TEMPLATE_ID` con tu Template ID
- `RECAPTCHA_SITE_KEY_AQUI` con tu reCAPTCHA v3 Site Key si deseas habilitar protección adicional

### 6. Configurar reCAPTCHA (opcional)
1. Ve a [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
2. Crea un nuevo sitio con reCAPTCHA v3
3. Copia la Site Key
4. Pega la Site Key en `js/main.js` reemplazando `RECAPTCHA_SITE_KEY_AQUI`

> Si no usas reCAPTCHA, deja `RECAPTCHA_SITE_KEY_AQUI` tal cual; el formulario seguirá funcionando con validación y honeypot.

## 🛠️ Desarrollo Local

1. Clona el repositorio
2. Abre `index.html` en tu navegador
3. Para desarrollo, puedes usar un servidor local:
   ```bash
   # Con Python
   python -m http.server 8000

   # Con Node.js
   npx serve .
   ```

## 📱 Diseño Responsivo

El sitio está optimizado para:
- Desktop: >1024px
- Tablets: 768px - 1024px
- Móviles: <768px

## 📊 Analytics

El sitio incluye seguimiento de eventos para:
- Envío de formularios de contacto
- Interacciones del usuario