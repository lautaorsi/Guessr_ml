const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
});

const {rando, randoSequence} = require('@nastyox/rando.js');

var colors = ["#CC2A3D", "#9D2ECC", "#CBC52B", "#CB852B", "#3E3E3E", "#2C83CB"]

var scr, vid_index, active_video, active_playlist

const videos_qty = 171





function getColor(){
      return colors[rando(colors.length - 1)]
}



server.listen(3000, () => {
  console.log('listening on *:3000');
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  
});


app.use(express.static(__dirname));

var player_count = 0
var current_players = 0

let rooms = {}

let player_id = {}


//GUIDELINES:

//player dupla ('name', #color)

//rooms = {1roomID: {}
//         2roomID: {}        
//}

//rooms[room] = {PLAYERS: [player, player, player]
//               VIDEOS: [videoIndex, videoIndex, videoIndex]          (videoID = int)
//}


io.on('connection', (socket) => {
  var video
  current_players += 1;
  player_count += 1;
  console.log(`current players = ${current_players}`)
  console.log(`overall players = ${player_count}`)
  var room = '';
  socket.emit('accepted'); 



  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });



  socket.on('username', (data, callback)=> {
    //add key value pair user id => username
    player_id[socket.id] = data[0]
    //join player to room
    socket.join(data[1]) 
    room = data[1]
    var color = getColor()


    //when user joins, join him to existent list or create one (w/ random color) 
    if(room in rooms){
      while(((rooms[room])['names']).includes(data[0])){
        data[0] = `${data[0]}${rando(100)}`
        player_id[socket.id] = data[0]
      }
      (rooms[room])['Players'].push([data[0],color,socket.id]);
      ((rooms[room])['names']).push(data[0]);
      (rooms[room])['points'][data[0]] = 0;
      socket.emit('rules', rooms[room][['Rules']]);
      console.log(rooms[room].names)
    }
    else{
      //create room object within rooms dictionary
      rooms[room] = {
        'Players': [],
        'names': [data[0]],
        'guesses' : 0,
        'guess_data': {},
        'current_round':1,
        'players_ready': 0,
        'points': {},
        'error_counter': 0
      };

      //add player to property
      (rooms[room])['Players'].push([data[0],color,socket.id]);
      (rooms[room])['points'][data[0]] = 0
      console.log(rooms[room].names)
      socket.emit('rules?',(rules) => {
          rooms[room]['Rules'] = []
          rooms[room]['Rules'].push(rules.mode)
          rooms[room]['Rules'].push(rules.rounds)
          rooms[room]['Rules'].push(rules.time)
          rooms[room]['rounds'] = rules.rounds
      })   
    }
     

    //update player list to all players in room
    io.to(room).emit('users', rooms[room])
    callback({
      col: color,
      name: data[0]
    });
  }) 

  socket.on("disconnect", (reason) => {
    current_players -= 1;

    //when user disconnects, remove him from the player list
    for(var i = 0 ; i < (rooms[room]['Players']).length ; i++){
      if((rooms[room]['Players'])[i][0] == player_id[socket.id]){

        //if admin left, give admin to next player
        if(i == 0 && rooms[room]['Players'].length > 1){
          io.to((rooms[room]['Players'])[1][2]).emit('admin')
        }


        (rooms[room]['Players']).splice(i, 1)
        break
      }
    }
    //remove him from name list
    for(var i = 0 ; i < (rooms[room]['names']).length ; i++){
      if((rooms[room]['names'])[i][0] == player_id[socket.id]){
        (rooms[room]['names']).splice(i, 1)
      }
    }

    //if room is empty, delete it
    if(rooms[room]['Players'].length == 0){
      delete rooms[room]
    }
    else{
    //emit disconnection event with player's username and new player list
    io.to(room).emit('player_disconnected', ({username : player_id[socket.id], new_list: (rooms[room]['Players'])}))
    }
  });


  socket.on('start', () => {
    //only host can start the match (person in first position)
    if(socket.id == rooms[room]['Players'][0][2]){
      //to start, minimum of 2 players required
      if(rooms[room]['Players'].length >= 2){
         video = rando(videos_qty)
        rooms[room]['VIDEOS'] = []
        rooms[room]['VIDEOS'].push(video)
        io.to(room).emit('game start', video)
      }
    }
  })

  socket.on('user_guessed', (data) => {
    rooms[room].guesses += 1
    rooms[room].guess_data[data[0]] = [data[1],data[2],data[3],data[4]]
    rooms[room].points[data[0]] += parseInt(data[3]) 
    //format: {playerX: [coord 1, coord 2, points, color]}
    if(data[1] != 0 && data[2] != 0){
    io.to(room).emit('player_guessed', [data[0],(data[5].toFixed(0))])
    }
    if (rooms[room].guesses == rooms[room]['Players'].length){
      io.to(room).emit('all_guessed',rooms[room].guess_data)
      rooms[room].guess_data = {}
      rooms[room].guesses = 0
    }

  })

  socket.on('video_error', () => {
    (rooms[room]).error_counter += 1
    console.log(`error reported, counted: ${(rooms[room]).error_counter}`)
    if((rooms[room]).error_counter >= (rooms[room]['Players'].length/2)){
      console.log('error aknowledged')
      while(rooms[room]['VIDEOS'].includes(video)){
        video =  rando(videos_qty)
        console.log('searching new video')
      }
      console.log('new video found')
      rooms[room]['VIDEOS'].push(video)
      io.to(room).emit('replace_vid', video)
      rooms[room].players_ready = 0
      rooms[room].error_counter = 0
      console.log(`resetting error counter: ${rooms[room].error_counter}`)
    }
  })

  socket.on('player_ready', () => {
    rooms[room].players_ready += 1
    if(rooms[room].players_ready == rooms[room]['Players'].length){
      rooms[room]['current_round'] += 1
      if(rooms[room]['current_round'] <= parseInt(rooms[room]['rounds'])){
        video = rando(videos_qty)
        while(rooms[room]['VIDEOS'].includes(video)){
          video =  rando(videos_qty)
        }
        rooms[room]['VIDEOS'].push(video)
        io.to(room).emit('new_vid', video)
        rooms[room].players_ready = 0
        }
      else{
        io.to(room).emit('end', rooms[room].points)
      }
    }
  })

  socket.on('player_unready', () => {
    rooms[room].players_ready -= 1
  })




});

