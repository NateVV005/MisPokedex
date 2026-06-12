function toggleIntelModal(mostrar) {
    const modal = document.getElementById('intel-modal');
    if (mostrar) {
        modal.classList.add('modal-visible');
    } else {
        modal.classList.remove('modal-visible');
    }
}

function cerrarModalExterno(event) {
    if (event.target.id === 'intel-modal') {
        toggleIntelModal(false);
    }
}

function cargarAccesoRapido(identificador) {
    document.getElementById('pokemon_id').value = identificador;
    toggleIntelModal(false); // Cierra la ventana flotante de inmediato
    analizarEnemigo();
}

const URL_POKEMON = 'https://pokeapi.co/api/v2/pokemon/';

async function analizarEnemigo() {
    const pokemon_id = document.getElementById('pokemon_id');
    const contenedor = document.getElementById('container');

    if (!pokemon_id || pokemon_id.value.trim() === "") return;

    contenedor.innerHTML = '<p style="color: #ff1744; font-weight: bold; font-size: 1.2rem;">Escaneando puntos débiles del objetivo...</p>';
    const busqueda = pokemon_id.value.toLowerCase().trim();

    try {
        const respuestaPoke = await fetch(URL_POKEMON + busqueda);
        if (!respuestaPoke.ok) throw new Error("Pokémon no encontrado");
        
        const pokemon = await respuestaPoke.json();
        let debilidades = new Set(); 

        const promesasTipos = pokemon.types.map(t => fetch(t.type.url).then(res => res.json()));
        const datosTipos = await Promise.all(promesasTipos);

        datosTipos.forEach(tipoInfo => {
            tipoInfo.damage_relations.double_damage_from.forEach(deb => {
                debilidades.add(deb.name);
            });
        });

        construirReporte(pokemon, Array.from(debilidades));
    } catch (error) {
        console.error("Error en el radar Rocket:", error);
        contenedor.innerHTML = '<p style="color: #b71c1c; font-weight: bold;">¡Error! El objetivo logró eludir nuestro radar. Verifica que el ID exista o que el nombre esté bien escrito.</p>';
    }
}

function determinarRegion(id, name) {
    if (id >= 10001) {
        if (name.includes('-alola')) return 'Alola 🌴';
        if (name.includes('-galar')) return 'Galar 🛡️';
        if (name.includes('-hisui')) return 'Hisui ⏳';
        if (name.includes('-paldea')) return 'Paldea 🍇';
        return 'Especial 🧪';
    }
    if (id >= 1 && id <= 151) return 'Kanto 🏛️';
    if (id >= 152 && id <= 251) return 'Johto ⛩️';
    if (id >= 252 && id <= 386) return 'Hoenn 🌋';
    if (id >= 387 && id <= 493) return 'Sinnoh ⛰️';
    if (id >= 494 && id <= 649) return 'Teselia 🏙️';
    if (id >= 650 && id <= 721) return 'Kalos 🗼';
    if (id >= 722 && id <= 809) return 'Alola 🌴';
    if (id >= 810 && id <= 898) return 'Galar 🛡️';
    if (id >= 899 && id <= 905) return 'Hisui ⏳';
    if (id >= 906 && id <= 1025) return 'Paldea 🍇';
    return 'Desconocida 🛸';
}

function construirReporte(pokemon, listaDebilidades) {
    const contenedor = document.getElementById('container');
    contenedor.innerHTML = ''; 

    let div = document.createElement('div');
    div.className = 'pokemon-card';

    let badge = document.createElement('div');
    badge.className = 'badge-analisis';
    badge.innerText = 'ANÁLISIS DE COMBATE';
    div.appendChild(badge);

    let h1 = document.createElement('h1');
    h1.appendChild(document.createTextNode(pokemon.name));
    div.appendChild(h1);

    let image = document.createElement('img');
    image.src = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    image.alt = pokemon.name;
    div.appendChild(image);

    let seccionDebilidades = document.createElement('div');
    seccionDebilidades.className = 'seccion-debilidades';
    
    let tituloDeb = document.createElement('h3');
    tituloDeb.innerText = 'Vulnerable a (x2):';
    seccionDebilidades.appendChild(tituloDeb);

    if (listaDebilidades.length > 0) {
        listaDebilidades.forEach(deb => {
            let itemDeb = document.createElement('span');
            itemDeb.className = `tipo-badge ${deb}`;
            itemDeb.innerText = traducirTipo(deb);
            seccionDebilidades.appendChild(itemDeb);
        });
    } else {
        let itemInmune = document.createElement('span');
        itemInmune.innerText = 'Sin debilidades críticas';
        itemInmune.style.fontSize = '0.85rem';
        itemInmune.style.color = '#757575';
        seccionDebilidades.appendChild(itemInmune);
    }
    div.appendChild(seccionDebilidades);

    let footerCard = document.createElement('div');
    footerCard.className = 'card-footer-data';

    let spanRegion = document.createElement('span');
    spanRegion.className = 'pokemon-region';
    spanRegion.innerText = determinarRegion(pokemon.id, pokemon.name);
    footerCard.appendChild(spanRegion);

    let spanId = document.createElement('span');
    spanId.className = 'pokemon-number-static';
    spanId.innerText = '#' + pokemon.id;
    footerCard.appendChild(spanId);

    div.appendChild(footerCard);
    contenedor.appendChild(div);
}

function traducirTipo(tipoEng) {
    const traducciones = {
        normal: 'Normal', fighting: 'Lucha', flying: 'Volador', poison: 'Veneno',
        ground: 'Tierra', rock: 'Roca', bug: 'Bicho', ghost: 'Fantasma',
        steel: 'Acero', fire: 'Fuego', water: 'Agua', grass: 'Planta',
        electric: 'Eléctrico', psychic: 'Psíquico', ice: 'Hielo', dragon: 'Dragón',
        dark: 'Siniestro', fairy: 'Hada'
    };
    return traducciones[tipoEng] || tipoEng.toUpperCase();
}