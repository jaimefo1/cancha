//genera una nueva escuadra
function nuevaEscuadra() {
    //tomamos los tiradores de los inputs nombre?
    let tiradores = new Array();
    let puestosIniciales = [0, 0, 0, 0, 0];
    let puestosEsperas = [0, 0, 0, 0, 0];
    //tomamos los nonbres de los tiradores
    for (let t = 1; t < 7; t++) {
        let id = 'nombre' + t;
        //tomamos el nombre y lo añadimos a la lista de tiradores
        let nombre = document.getElementById((id)).value;
        //si no está vacio
        if (nombre != "") {
            tiradores.push(nombre);
            //si es hasta el 5 entra en los puestos iniciales
            if (t < 6) {
                // colocamos en ese puesto al nº del siguiente tirador
                puestosIniciales[t - 1] = tiradores.length;
            } else
            //es que hay 1 tiradores en el puesto de reserva
            {
                puestosEsperas[0] = tiradores.length;
            }
        }
    }
    //a cuantos platos 
    let numeroPlatosSerie = parseInt(document.getElementById("numeroPlatosSerie").value);
    if (tiradores.length > 0) {
        escuadra = new Escuadra(tiradores, puestosIniciales, puestosEsperas, numeroPlatosSerie)
        crearElementos(escuadra);
        escuadra.platoActual = 1;
        actualizaDatos(escuadra);

        //visualiza el div controlEscuadra y oculta el suyo y el boton
        document.getElementById('controlEscuadra').style.display = "block";
        document.getElementById('datosSerie').style.display = "none";
    } else
        alert('NO HAY TIRADORES');
}

//genera los elementos del <div> controlEscuadra
function crearElementos() {

    //#region cancha
    //vamos con la cancha (generamos sus columnas para cada fila)
    //creamos variables string para ir componiendo el contenido (innerHtml)
    let filaPlatos = "",
        filaPuestos = "",
        filaNombres = "",
        filaReservas = "";
    //lanzamos el bucle para 5 puestos
    for (let p = 1; p < 6; p++) {
        filaPlatos = filaPlatos + "<td class='plato' id='plato" + p + "' onclick=marcaPlato(this.id)><img src='imagenes/platoNuevo.png'></td>";
        filaPuestos = filaPuestos + "<td class='puesto' id='etiquetaPuesto" + p + "'> P " + p + " </td>";
        filaNombres = filaNombres + "<td class='tirador' id='puesto" + p + "'></td>";
        filaReservas = filaReservas + "<td class='tirador' id='espera" + p + "'></td>";
    }
    //metemos la primera fila, con el boton múltiple al final
        let alturaYrowspan = escuadra.numeroTiradores + 1;
        let botonMultiple = '<button class="botonMultiple" id="botonMultiple" value="marcaPlato" ' +
            'onclick="botonMultipleClick()"><img src="./imagenes/marcaPlato.png"></button>';
        filaPlatos=filaPlatos+'<td rowspan="4">' + botonMultiple + '</td>';
    
    document.getElementById('platos').innerHTML = filaPlatos;
    document.getElementById('etiquetasPuestos').innerHTML = filaPuestos;
    document.getElementById('puestos').innerHTML = filaNombres;
    document.getElementById('esperas').innerHTML = filaReservas;
    //#endregion

    //#region score
    //vamos a la tabla de tanteos tiradores x platos 
    //ahí vamos a poner el score (escuadra.score)
    let tabla = "";
    //añadimos primero la fila con las columnas que indica tirador, el nº de plato de 1..25, y el total
    let fila = "";
    for (let p = 1; p <= escuadra.numeroPlatosSerie; p++) {
        fila = fila + "<td>" + p % 10 + "</td>";
    };
    tabla = '<tr id="primeraFilaScore"><td>T/P</td>' + fila +
            '<td>TP</td></tr>';
    
    //vamos con la fila de cada tirador!
    for (let t = 1; t <= escuadra.numeroTiradores; t++) {
        let fila = "<tr>";
        //identificamos la columna t1, t2 ...
        fila = fila + "<td class='tirador' id='t" + t + "'>" + t + "-" + escuadra.tiradores[t - 1] + "</td>";
        //generamos las celdas para cada plato, p.e. id="t2p3"
        let columnasPlatos = ""
        for (let p = 1; p <= escuadra.numeroPlatosSerie; p++) {
            columnasPlatos = columnasPlatos + "<td class='anotacion' id='t" + t + "p" + p + "'></td>";
        }
        //añadiomos la celda del total y cerramos tag <tr>
        fila = fila + columnasPlatos + "<td id='total" + t + "'>0" + "</td></tr>";
        //agregamos la fila
        tabla = tabla + fila;
    }
    //finalmente lo llevamos al html (tabla score)
    document.getElementById('score').innerHTML = tabla;
    //#endregion
}

