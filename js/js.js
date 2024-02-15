
window.addEventListener('DOMContentLoaded',() => {


    //Nuetras Celdas que lo guardam
    const celda = Array.from(document.querySelectorAll('.Celdas'));

    //Declaramos el boton reset
    const reset = document.querySelector('#reset');
    //Declaramos el player
    const player = document.querySelector('.playerX');

    const resultado_o = document.querySelector('.resultado');

    //declaramos el main principal
    const mainss = document.querySelector('.backg');

    //Hacemos una instancia del io
    const socket = io();
    const button_start = document.querySelector('#Buscar_jugador');
    //Declaramos un arreglo sobre las 9 celdas del tic tac
    let tablero = ['','', '', '', '', '', '','', ''];

    //Declaramos el player X
    let player_Actual ="X" ;
    let Juego_Activo = true;


    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const empate = "Empate";

    //Ahoro vemos todas las posibilidades de ganar


    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];


    //Ocultamos los elementos 
    document.querySelector('.backg .Tic-tac').style.display = "none";
    document.querySelector('.backg .turnos').style.display = "none";
    document.querySelector('.backg .playerss ').style.display = "none";
    document.querySelector('.backg .Butt').style.display = "none";


    function Validar_Juego(){
        let roundWon = false;
        //Realizamos un ciclo for de las 9 posiciones
        for(let i=0;i<=7;i++){
            const winCondition = winningConditions[i];
            const a = tablero[winCondition[0]];
            const b = tablero[winCondition[1]];
            const c = tablero[winCondition[2]];

            if(a === '' || b === '' || c === ''){
                continue;
            }
            //El jugador ya gano
            if(a === b && b === c){
                roundWon = true;
                break;
            }
        }

        if(roundWon){
            //Cremos un metodo para declarar al ganador
            Ver_Ganador(player_Actual === 'X' ? PLAYERX_WON  :PLAYERO_WON  );
            //Desactivamos el juego
            Juego_Activo = false;
            return;
        }

        if(!tablero.includes(''))
            Ver_Ganador(empate);
    }



    const Ver_Ganador = (type) => {
        switch(type){
            case PLAYERO_WON:
                resultado_o.innerHTML = 'Jugador <span class="playerO">O</span> Gano'; 
                mainss.setAttribute('onclick', 'activarAnimacion(this)');
                activarAnimacion(mainss);  // Llama a la función para activar la animación directamente
                break;
            case PLAYERX_WON:
                resultado_o.innerHTML = 'Jugador <span class="playerX">X</span> Gano'; 
                mainss.setAttribute('onclick', 'activarAnimacion(this); cambiarColor(this);');
                break;
            case empate:
                resultado_o.innerHTML = 'Empate'; 
        }
        resultado_o.classList.remove('hide');

        // Elimina las clases de animación después de un tiempo
        setTimeout(() => {
            resultado_o.classList.remove('animated', 'fadeIn');
        }, 1000); // Ajusta el tiempo según la duración de tu animación


    };

    const Cambiar_Jugador = () => {
        //Removemos el player anterior
        player.classList.remove(`player${player_Actual}`);
        //Cambiarmos de turno
        player_Actual = player_Actual === 'X' ? 'O' : 'X';
        //Actualizamos al player Actual
        player.innerHTML = player_Actual;
        player.classList.add(`player${player_Actual}`);
    }

    const actualizar_Tablero = (index) => {
        tablero[index] = player_Actual;
    }



    function Validar_Celda(clase, indice) {
        // Seleccionamos el div con la clase y el atributo data-index especificados
        const celda = document.querySelector(`.${clase}[data-index="${indice}"]`);
        
        // Verificamos si la celda existe
        if (celda) {
            if (celda.textContent === 'X' || celda.textContent === 'O') {
                //console.log(`El texto dentro de la celda con la clase "${clase}" y el índice "${indice}" es igual a "${texto}".`);
                console.log('Si hay')

                return false;
            }else{
                console.log('No Hay')

                return true;
            }

        } 
    }



    //Metodo para reinicar el juego

    const Reinicar_Partida = () => {
        tablero = ['', '', '', '', '', '', '', '', ''];
        Juego_Activo = true;

        resultado_o.classList.add('hide');
        
        if (player === 'O') {
            changePlayer();
        }

        celda.forEach(celda => {
            celda.innerText = '';
            celda.classList.remove('playerX');
            celda.classList.remove('playerO');
        });

        mainss.removeAttribute('onclick');

        celda.forEach( (celda, index) => {
            //Limpiamos todos los colores de las Celadas
            celda.style.background = '';
        });
    }


    reset.addEventListener('click',Reinicar_Partida);


    let name;
    //Metodo para encontrar un jugador
    const Encontar_player = () => {
        //Obtenemos el nombre del usuario
        name = document.querySelector('#name_user').value;

        //Nos aseguramos que este un nombre
        if(name ==null || name ==''){
            alert("Ingresa tu nombre");
        }else{
            //Desabilitamos el button
            button_start.disabled = true;
            //Enviamos el evento al servidor a travez del socket
            socket.emit("find", { name: name });
            //console.log("Evento 'find' emitido");

        }
    }

    //Funcion para el button de ecnontar jugador
    //Funcion para el button de encontrar jugador
    button_start.addEventListener('click', Encontar_player);

    // Variable para mantener el estado del juego (si es el turno del jugador X)
    let isPlayerXTurn = true;

    // Escuchamos el evento enviado desde el servidor
    socket.on("find", (e) => {
        // Si encontró a un jugador, iniciamos el juego
        let allPlayersArray = e.allPlayers;

        // Mostramos el tablero y otros elementos del juego
        document.querySelector('.backg .Tic-tac').style.display = "";
        document.querySelector('.backg .turnos').style.display = "";
        document.querySelector('.backg .playerss ').style.display = "";
        document.querySelector('.backg .Butt').style.display = "";
        document.querySelector('.backg .inicio_name').style.display = "none";

        // Obtenemos los nombres de los jugadores y sus valores
        let oppname, value;
        const foundObject = allPlayersArray.find(obj => obj.p1.p1name == `${name}` || obj.p2.p2name == `${name}`);
        foundObject.p1.p1name == `${name}` ? oppname = foundObject.p2.p2name : oppname = foundObject.p1.p1name;
        foundObject.p1.p1name == `${name}` ? value = foundObject.p1.p1value : value = foundObject.p2.p2value;
        document.querySelector('.backg .player_2').innerHTML = "Tu oponente es " + oppname;
        document.querySelector('.backg .player_1').innerHTML = value;

        // Iteramos sobre todas las celdas para asignarles el evento click
        celda.forEach((celda, index) => {
            celda.addEventListener('click', () => {
                if ((isPlayerXTurn && value === "X") || (!isPlayerXTurn && value === "O")) {
                    // Solo permitimos el movimiento si es el turno correcto del jugador
                    const indexs = celda.dataset.index;
                    socket.emit("playing", { value: value, id: indexs, name: name });
                }
            });
        });
    });

    // Recibimos lo que nos envió el servidor
    socket.on('playing', (e) => {
        // Obtenemos los datos del jugador
        const foundObject = e.allPlayers.find(obj => obj.p1.p1name == `${name}` || obj.p2.p2name == `${name}`);
        p1id = foundObject.p1.p1move;
        p2id = foundObject.p2.p2move;

        // Cambiamos el turno del jugador
        isPlayerXTurn = !isPlayerXTurn;

        // Deshabilitamos las celdas según el jugador
        if (isPlayerXTurn) {
            // Deshabilitar toda la sección Tic-tac si es el turno del jugador X
            document.querySelectorAll('.Celdas').forEach(celda => {
                celda.disabled = true;
            });
        } else {
            // Habilitar las celdas si es el turno del jugador O
            document.querySelectorAll('.Celdas').forEach(celda => {
                celda.disabled = false;
            });
        }

        // Actualizamos las celdas según los movimientos de los jugadores
        if (p1id) {
            document.querySelector(`.Celdas[data-index="${p1id}"]`).textContent = "X";
            document.querySelector(`.${"Celdas"}[data-index="${p1id}"]`).style.background = 'linear-gradient(90deg, #fd7e14 5%, #ffd43b 95%)';

        }
        if (p2id) {
            document.querySelector(`.Celdas[data-index="${p2id}"]`).textContent = "O";
            document.querySelector(`.${"Celdas"}[data-index="${p2id}"]`).style.background = 'linear-gradient(90deg, #228be6 5%, #3bc9db 95%)';

        }

        // Verificamos si hay un ganador o si hay un empate
        check(name, foundObject.sum);
    });


    function check(name, sum) {
        let cells = document.querySelectorAll('.Celdas');
    
        let b1 = cells[0].innerText || 'a';
        let b2 = cells[1].innerText || 'b';
        let b3 = cells[2].innerText || 'c';
        let b4 = cells[3].innerText || 'd';
        let b5 = cells[4].innerText || 'e';
        let b6 = cells[5].innerText || 'f';
        let b7 = cells[6].innerText || 'g';
        let b8 = cells[7].innerText || 'h';
        let b9 = cells[8].innerText || 'i';
    
        if ((b1 == b2 && b2 == b3) || (b4 == b5 && b5 == b6) || (b7 == b8 && b8 == b9) || (b1 == b4 && b4 == b7) || (b2 == b5 && b5 == b8) || (b3 == b6 && b6 == b9) || (b1 == b5 && b5 == b9) || (b3 == b5 && b5 == b7)) {
            socket.emit("gameOver", { name: name });
    
            setTimeout(() => {
                sum % 2 == 0 ? alert("Jugador X Gano!!") : alert("Jugador O Gano!!");
    
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }, 100);
        } else if (sum == 10) {
            socket.emit("gameOver", { name: name });
    
            setTimeout(() => {
                alert("Empate!!");
    
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }, 100);
        }
    }
    

})