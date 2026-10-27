# Publicación y versiones

Este paquete se publica de forma privada en GitHub Packages bajo el scope
`@alon16`. El campo `private` del manifiesto debe permanecer en `false`: la visibilidad se
controla en GitHub Packages y mediante los permisos del repositorio.

## Requisitos

- Node.js `^20.19.0 || >=22.12.0`.
- Una cuenta de GitHub con acceso de escritura al repositorio.
- Un personal access token (classic) con `write:packages` para publicar localmente.

## Roles del equipo

- **Mantenedor/a que publica:** puede crear versiones. Necesita acceso de escritura al repositorio
  y un token clásico con `write:packages`.
- **Desarrollador/a consumidor/a:** instala la librería en un portal. No publica versiones; usa un
  token propio con `read:packages` y acceso de lectura al repositorio o paquete.
- **CI/CD:** usa un secreto técnico con los permisos mínimos necesarios. Nunca reutilices ni
  compartas el token personal de una persona.

## Primera configuración de una persona mantenedora

### Crear el token de publicación

1. En GitHub, abre el menú de tu perfil y entra a **Settings**.
2. Abre **Developer settings** → **Personal access tokens** → **Tokens (classic)**.
3. Selecciona **Generate new token (classic)** y confirma tu contraseña o segundo factor si se
   solicita.
4. Asigna un nombre identificable, por ejemplo `components-ui-base publicación local`, y una
   expiración razonable, como 90 días.
5. Marca únicamente el scope `write:packages`. No marques `delete:packages`. El acceso al
   repositorio se asigna a la cuenta de GitHub; no debe guardarse en código ni compartirse.
6. Genera el token y guárdalo en un gestor de contraseñas. GitHub solo lo muestra una vez: si se
   pierde, revócalo y crea uno nuevo.

No escribas el token en `package.json`, `.env`, el `.npmrc` del repositorio, documentación, chat o
capturas de pantalla.

### Iniciar sesión en la máquina local

Desde una terminal en tu equipo, ejecuta:

```bash
npm login --scope=@alon16 --auth-type=legacy --registry=https://npm.pkg.github.com
```

Usa tu usuario de GitHub como nombre de usuario y el token como contraseña. npm guarda esa sesión
en la configuración de usuario de la máquina (normalmente `%USERPROFILE%/.npmrc` en Windows), no
en este repositorio. Comprueba el acceso sin mostrar secretos:

```bash
pnpm whoami --registry=https://npm.pkg.github.com
```

Si el token expira o una persona deja de mantener el paquete, revócalo en GitHub y repite este
proceso con un token nuevo.

## Flujo recomendado con Pull Request

Un Pull Request (PR) sirve para revisar y aprobar el código antes de que llegue a `main`. Un PR por
sí solo **no publica** el paquete: después de fusionarlo, una persona mantenedora publica desde la
versión exacta que quedó en `main`.

### 1. Preparar el cambio en una rama

Parte siempre de la versión más reciente de `main`:

```bash
git switch main
git pull origin main
git switch -c fix/nombre-del-cambio
```

Haz el cambio, actualiza `README.md` o `docs/` si afecta la API pública y decide la versión que
corresponde. Actualiza `version` en `package.json` dentro de esta misma rama; así el PR permite
revisar también el número que se publicará.

Ejemplo para una corrección compatible:

```json
"version": "0.1.1"
```

Ejecuta las validaciones antes de abrir el PR:

```bash
pnpm run format:check
pnpm run check:base-colors
pnpm run build
pnpm run check:consumer-types
pnpm pack --dry-run
```

### 2. Abrir y fusionar el PR en GitHub

Confirma y sube la rama:

```bash
git add .
git commit -m "fix: describir el cambio"
git push -u origin fix/nombre-del-cambio
```

En GitHub:

1. Abre el repositorio `components-ui-base`.
2. Pulsa **Compare & pull request** para la rama que acabas de subir.
3. Usa `main` como rama de destino.
4. Describe qué cambió, la versión propuesta y cómo se validó.
5. Solicita revisión a otra persona mantenedora cuando sea posible.
6. Fusiona el PR solo después de resolver comentarios y comprobaciones.

El código fusionado en `main` es el único que se debe publicar. No publiques desde una rama de
trabajo ni desde un PR abierto.

### 3. Crear la etiqueta y publicar después del merge

La persona mantenedora que publica actualiza su `main`, comprueba que la versión es la esperada y
repite las validaciones:

```bash
git switch main
git pull origin main
pnpm run format:check
pnpm run check:base-colors
pnpm run build
pnpm run check:consumer-types
pnpm pack --dry-run
```

Si `package.json` contiene `0.1.1`, crea la etiqueta anotada, súbela y publica:

```bash
git tag -a v0.1.1 -m "Release v0.1.1"
git push origin v0.1.1
pnpm publish --no-git-checks
```

Comprueba que el registro responde con esa versión:

```bash
pnpm view @alon16/components-ui-base@0.1.1 version --registry=https://npm.pkg.github.com
```

Una versión ya publicada no se puede sobrescribir. Si se detecta un problema, incrementa la versión
conforme a su impacto y abre un nuevo PR.

### 4. Actualizar un portal consumidor

La publicación de la librería no modifica automáticamente ningún portal. En la rama del portal que
la vaya a adoptar, instala la versión exacta, prueba y abre su propio PR:

```bash
pnpm add @alon16/components-ui-base@0.1.1
pnpm run build
```

El comando actualiza `package.json`, `pnpm-lock.yaml` y, si aplica, `pnpm-workspace.yaml`. Prueba
visualmente las pantallas afectadas, confirma esos cambios y abre un PR del portal. Un cambio
exclusivo de un portal no requiere publicar una nueva versión de la librería.

## Automatización futura

Actualmente la publicación es manual y se ejecuta después del merge. Más adelante se puede crear
un workflow de GitHub Actions que publique al recibir una etiqueta `v*`; en ese caso el PR y el
merge se mantienen iguales, pero el paso `pnpm publish` lo ejecuta GitHub con `GITHUB_TOKEN`. No
agregues esa automatización sin definir antes quién puede crear etiquetas y aprobar releases.

## Versionado semántico

- `MAJOR`: cambios incompatibles, como eliminar una prop pública o renombrar un token CSS.
- `MINOR`: funcionalidad compatible, como añadir un componente, prop o token.
- `PATCH`: correcciones compatibles.

La primera versión publicada es `0.1.0`. Mientras se mantenga `0.x`, trata los cambios de API con
cautela y documenta cualquier modificación relevante en el historial de cambios.