function actualizaDatos() {
    // pone los tiradores (usa puestosActuales (0..4) que contiene el nº de tirador)
    for (let p = 0; p < 5; p++) {
        //guardamos el numeroTirador y las celdas del nombre y la imagen del puesto p
        let numeroTirador = escuadra.puestosActuales[p];
        let celdaNombre = document.getElementById('puesto' + (p + 1));
        let celdaPlato = document.getElementById('plato' + (p + 1)).firstChild;
        //suponemos que no hay tirador
        let texto = Escuadra.nombreNoTirador;
        let imagen = Escuadra.imagenNoPlato;
        //si hay tirador pone su numero y nombre
        if (numeroTirador != 0) {
            texto = numeroTirador + "-" + escuadra.tiradores[numeroTirador - 1];
            //si además es el actual le pone el plato para marcar sobre él
            if (numeroTirador == escuadra.tiradorActual) {
                imagen = Escuadra.imagenesPlatos[0];
            }
        }
        //ponemos los valores
        celdaNombre.innerHTML = texto;
        celdaPlato.src = imagen;
        //resaltamos o no si es el actual a amarillo!
        if (celdaNombre.id == 'puesto' + escuadra.puestoActivo) {
            document.getElementById(celdaNombre.id).style.backgroundColor = Escuadra.colorActivo;
        } else {
            document.getElementById(celdaNombre.id).style.backgroundColor = Escuadra.colorInactivo;
        }
    }
    // pone los reservas (usa puestosEsperas (0..4) que contiene el nº de tirador)
    for (let p = 0; p < 5; p++) {
        //buscamos la celda a asignar
        let celda = document.getElementById('espera' + (p + 1));
        let numeroTirador = escuadra.puestosEsperas[p];
        //suponemos que no hay tirador
        let texto = Escuadra.nombreNoTirador;
        //si hay tirador pone su numero y nombre
        if (numeroTirador != 0) {
            texto = numeroTirador + "-" + escuadra.tiradores[numeroTirador - 1];
        }
        celda.innerHTML = texto;
    }
    //totalizamos         
    refrescaScore();
}

//pone el score de platos completo
function refrescaScore() {
    //totaliza el score en la escuadra
    escuadra.totalizaScore();
    //para cada tirador
    for (let t = 1; t <= escuadra.numeroTiradores; t++) {
        let identificador = 't' + t;
        if (t == escuadra.tiradorActual) {
            document.getElementById(identificador).style.backgroundColor = Escuadra.colorActivo;
        } else {
            document.getElementById(identificador).style.backgroundColor = Escuadra.colorInactivo;
        }
        //para cada plato
        for (let p = 1; p <= escuadra.numeroPlatosSerie; p++) {
            //componemos el id de la celda
            let identificador = "t" + t + "p" + p;
            //obtenemos el elemento
            let celda = document.getElementById(identificador);
            //recuperamos el valor '_','X' o 'O'
            let valorPlato = escuadra.score[t - 1][p - 1];
            //actualizamos la celda (HTML)
            celda.innerHTML = valorPlato;
            //ponemos color de fondo según valorPlato
            celda.style.backgroundColor = Escuadra.coloresScore[Escuadra.valoresPlato.indexOf(valorPlato)];
        }
        //actualizamos en pantalla el total
        identificador = 'total' + t;
        celda = document.getElementById(identificador);
        celda.innerHTML = escuadra.score[t - 1][escuadra.numeroPlatosSerie];
    }
}

