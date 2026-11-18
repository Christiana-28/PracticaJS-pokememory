# Pokémon Memory

Pokémon Memory es una aplicación web que consiste en un juego de memoria. El objetivo es encontrar todas las parejas de cartas que contienen el mismo Pokémon en el menor tiempo posible.

El proyecto está desarrollado con JavaScript, HTML y CSS, y utiliza la API de Pokémon para obtener la información y las imágenes de los Pokémon.

## Funcionalidades

- Registro de jugadores mediante nombre y correo electrónico.
- Actualización del nombre de usuarios existentes.
- Selección del número de cartas para cada partida.
- Obtención de Pokémon mediante la API de PokeAPI.
- Generación y mezcla aleatoria de las cartas.
- Comprobación de parejas iguales.
- Cronómetro para medir la duración de cada partida.
- Mensaje de victoria al encontrar todas las parejas.
- Guardado de los resultados en Firebase.
- Ranking de jugadores según sus resultados.
- Gestión de la sesión del jugador mediante `sessionStorage`.

## Tecnologías utilizadas

- **HTML5:** estructura de la aplicación.
- **CSS3:** diseño y estilos de la interfaz.
- **JavaScript:** lógica y funcionalidades del juego.
- **PokeAPI:** obtención de los datos e imágenes de los Pokémon.
- **Firebase Realtime Database:** almacenamiento de usuarios y resultados.
- **Git y GitHub:** control de versiones y alojamiento del código.

## Estructura del proyecto

```text
PracticaJS-pokememory/
│
├── index.html
│
├── css/
│   └── main.css
│
└── js/
    ├── config.js
    ├── firebase.js
    ├── game.js
    ├── main.js
    └── ui.js
```

### Organización de los archivos JavaScript

- **config.js:** contiene la configuración y la URL de Firebase.
- **firebase.js:** gestiona las peticiones a Firebase, como registrar usuarios y guardar resultados.
- **game.js:** contiene la lógica principal del juego, incluyendo las cartas, las parejas y el cronómetro.
- **main.js:** conecta los diferentes módulos y gestiona los eventos principales de la aplicación.
- **ui.js:** controla los elementos visuales, las pantallas, los mensajes y el ranking.

## Instalación y ejecución

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Christiana-28/PracticaJS-pokememory.git
   ```

2. Entrar en la carpeta del proyecto:

   ```bash
   cd PracticaJS-pokememory
   ```

3. Iniciar un servidor local. Por ejemplo, utilizando `http-server`:

   ```bash
   npx http-server -p 8082
   ```

4. Abrir el navegador y acceder a:

   ```text
   http://127.0.0.1:8082
   ```

## APIs y base de datos

### PokeAPI

Se utiliza [PokeAPI](https://pokeapi.co/) para obtener información de los Pokémon, como sus nombres e imágenes.

### Firebase Realtime Database

Se utiliza Firebase Realtime Database para almacenar la información de los usuarios y los resultados de las partidas.

La URL de la base de datos se encuentra configurada en `js/config.js`.


