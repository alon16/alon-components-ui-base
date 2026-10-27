# UI Components

Biblioteca privada de componentes Vue 3. Los componentes no contienen
colores propios: su apariencia se define mediante un tema CSS del proyecto consumidor.

El paquete incluye declaraciones TypeScript para autocompletado y validación de props, modelos y
eventos. Los proyectos JavaScript pueden consumirlo sin configuración adicional.

## Contenido

- Componentes de interfaz, formularios, selección, firma y fecha.
- Contrato de tokens CSS `--ui-*` y tema violeta de referencia.
- Soporte de accesibilidad, teclado y textos internos configurables.
- `BaseDropdownMenu` y la directiva reutilizable `v-tooltip`.

## Inicio rápido

> **Importante:** importa siempre `@alon16/components-ui-base/styles.css`. Registrar o importar un
> componente no carga sus estilos automáticamente; sin esta hoja, los controles usarán la
> apariencia nativa del navegador. Carga primero los estilos de la biblioteca y después el tema
> del portal para que este pueda definir los tokens `--ui-*`.

```bash
pnpm add @alon16/components-ui-base
```

Antes de instalar desde GitHub Packages, el portal debe configurar el scope y un token con permiso
`read:packages`; consulta la [guía de instalación](docs/installation.md).

```js
import { createApp } from "vue";
import "@alon16/components-ui-base/styles.css";
import "./theme.css";
import App from "./App.vue";

createApp(App).mount("#app");
```

```vue
<script setup>
import { BaseButton, BaseInput } from "@alon16/components-ui-base";
import { ref } from "vue";

const email = ref("");
</script>

<template>
  <BaseInput v-model="email" label="Correo electrónico" type="email" />
  <BaseButton type="submit">Continuar</BaseButton>
</template>
```

El archivo `theme.css` es obligatorio: aporta los colores y estados que la biblioteca consume.

`BaseDropdownMenu` registra internamente `v-tooltip`. Si necesitas usar la directiva en otros
elementos, expórtala y regístrala de forma explícita:

```js
import { tooltip } from "@alon16/components-ui-base";

app.directive("tooltip", tooltip);
```

## Equipo, permisos y acceso

No todas las personas necesitan publicar el paquete:

- **Mantenedores de la librería:** necesitan acceso de escritura al repositorio y un token clásico
  de GitHub con `write:packages`. Son quienes validan, versionan y ejecutan la publicación.
- **Personas que consumen la librería:** necesitan acceso de lectura al repositorio o paquete y un
  token clásico con `read:packages`. No necesitan permisos de publicación.

Cada portal consumidor debe versionar un archivo `.npmrc` con el registro del scope. Nunca se debe
guardar un token en ese archivo ni en el repositorio:

```ini
@alon16:registry=https://npm.pkg.github.com
```

Antes de instalar, cada desarrollador del portal debe tener acceso de lectura al paquete, crear un
token clásico de GitHub con `read:packages` y autenticarse en su propia máquina:

```bash
npm login --scope=@alon16 --auth-type=legacy --registry=https://npm.pkg.github.com
```

npm guarda la credencial en el `.npmrc` de usuario, fuera del repositorio. Los pipelines usan un
token de solo lectura como secreto y configuran la credencial durante su ejecución. No necesitan
`write:packages` ni acceso de publicación.

Consulta [Instalación e integración](docs/installation.md) para el detalle de acceso y
[Publicación y versiones](docs/publishing.md) para el proceso de una persona mantenedora.

## Documentación

- [Instalación e integración](docs/installation.md)
- [Tema y tokens CSS](docs/theming.md)
- [Referencia de componentes](docs/components.md)
- [Publicación y versiones](docs/publishing.md)

## Playground de desarrollo

La aplicación de prueba importa directamente los componentes desde `src/index.ts`, recarga los
cambios en caliente y permite alternar entre los temas violeta y oscuro. Incluye ejemplos de las
variantes, estados e interacciones principales de la biblioteca.

```bash
pnpm dev
```

Vite mostrará la URL local en la terminal. El playground vive en `playground/` y no forma parte de
los archivos publicados en el paquete. Para comprobar sus tipos de manera independiente:

```bash
pnpm check:playground-types
```

## Compatibilidad

- Vue `^3.5` como dependencia de par.
- Los componentes de fecha requieren además `@vuepic/vue-datepicker` y su hoja de estilos.
- Los textos predeterminados están en español y se pueden sobrescribir mediante props cuando el
  componente los incluye.