//param {string} id del elemento 'plato?' que está clickando
// va rotando el valor de la celda del plato a platoNuevo, platoRoto y platoFallo
// con sus correspondencias en el score, usamos estado para ir rotando
function marcaPlato(id) {
    //primero comprueba que es el puesto activo! y que no la serie ha empezado y no terminado!
    if (id == ('plato' + escuadra.puestoActivo) && (escuadra.platoActual != 0)) {
        //recuperamos el valor actual de la fila y columna en el score
        let fila = escuadra.filaScoreActual; //corresponde al tirador (-1) 
        let columna = escuadra.columnaScoreActual; //corresponde a su plato (-1)
        let valor = escuadra.score[fila][columna];
        //buscamos el nº de estado (0,1,2) correspondiente al valor inicial antes de marcar
        let estado = Escuadra.valoresPlato.indexOf(valor);
        //avanzamos al siguente estado (con rotacion si hace falta)
        estado++;
        if (estado == Escuadra.valoresPlato.length) {
            estado = 0;
        };
        //actualizamos los valores en el score segun estado
        escuadra.score[fila][columna] = Escuadra.valoresPlato[estado];
        //componemos el id de la celda
        let identificador = "t" + (fila + 1) + "p" + (columna + 1);
        //obtenemos el elemento visual
        let celda = document.getElementById(identificador);
        //actualizmos su contenido
        celda.innerHTML = Escuadra.valoresPlato[estado];
        //ponemos color de fondo según valor en el <td> del score?
        celda.style.backgroundColor = Escuadra.coloresScore[estado];
        //actualizamos la imagen en el plato?
        elemento = document.getElementById(id).firstChild;
        elemento.src = Escuadra.imagenesPlatos[estado];

        //ponemos el botonMultiple según estado
        ponBotonMultiple(estado > 0 ? (escuadra.fin ? 'fin' : 'siguiente') : 'marcaPlato');
    }
}

//recibe el texto del modo, modifica value y su img
function ponBotonMultiple(modo) {
    let boton = document.getElementById("botonMultiple");
    boton.value = modo;
    boton.firstChild.src = './imagenes/' + modo + '.png';
}

//avanza al siguiente tirador
function siguiente(ecuadra) {
    //vamos avanzando hasta que haya tirador esperando!!
    do {
        escuadra.avanzaUno();
    } while (escuadra.puestosActuales[escuadra.puestoActivo - 1] == 0)
    //actualizamos los datos
    actualizaDatos();
    //aumenta el platoActual
    escuadra.platoActual++;
    //pone el boton en modo marcas plato
    ponBotonMultiple('marcaPlato');
}

//
function fin(boton) {
    //refrescamos score para que quede en pantalla
    refrescaScore();
    ponBotonMultiple('nueva');
    //desactivamos el marcaje de platos
    escuadra.platoActual = 0;
}

function nuevaPartida() {
    document.getElementById('controlEscuadra').style.display = "none";
    document.getElementById('datosSerie').style.display = "block";
}

//gestiona el click del botonMultiple
function botonMultipleClick() {
    let boton = document.getElementById("botonMultiple");
    switch (boton.value) {
        case "siguiente": {
            siguiente();
            break;
        }
        case "fin": {
            fin();
            break;
        }
        case "nueva": {
            nuevaPartida();
            break;
        }
        default: {
            alert("PULSA EL PLATO 1 o 2 VECES PARA MARCAR");
        }
    }
}