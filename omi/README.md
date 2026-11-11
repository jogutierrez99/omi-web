This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Configuración del formulario de contacto

La ruta `/contacto` envía el formulario a `POST /api/contact`; el servidor valida los datos y usa Resend para entregar el mensaje a OMI. No se almacenan mensajes en una base de datos.

1. Crea una cuenta en [Resend](https://resend.com/) y genera una API key.
2. Verifica en Resend el dominio que utilizarás como remitente.
3. Copia `.env.example` como `.env.local` y completa `RESEND_API_KEY`, `CONTACT_EMAIL` y `CONTACT_FROM_EMAIL`.
4. Configura las mismas variables en Vercel para los entornos necesarios y vuelve a desplegar.
5. Envía una consulta de prueba y comprueba tanto el mensaje recibido por OMI como la confirmación enviada al usuario.

`CONTACT_EMAIL` es el buzón interno al que llegarán los mensajes. Para este proyecto debe configurarse localmente y en Vercel con el correo operativo facilitado por OMI; no se guarda ese dato en el repositorio. `CONTACT_FROM_EMAIL` debe usar un remitente de un dominio verificado en Resend. El formulario no podrá enviar mensajes hasta que las tres variables estén configuradas.

### Protección anti-spam opcional

La primera versión incluye un honeypot y un límite en memoria de 5 solicitudes por IP cada 10 minutos. Este límite es una protección *best-effort*: en Vercel cada instancia puede mantener un estado distinto y reiniciarlo al escalar. Si el volumen lo requiere, se recomienda sustituirlo por un almacén compartido como Upstash.

Cloudflare Turnstile puede añadirse después incorporando su widget al formulario y verificando el token exclusivamente en `/api/contact` antes de enviar el correo. Las claves deben mantenerse en variables de entorno (solo la clave pública puede exponerse al navegador) y la verificación del servidor debe fallar de forma segura.

## Sitemap e indexación

`npm run build` compila Next.js y genera `public/sitemap.xml` para ese despliegue. Vercel usa este script con la configuración predeterminada de Next.js. Si el proyecto tiene un Build Command personalizado, configúralo como `npm run build`. En local, el archivo se crea con el primer build.

Una página pública nueva bajo `src/app` entra automáticamente si responde con HTML y estado 200 a una petición sin autenticación. El generador comprueba la respuesta de producción local y excluye redirecciones, directivas `noindex` en metadatos o cabeceras y canónicas HTML que apuntan a otra URL. Si una página carece de canónica explícita, se usa su URL en `https://www.omioficial.com`. Las carpetas privadas de Next.js (`_`), los grupos y segmentos de administración, autenticación y privacidad (por ejemplo, `(admin)`, `(auth)` y `(private)`) y los segmentos `api` quedan fuera. Para una página interna que responde 200 en otra ruta, declara `robots: { index: false }` en su metadata o en el layout que la contiene.

Los segmentos dinámicos como `[slug]` requieren una fuente de datos que enumere las URLs públicas reales. Actualmente no existen rutas de ese tipo. Si se añaden, comparte la consulta de registros publicados entre la ruta y el generador del sitemap. El archivo se regenera en cada build. Si en el futuro el contenido cambia entre despliegues, la generación de esas entradas deberá seguir la política de revalidación de la fuente.

Tras desplegar, comprueba que [sitemap.xml](https://www.omioficial.com/sitemap.xml) devuelva XML con las páginas públicas actuales y que [robots.txt](https://www.omioficial.com/robots.txt) responda con `Allow: /` y `Sitemap: https://www.omioficial.com/sitemap.xml`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
