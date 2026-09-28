# Control de Muestreo — Planta Revemin PIM II

Aplicación de Aseguramiento de la Calidad QA/QC: muestreo en patio, alimentación,
proceso de planta y carbón activado. Funciona en computadora y en el teléfono,
guarda en Firebase y se instala como aplicación.

---

## 1. Crear el proyecto de Firebase

1. Entre a **console.firebase.google.com** e inicie sesión.
2. **Agregar proyecto** → nombre: `muestreo-revemin` → continuar → puede
   desactivar Google Analytics → **Crear proyecto**.
3. En el menú de la izquierda: **Compilación → Firestore Database → Crear base de datos**.
   - Ubicación: `nam5` o la que le sugiera.
   - Empiece en **modo de prueba**.
4. Vaya a **Reglas** y deje exactamente esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /muestreo/{documento} {
      allow read, write: if true;
    }
  }
}
```

   Publique los cambios. Con esta regla, cualquiera que tenga el enlace puede ver
   y cargar datos: es lo que usted escogió. Si más adelante quiere clave de acceso,
   se cambia aquí.

## 2. Copiar la configuración

1. Rueda dentada arriba a la izquierda → **Configuración del proyecto**.
2. Baje hasta **Tus apps** → icono `</>` (web) → nombre `muestreo` → **Registrar app**.
3. Firebase le muestra un bloque `firebaseConfig`. Copie esos seis valores.
4. Abra el archivo **firebase-config.js** y reemplace cada `COLOQUE_...` por el
   valor que le corresponde. Guarde.

Mientras no haga este paso, la aplicación funciona igual pero guarda solo en el
equipo donde la abra.

## 3. Publicar en GitHub

1. En **github.com** → **New repository** → nombre: `muestreo-revemin` →
   marque **Public** → **Create repository**.
2. En el repositorio: **Add file → Upload files** y arrastre TODOS los archivos
   de esta carpeta (index.html, firebase-config.js, manifest.json, sw.js,
   icon-192.png, icon-512.png, README.md) → **Commit changes**.
3. **Settings → Pages** → en *Source* elija **Deploy from a branch**,
   rama `main`, carpeta `/ (root)` → **Save**.
4. A los dos minutos queda publicada en:
   `https://SU-USUARIO.github.io/muestreo-revemin/`

## 4. Instalar en el teléfono

1. Abra ese enlace en Chrome.
2. Menú de tres puntos → **Instalar aplicación** (o *Agregar a la pantalla de inicio*).
3. Queda con su ícono, se abre a pantalla completa y funciona sin señal:
   lo que cargue sin internet se sincroniza solo al reconectar.

En iPhone: Safari → botón compartir → *Agregar a pantalla de inicio*.

## 5. Actualizar la aplicación

Cuando haya una versión nueva de `index.html`, súbala al repositorio con
**Add file → Upload files** (reemplaza la anterior) y suba el número de versión
en la primera línea de `sw.js` (`muestreo-revemin-v1` → `v2`), para que los
teléfonos tomen el cambio.

---

## Dónde quedan los datos

Cada módulo se guarda como un documento dentro de la colección `muestreo`:

| Documento | Contenido |
|---|---|
| `revemin_patio_mina_colombia` y uno por cada procedencia | pilas de patio |
| `revemin_proceso` | muestras puntuales de proceso |
| `revemin_carbon` | órdenes de carbón activado |
| `revemin_alimentacion` | muestreo de alimentación |

La primera vez que abra la aplicación con Firebase ya configurado, lo que tenga
guardado en ese equipo se sube solo a la nube.
