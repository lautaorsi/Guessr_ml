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
var r_colors = ["#CC2A3D", "#9D2ECC", "#CBC52B", "#CB852B", "#3E3E3E", "#2C83CB"]

var scr, vid_index, active_video, active_playlist

const videos_qty = 151




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
  var room = ''
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
    console.log(color)

    //when user joins, join him to existent list or create one (w/ random color) 
    if(room in rooms){
      (rooms[room])['Players'].push([data[0],color,socket.id]);
      (rooms[room])['points'][data[0]] = 0
      console.log('user is not host')
      console.log(`rules are ${rooms[room][['Rules']]}`)
      socket.emit('rules', rooms[room][['Rules']])
    }
    else{
      //create room object within rooms dictionary
      rooms[room] = {
        'Players': [],
        'guesses' : 0,
        'guess_data': {},
        'current_round':1,
        'players_ready': 0,
        'points': {}
      };

      //add player to property
      (rooms[room])['Players'].push([data[0],color,socket.id]);
      (rooms[room])['points'][data[0]] = 0
      socket.emit('rules?',(rules) => {
          console.log('asked for rules')
          rooms[room]['Rules'] = []
          rooms[room]['Rules'].push(rules.mode)
          rooms[room]['Rules'].push(rules.rounds)
          rooms[room]['Rules'].push(rules.time)
          rooms[room]['rounds'] = rules.rounds

          console.log(`added rules to game ${rooms[room]['Rules']}`)
      })   
    }
     

    //update player list to all players in room
    io.to(room).emit('users', rooms[room])
    callback({
      col: color
    });
  }) 

  socket.on("disconnect", (reason) => {
    //when user disconnects, remove him from the player list
    console.log(`${player_id[socket.id]} disconnected`)
    console.log(`players in room ${room}: ${rooms[room]['Players']}`)
    for(var i = 0 ; i < (rooms[room]['Players']).length ; i++){
      console.log(`player ${i}: ${(rooms[room]['Players'])[i]}`)
      if((rooms[room]['Players'])[i][0] == player_id[socket.id]){
        (rooms[room]['Players']).splice(i, 1)
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
        var video = rando(videos_qty)
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
    io.to(room).emit('player_guessed', data[0])
    if (rooms[room].guesses == rooms[room]['Players'].length){
      io.to(room).emit('all_guessed',rooms[room].guess_data)
      rooms[room].guess_data = {}
      rooms[room].guesses = 0
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
    console.log(`players ready = ${rooms[room].players_ready}`)
    rooms[room].players_ready -= 1
  })




});

