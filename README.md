# Proyecto-Productos-y-mas
pagina web de multiple uso

Link de la pagina web [aqui](https://cloud-c-project.herokuapp.com/)

## Como usar?

una vez el respositorio este funcionando, entreremos al repositorio donde lo hayamos clonado o extraido de la siguiente forma

```
cd (el destino donde se clono o descargo el repositorio)/WebSite/
```

```diff
-Importante
```

en la carpeta de `FrontEnd/scr/environments` editaremos los archivos que dicen: **environment.ts** y **environment.prod.ts**, hay una variable nombrada como "urlBE" el cual editaremos, en nuestra cmd, pdoremos el siguiente codigo.

```
ipconfig // si se usa windos 10
```

con este tendremos nuestra ip ( empieza como 192.168.x.xxx) una vez ya obtenida esta ip, la rempazaremos en nuestros archivos environment

```
urlBE:"http://192.168.x.xx:3000"
```
usamos el puerto 3000 porque viene por defecto en el back end.

para buscar la ip que usaremos para nuestro Front End sera la misma que encontramos anteriormente, exceptuando que para el puerto usaremos el 4200.

### Front End ( angular )

Iniciemos primero por el front end, entraremos a la carpeta desde nuestra consola, una vez sa hayan echo los primeros pasos del inicio ya solo tenemos que ingresar a la carpeta FrontEnd : 

```
cd FrontEnd/
```

Luego usamos el siguiente codigo para iniciar el servidor

```
ng serve
```

para poder verlo desde telefono, usaremos el mismo codigo solo que agregaremos ```--host 0.0.0.0``` de modo que sera:

```
ng serve --host 0.0.0.0
```

Con esto ya estara usando la ip que nos provee el servicio de internet

### Back End ( NodeJS )

abriremos otro cmd ingresando a la ruta donde extrajimos o clonamos nuestro repositorio, ingresamos a la carpeta BackEnd:

```
cd FronEnd/
```

En el caso anterior no necesitabamos instalar nada, ya que con ``` ng serve ``` lo hace automaticamente, mas sin embargo para este caso si necesitamos instalar los modulos que se necesitan para que funcione bien, entonces usaremos

```
npm i
```
Este codigo instala todas las dependencias requeridas para su funcionamiento, una vez instalada las dependecias, iniciaremos el servidor con el siguiente codigo

```
npm run startServer
```

con esto ya tendremos tanto el BackEnd como FrontEnd abiertos y funcionando


