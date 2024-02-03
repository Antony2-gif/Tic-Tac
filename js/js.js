window.addEventListener('DOMContentLoaded',() => {
    
    //Declaramos nuetras variables

    //Nuetras Celdas que lo guardam
    const celda = Array.from(document.querySelectorAll('.Celdas'));

    //Declaramos el boton reset
    const reset = document.querySelector('#reset');
    //Declaramos el player
    const player = document.querySelector('.playerX');

    const resultado_o = document.querySelector('.resultado');

    //declaramos el main principal
    const mainss = document.querySelector('.backg');

    //Declaramos un arreglo sobre las 9 celdas del tic tac
    let tablero = ['','', '', '', '', '', '','', ''];

    //Declaramos el player X
    let player_Actual = 'X';
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
                resultado_o.innerHTML = 'Jugador <span class="playerO">O</span> Won'; 
                //resultado_o.innerHTML = 'Player <span class="playerO">O</span> Won';
                //mainss.classList.add('transition-style="in:circle:bottom-right"');
                mainss.setAttribute('onclick', 'activarAnimacion(this)');
                activarAnimacion(mainss);  // Llama a la función para activar la animación directamente
                break;
            case PLAYERX_WON:
                resultado_o.innerHTML = 'Jugador <span class="playerX">X</span> Won'; 
                mainss.setAttribute('onclick', 'activarAnimacion(this); cambiarColor(this);');
                break;
            case empate:
                resultado_o.innerHTML = 'Empate'; 
        }
        resultado_o.classList.remove('hide');
        //resultado_o.classList.add('animated', 'fadeIn'); // Puedes cambiar 'fadeIn' por el nombre de la animación que prefieras

        // Elimina las clases de animación después de un tiempo
        setTimeout(() => {
            resultado_o.classList.remove('animated', 'fadeIn');
        }, 1000); // Ajusta el tiempo según la duración de tu animación


    };




    const Empezar_Juego = (celda,index) => {
        //Validamos que la casilla este libre
        if(Validar_Celda(celda) && Juego_Activo){
            celda.innerHTML = player_Actual;
            
            celda.classList.add(`player${player_Actual}`);
            if(player_Actual=='X'){
                celda.style.background = 'linear-gradient(90deg, #fd7e14 5%, #ffd43b 95%)';

            }else{

                celda.style.background = 'linear-gradient(90deg, #228be6 5%, #3bc9db 95%)';
            }
            //Ahora Actualizamo el tablero un la posiscion que escoguio el jugador
            actualizar_Tablero(index);
            //Validamos el juego
            Validar_Juego();
            //Cambiamos al siguiente jugador
            Cambiar_Jugador();
        }
    }

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

    //Veremos si la celda esta ocupada
    const Validar_Celda = (celda) => {
        if(celda.innerHTML === 'X' || celda.innerHTML === 'O'){
            return false;
        }
        return true;
            
    };


    //Cremos un for para recorrer todas las celdas
    celda.forEach( (celda, index) => {
        celda.addEventListener('click', () => Empezar_Juego(celda, index));
        //celda.addEventListener('click', () => console.log("ss"));
        //console.log(index)
    });


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



})