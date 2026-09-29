# Guía Paso a Paso: Integración de Resend para Belcalis Nails ✨

> **Objetivo:** Enviar emails automatizados de bienvenida y credenciales de clientas VIP con la identidad oficial de **Belcalis Nails** desde la dirección `privilege@belcalisnails.com.ar`, utilizando el plan gratuito de **Resend** (3.000 emails/mes sin costo) y sin necesidad de pagar ni administrar casillas de correo tradicionales.

---

## 📌 ¿Por qué Resend?
1. **Estatus High-End:** A la clienta le llega un correo desde `Belcalis Nails <privilege@belcalisnails.com.ar>`, directo a su bandeja principal (no spam).
2. **Cero Mantenimiento:** No hay que pagar Google Workspace ($6 USD/mes), ni limpiar bandejas de entrada, ni lidiar con límites de hosting.
3. **Integración Nativa:** El backend de la plataforma ya está 100% programado para detectar tu clave de Resend y despachar el diseño Haute Couture de bienvenida al instante.

---

## 🛠️ Pasos para realizar la conexión (Tiempo estimado: 5 a 10 minutos)

### Paso 1: Crear la cuenta en Resend
1. Ingresá a [resend.com](https://resend.com).
2. Hacé click en **"Get Started"** o **"Sign Up"** (podés ingresar directamente con tu cuenta de Google o con email).

---

### Paso 2: Dar de alta el Dominio
1. En el menú lateral izquierdo de Resend, hacé click en **Domains**.
2. Hacé click en el botón **"Add Domain"**.
3. En el campo de dominio, escribí:
   ```text
   belcalisnails.com.ar
   ```
4. Seleccioná la región por defecto (ej. *South America - São Paulo* o *US East - N. Virginia*) y hacé click en **"Add"**.

---

### Paso 3: Copiar los registros DNS a DonWeb
Resend te mostrará una pantalla con **2 o 3 registros DNS** (generalmente registros de tipo `TXT` y `MX`) para certificar que el dominio te pertenece.

1. Abrí tu panel de **DonWeb** en otra pestaña.
2. Dirigite a **Mis Servicios** > **Dominios** > Seleccioná `belcalisnails.com.ar`.
3. Entrá a la sección **Administrar DNS** / **Zona DNS**.
4. Creá los registros tal cual te los indica Resend:
   - **Registro DKIM (TXT):**
     - Nombre / Host: `resend._domainkey` (o el subdominio que te dé Resend).
     - Valor / Destino: El texto largo que te brinda Resend (clave pública).
   - **Registro SPF (TXT):**
     - Nombre / Host: `@` (o `belcalisnails.com.ar`).
     - Valor / Destino: `v=spf1 include:amazonses.com ~all` (o el valor exacto que figure en pantalla).
   - **Registro de Retorno (MX) (Opcional según Resend):**
     - Si Resend te pide un MX de bounce: host `bounces` y destino `feedback-smtp...` con prioridad `10`.
5. Guardá los cambios en DonWeb.
6. Volvé a Resend y presioná el botón **"Verify Domain"**.
   *(Suele activarse en 1 a 5 minutos mostrando el tilde verde `Verified`).*

---

### Paso 4: Generar la API Key de Resend
1. En el menú izquierdo de Resend, hacé click en **API Keys**.
2. Hacé click en **"Create API Key"**.
3. Poné de nombre: `Belcalis Nails Producción`.
4. Permisos: Seleccioná **Full Access** o **Sending Access** con tu dominio `belcalisnails.com.ar`.
5. Hacé click en **"Add"** y **copiá la clave** que empieza con:
   ```text
   re_123456789...
   ```
   *(Guardala bien porque solo se muestra una vez).*

---

### Paso 5: Cargar la clave en Vercel
1. Ingresá a tu cuenta de [vercel.com](https://vercel.com).
2. Entrá a tu proyecto **Nail Studio** (o el que está vinculado a `belcalisnails.com.ar`).
3. Andá a la pestaña superior **Settings** > Menú lateral **Environment Variables**.
4. Agregá la siguiente variable:
   - **Key:** `RESEND_API_KEY`
   - **Value:** `re_...` *(la clave que copiaste en el Paso 4)*
   - Marcar entornos: **Production**, **Preview**, **Development**
5. *(Opcional)* Podés agregar también:
   - **Key:** `RESEND_FROM`
   - **Value:** `"Belcalis Nails" <privilege@belcalisnails.com.ar>`
6. Hacé click en **Save**.
7. Andá a la pestaña **Deployments**, hacé click en los 3 puntitos del último despliegue y seleccioná **Redeploy** (para que Vercel tome las nuevas variables).

---

## 🧪 Paso 6: Prueba en vivo desde el Backoffice

Una vez completado el paso 5:
1. Ingresá a: [https://www.belcalisnails.com.ar/backoffice](https://www.belcalisnails.com.ar/backoffice).
2. Si te pide login de staff, ingresá con tu usuario y contraseña de encargada.
3. Andá al módulo **Clientas & CRM**.
4. Hacé click en **`＋ Alta de Clienta VIP`**.
5. Completá con un nombre de prueba y tu email personal para recibir el test.
6. Verificá que la contraseña generada se muestre correctamente.
7. Presioná **"Dar de Alta & Enviar Bienvenida"**.
8. **¡Listo!** Abrí tu casilla de correo: recibirás el email con diseño Haute Couture, remitente `Belcalis Nails <privilege@belcalisnails.com.ar>`, 200 puntos acreditados y credenciales de acceso.
