# Este proyecto esta deprecado.
Lo archivaremos y no recibirá actualizaciones.

## Transbank SDK Web - Cliente
Este proyecto es parte del SDK Web para POS integrado. 

## SDK Web POS Integrado
Este SDK Web consta de dos partes: 

Cliente **(este repositorio)**: Este cliente se debe instalar e inicializar en el computador que tendrá el equipo POS conectado físicamente. Al instalar e inicializar este servicio, se creará un servidor de websockets local en el puerto 8090, que permitirá, a través del SDK de javascript, poder enviar y recibir mensajes al equipo POS, de manera simple y transparente. 
[SDK Javascript](https://github.com/TransbankDevelopers/transbank-pos-sdk-web-js): Este SDK se debe instalar en el software de caja (o cualquier software web que presente HTML, CSS y JS en un navegador web). Este SDK entrega una interfaz simple para conectarse con el cliente, de manera que se puedan mandar instrucciones al POS con un API fácil de usar. 

## Quick start 
Antes de comenzar, debes asegurarte de descargar el archivo [TransbankWrap.dll](https://github.com/TransbankDevelopers/transbank-pos-sdk-c/releases/download/V3.0.0/TransbankWrapJava.dll) y dejarlo en una ubicación fija dentro del computador. (Ej: `C:/Pos/TransbankWrap.dll`). 
Posteriormente, debes generar una variable de entorno del sistema llamada `NATIVE_TRANSBANK_WRAP` que tenga la ubicación del archivo. (Ej: `C://Pos//TransbankWrap.dll`)
También debes descargar la librería [libserialport-0.dll](https://github.com/TransbankDevelopers/transbank-pos-sdk-c/releases/latest) y dejarla en la carpeta `System32`. 

Este es un proyecto construido en Java. En cada nueva versión (release) se incluye el .jar que se puede ejecutar directamente (teniendo Java instalado).
Una vez descargado el archivo '.jar' desde el último release del proyecto, se debe inicializar el servicio:
```bash
java -jar transbank-pos-sdk-web-client.jar
```
Descargar archivo: [https://github.com/TransbankDevelopers/transbank-pos-sdk-web-client/releases](https://github.com/TransbankDevelopers/transbank-pos-sdk-web-client/releases)

# Inicie automático
Ejecutando el comando antes mencionado, se inicia el servicio manualmente. El objetivo es que este .jar se ejecute en todo momento, por lo que se recomienda buscar una forma de inicializarlo automáticamente cuando el computador se inicie. 
Próximamente agregaremos recomendaciones sobre este proceso. Si tienen sugerencias, son bienvenidas en los 'issues' de este repositorio en Github. 


## Compilar manualmente
Este proyecto está desarollado en Java, por lo que se requiere tener Java y MVN instalado. 

Para correr el proyecto, primero entrar a la carpeta del proyecto y compilar. 
```bash
mvn package
```
Para ejecutar el proyecto: 
```bash
java -jar target/transbank-pos-sdk-web-client.jar
```

Una vez ejecutado, ya se puede conectar usando el SDK de javascript apra interactuar de manera simple con el POS a través de la web. 


## Documentación 

Puedes encontrar toda la documentación de cómo usar este SDK en el sitio https://www.transbankdevelopers.cl.

La documentación relevante para usar este SDK es:

- Documentación general sobre los productos y sus diferencias:
  [POSIntegrado](https://www.transbankdevelopers.cl/producto/posintegrado)
- Primeros pasos con [POSIntegrado](https://www.transbankdevelopers.cl/documentacion/posintegrado).
- Referencia detallada sobre [POSIntegrado](https://www.transbankdevelopers.cl/referencia/posintegrado).


## Información para contribuir y desarrollar este SDK

### Standares

- Para los commits respetamos las siguientes normas: https://chris.beams.io/posts/git-commit/
- Usamos ingles, para los mensajes de commit.
- Se pueden usar tokens como WIP, en el subject de un commit, separando el token con `:`, por ejemplo:
`WIP: This is a useful commit message`
- Para los nombres de ramas también usamos ingles.
- Se asume, que una rama de feature no mezclada, es un feature no terminado.
- El nombre de las ramas va en minúsculas.
- Las palabras se separan con `-`.
- Las ramas comienzan con alguno de los short lead tokens definidos, por ejemplo: `feat/tokens-configuration`

#### Short lead tokens
##### Commits
- WIP = Trabajo en progreso.
##### Ramas
- feat = Nuevos features
- chore = Tareas, que no son visibles al usuario.
- bug = Resolución de bugs.

### Todas las mezclas a master se hacen mediante Pull Request.

## Generar una nueva versión (con deploy automático a Maven)

Para generar una nueva versión, se debe crear un PR (con un título "Prepare release X.Y.Z" con los valores que correspondan para `X`, `Y` y `Z`). Se debe seguir el estándar semver para determinar si se incrementa el valor de `X` (si hay cambios no retrocompatibles), `Y` (para mejoras retrocompatibles) o `Z` (si sólo hubo correcciones a bugs).

En ese PR deben incluirse los siguientes cambios:

1. Modificar el archivo `CHANGELOG.md` para incluir una nueva entrada (al comienzo) para `X.Y.Z` que explique en español los cambios **de cara al usuario del SDK**.

Luego de obtener aprobación del pull request, debe mezclarse a master e inmediatamente generar un release en GitHub con el tag `vX.Y.Z`. En la descripción del release debes poner lo mismo que agregaste al changelog.


