window.addEventListener('DOMContentLoaded',() => {
    
    //Declaramos nuetras variables

    //Nuetras Celdas que lo guardam
    const celda = Array.from(document.querySelectorAll('.Celdas'));

    //Declaramos el boton reset
    const reset = document.querySelector('#reset');
    //Declaramos el player
    const player = document.querySelector('.playerX');

    const announcer = document.querySelector('.announcer');
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
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won'; 
                //announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won'; 
                break;
            case empate:
                announcer.innerHTML = 'Empate'; 
        }
        announcer.classList.remove('hide');
    };




    const Empezar_Juego = (celda,index) => {
        //Validamos que la casilla este libre
        if(Validar_Celda(celda) && Juego_Activo){
            celda.innerHTML = player_Actual;
            celda.classList.add(`player${player_Actual}`);
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




    //reset.addEventListener('click',resetBotton);
})