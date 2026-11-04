# Bitácora de IA · Lab 05

Herramienta: Claude Code en VS Code (dentro del DevContainer), con los prompts
de [prompts.md](prompts.md).

## 1 · Un `npx --yes` colado para validar el devcontainer.json

### Prompt

"DevContainer (.devcontainer/devcontainer.json). Lee el fichero y respeta su
estilo […] NO ejecutes npm install todavía: dime qué comandos vas a lanzar
[…] y espera a que te lo confirme." (prompt 0 de `prompts.md`).

### Qué me dio

Para comprobar que el `devcontainer.json` seguía siendo válido después de
editarlo, lanzó `npx --yes -p jsonc-parser@3 true` seguido de un `node -e` que
quitaba los comentarios y hacía `JSON.parse`. El `npx --yes` se descargó
`jsonc-parser` en la caché de npm (`~/.npm/_npx/…`) sin preguntar.

### Qué corregí y por qué

El `npx` sobraba: la validación ya la hacía el `node -e`, que no necesita nada
instalado. Además, saltarse la confirmación iba en contra de la regla de no
instalar nada sin preguntar, y justo en el paso en el que el prompt pedía
esperar antes del `npm install`. Borré la entrada de la caché
(`rm -rf ~/.npm/_npx/<hash>`) y comprobé que en el repo no había cambiado nada
(`git status`). Para validar un JSON con comentarios basta con Node.
