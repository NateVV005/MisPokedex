const URL_API = 'https://pokeapi.co/api/v2/pokemon/';

function cargar_datos() {
    let pokemon_id = document.getElementById('pokemon_id');

    if (pokemon_id) {
        const xhttp = new XMLHttpRequest();

        xhttp.open('GET', URL_API + pokemon_id.value.toLowerCase().trim(), true);
        xhttp.onreadystatechange = function() {
            if (xhttp && xhttp.readyState == 4 && xhttp.status == 200) {
                let objeto = JSON.parse(xhttp.responseText);
                console.log(objeto);
                crear_personaje(objeto);
            }
        };
        xhttp.send();
    }
}

function crear_personaje(objeto) {
    let div = document.createElement('div');
    div.className = 'pokemon-card';

    let h1 = document.createElement('h1');
    h1.appendChild(document.createTextNode(objeto.name));
    div.appendChild(h1);

    let image = document.createElement('img');
    image.src = objeto.sprites.front_default;
    image.alt = objeto.name;
    div.appendChild(image);

    let spanId = document.createElement('span');
    spanId.className = 'pokemon-number';
    spanId.appendChild(document.createTextNode('#' + objeto.id));
    div.appendChild(spanId);

    let contenedor = document.getElementById('container');
    contenedor.appendChild(div);
}