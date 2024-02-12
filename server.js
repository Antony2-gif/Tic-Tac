//Importamos el modelo express
const express = require('express');
//Creamos una instancia
const app=express();
//Importamos path para trabajar con directorios y archivos
const path=require('path');
//Importamos http para crear un servidor
const http = require('http');
//Importarmos socket para crear un servidor WebSocket
const {Server} = require("socket.io");
const { Socket } = require('dgram');

//Creamos un servidor http utilizado express
const server = http.createServer(app);

//Puerto
const PORT = process.env.PORT || 80;
//Creamos una conexion WebSocket el el mismo pueto que http
const io = new Server(server)
//Configuramos express para utilizar los archivos en la raiz del proyecto
app.use(express.static(path.resolve("")))

//Aqui guardamelos nos nombre de los Usuarios
let nombre_usuarios = []
let playingArray = []


io.on("connection",(socket) => {

    //console.log("Cliente conectado:", socket.id);
    //Escuchamos el evento enviado por parte del usuasrio
    socket.on("find",(e)=>{
        //Verificaos que hayan ingresado un nombre
        if(e.name!=null){
            //Agregamos el nombre al arreglo
            nombre_usuarios.push(e.name)
            
            //Verificamos que hayan ingresado 2 jugados
            if(nombre_usuarios.length==2){
                //Creamos un objeto para el Primero usuario
                let p1obj={
                    //Agregamos el nombre
                    p1name:nombre_usuarios[0],
                    //Agremos el Turno
                    p1value:"X",
                    //Movimiento
                    p1move:""
                }
                //Objeto del segundo usuario
                let p2obj={
                    p2name:nombre_usuarios[1],
                    p2value:"O",
                    p2move:""
                }
                //Creamos un objeto para contener los subjetos p1 y p2
                let obj={
                    p1:p1obj,
                    p2:p2obj,
                    sum:1
                }
                playingArray.push(obj)

                //Eliminamos los nombres agregados para reiniciar la variable
                nombre_usuarios.splice(0,2)

                io.emit("find",{allPlayers:playingArray})

            }

        }

    })

    socket.on("playing",(e) =>{
        //Verificamos el Turno
        if(e.value=="X"){
            let objToChange = playingArray.find(obj=>obj.p1.p1name===e.name);
            console.log(objToChange)
            objToChange.p1.p1move=e.id
            objToChange.sum++

        }
        if(e.value=="O"){
            //let objToChange = playingArray.find(obj=>obj.p2.p2name===e.name);
            let objToChange=playingArray.find(obj=>obj.p2.p2name===e.name)
            console.log(objToChange)
            objToChange.p2.p2move=e.id
            objToChange.sum++

        }
        io.emit("playing",{allPlayers:playingArray})
    })

    socket.on("gameOver",(e)=>{
        playingArray=playingArray.filter(obj=>obj.p1.p1name!==e.name)
        console.log(playingArray)
    })


    

});



//Definimos nuestro directorio raiz y envios nuestro archivo principal
app.get("/",(req,res) => {
    return res.sendFile('index.html');
})

//Escuchamos en el puerto 3000 las conexiones
server.listen(PORT,()=>{
    console.log(`Conectado al puerto ${PORT}`);
})