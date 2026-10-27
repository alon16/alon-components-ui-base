# Instalación e integración

## Dependencias

La biblioteca debe declarar Vue como `peerDependency`. Para usar fecha, instala también el selector
que utilizan internamente los wrappers:

### Acceso a GitHub Packages

En la raíz de cada portal crea un archivo `.npmrc`. Para instalar un paquete privado, el token
clásico de GitHub necesita el permiso `read:packages` y la cuenta debe tener acceso al repositorio
o paquete. El `.npmrc` versionado solo configura el registro, nunca la credencial:

```ini
@alon16:registry=https://npm.pkg.github.com
```

Para una máquina Windows, crea el token clásico desde GitHub con solo `read:packages` y ejecuta:

```bash
npm login --scope=@alon16 --auth-type=legacy --registry=https://npm.pkg.github.com
```

Usa tu usuario de GitHub y pega el token únicamente cuando se solicite la contraseña. npm lo
guarda en el `.npmrc` de usuario, fuera del proyecto. Cada desarrollador usa su propio token; no se
comparte el de una persona mantenedora. En CI/CD, usa un token de solo lectura como secreto y crea
la credencial durante la ejecución, también fuera del directorio versionado.

```bash
pnpm add @alon16/components-ui-base @vuepic/vue-datepicker
```

## Orden de estilos

Importa los estilos de la biblioteca y después el tema del portal. El último importado puede
sobrescribir los tokens `--ui-*`.

```js
import "@alon16/components-ui-base/styles.css";
import "@vuepic/vue-datepicker/dist/main.css";
import "./theme.css";
```

No importes automáticamente un tema desde el paquete. Cada portal elige su tema; el
tema violeta solo es una referencia visual y de compatibilidad.

## Importación de componentes

Prefiere las exportaciones individuales para conservar el tree-shaking:

```js
import {
  BaseAutocomplete,
  BaseDateInput,
  BaseSelect,
} from "@alon16/components-ui-base";
```

Los componentes no deben registrarse globalmente salvo que el paquete publique un plugin y el
portal elija usarlo.

## Reglas de uso

- Usa `v-model` en los componentes que lo indiquen en la referencia.
- Pasa `id` cuando necesites una asociación estable con elementos externos; en caso contrario se
  genera uno accesible automáticamente, excepto donde la prop sea obligatoria.
- Mantén mensajes de validación en `error`, `success` o `help`; el componente determina el estado.
- Proporciona textos localizados mediante las props de texto y ARIA. Los valores por defecto son
  español.
- Los wrappers de fecha aceptan las opciones documentadas; no pases propiedades desconocidas del
  selector de terceros sin antes añadirlas a la API pública.
