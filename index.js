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

const videos_qty = 176





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


 //user attempting to join sequence
  socket.on('username', (data, callback)=> {
    //add key value pair user id => username
    player_id[socket.id] = data.username
    //join player to room
    socket.join(data.roomID) 
    room = data.roomID
    var color = getColor()


    //if room exists, add him 
    if(room in rooms){
      while(((rooms[room])['names']).includes(data.username)){
        data.username = `${data.username}${rando(100)}`
        player_id[socket.id] = data.username
      }
      socket.emit('rules', rooms[room][['Rules']]);
    }
    
    //if room doesn't exist, create new one
    else{
      //create room object within rooms dictionary
      rooms[room] = {
        'Players': [],
        'names': [],
        'guesses' : 0,
        'guess_data': {},
        'current_round':1,
        'players_ready': 0,
        'players_ready_list': [],
        'points': {},
        'error_counter': 0,
      };

      socket.emit('rules?',(rules) => {
          rooms[room]['Rules'] = {}
          rooms[room]['Rules']['mode'] = rules.mode
          rooms[room]['Rules']['rounds'] = (rules.rounds)
          rooms[room]['Rules']['time'] = (rules.time)
          rooms[room]['rounds'] = rules.rounds
      })   
    }

    
    //add player to room
    (rooms[room])['Players'].push({username:data.username,color:color,socketID:socket.id});
    ((rooms[room])['names']).push({socketID:socket.id,username:data.username});
    (rooms[room])['points'][socket.id] = {username: data.username,points:0};


    //update player list to all players in room
    io.to(room).emit('users', rooms[room])
    callback({
      col: color,
      name: data.username
    });
  }) 

  //user disconnection sequence
  socket.on("disconnect", (reason) => {
    current_players -= 1;
    //when user disconnects, remove him from the player list
    for(var i = 0 ; i < (rooms[room]['Players']).length ; i++){
      if((rooms[room]['Players'])[i]['socketID'] == [socket.id]){

        //remove him from name list
        (rooms[room]['names']).splice(i, 1)

        //if admin left, give admin to next player
        if(i == 0 && rooms[room]['Players'].length > 1){
          io.to((rooms[room]['Players'])[1]['socketID']).emit('admin')
        }

        //remove from player list
        (rooms[room]['Players']).splice(i, 1)
        break
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


  //game start sequence
  socket.on('start', () => {
    //only host can start the match (person in first position)
    if(socket.id == rooms[room]['Players'][0].socketID){
      
      //to start, minimum of 2 players required
      if(rooms[room]['Players'].length >= 2){
        video = rando(videos_qty)

        //add video id to lobby's video list
        rooms[room]['VIDEOS'] = []
        rooms[room]['VIDEOS'].push(video)

        //fire game start event with video ID as param
        io.to(room).emit('game start', video)
      }
    }
  })




  //user guessing sequence
  socket.on('user_guessed', (data) => {
    //increase guess counter
    rooms[room].guesses += 1
    
    //add guess information to room array for later use
    rooms[room].guess_data[data.username] = {coords1:data.coords1,coords2:data.coords2,points:data.points,color:data.color}
    
    //add points to user
    rooms[room]['points'][socket.id].points += parseInt(data.points) 

    //if user guessed on diff coords than 0,0 then they guessed, so notification should show 
    if(data.coords1 != 0 && data.coords2 != 0){
    io.except(socket.id).to(room).emit('player_guessed', {username:data.username,distance:((data.distance).toFixed(0))})
    }
    //if the guess amount equals the amount of players then all guessed event is triggered
    if (rooms[room].guesses == rooms[room]['Players'].length){

      //fire all guessed event, passing guess data from all players
      io.to(room).emit('all_guessed',rooms[room].guess_data)
      
      //restart guess counter and data
      rooms[room].guess_data = {}
      rooms[room].guesses = 0
    }

  })

  //video error handling
  socket.on('video_error', () => {
    //increase error counter
    (rooms[room]).error_counter += 1
    console.log(`error reported, counted: ${(rooms[room]).error_counter}`)

    //only aknowledge error if more than half the players run into error
    if((rooms[room]).error_counter >= (rooms[room]['Players'].length/2)){
      console.log('error aknowledged')

      //choose new rand video upon aknowledgment
      while(rooms[room]['VIDEOS'].includes(video)){
        video =  rando(videos_qty)
        console.log('searching new video')
      }

      //once new video is found, restart error counters, add new vid index to lobby's video list and fire replacing video event
      console.log(`new video found, index ${video}`)
      rooms[room]['VIDEOS'].push(video)
      io.to(room).emit('replace_vid', video)
      rooms[room].players_ready = 0
      rooms[room].error_counter = 0
      console.log(`resetting error counter: ${rooms[room].error_counter}`)
    }
  })

  //player ready for next round sequence
  socket.on('player_ready', (callback) => {
    //update player's ready counter
    rooms[room].players_ready += 1
    //fire callback with amount of players ready for next round
    callback({
      users_ready: rooms[room].players_ready,
    });
    console.log('player ready')

    //if players ready equals players in room, go to next round
    if(rooms[room].players_ready == rooms[room]['Players'].length){
      rooms[room]['current_round'] += 1
      
      //if round counter is less than max rounds set, start new round 
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
        //if all rounds have been played, end match
        io.to(room).emit('end', rooms[room].points)
      }
    }
  })



  //if player cancels ready, decrease counter by 1 (obviously)
  socket.on('player_unready', () => {
    
    rooms[room].players_ready -= 1
    console.log('player_unready')
  })




});

