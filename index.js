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

var scr, vid_index, active_video, active_playlist, interval

const videos_qty = 283

// updatetime()

// function updatetime(){
//   interval = setTimeout(function() {
//     console.log('time_updated')
//     updatetime()
//   }, 120000);
// }





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
let room;

let player_id = {}


//GUIDELINES:

//player dupla ('name', #color)

//rooms = {1roomID: {}
//         2roomID: {}        
//}

//room = {PLAYERS: [player, player, player]
//               VIDEOS: [videoIndex, videoIndex, videoIndex]          (videoID = int)
//}


io.on('connection', (socket) => {
  var video, room_id
  current_players += 1;
  player_count += 1;
  console.log(`current players = ${current_players}`)
  console.log(`overall players = ${player_count}`)
  socket.emit('accepted'); 



  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });


 //user attempting to join sequence
  socket.on('username', (data, callback)=> {
    //add key value pair user id => username
    player_id[socket.id] = data.username;
    //join player to room
    socket.join(data.roomID) ;
    room_id = data.roomID;
    var color = getColor();

  

    //if room exists, check valid username 
    if(room_id in rooms){
      console.log("user joined valid room")

      while(((rooms[room_id])['chosen_usernames']).includes(data.username)){
        data.username = `${data.username}${rando(100)}`;
        
        player_id[socket.id] = data.username;
      }
      socket.emit('rules', room['Rules']);

      room = rooms[room_id]  

      room['is_host'][socket.id] = false;

    }
    
    //if room doesn't exist, create new one
    else{
      console.log("user joined non existent room, creating new one")
      
      //create room object within rooms dictionary
      rooms[room_id] = {
        'Players': [],
        'names': [],
        'chosen_usernames':[],
        'guesses' : 0,
        'guess_data': {},
        'current_round':1,
        'points': {},
        'error_counter': 0,
        'is_host': {},
        'allow_guess': false,
        'is_round_playing': false,
        'Rules' : {},
      };
      
      room = rooms[room_id]  

      socket.emit('rules?',(rules) => {
          room['Rules']['mode'] = rules.mode;
          room['Rules']['rounds'] = (rules.rounds);
          room['Rules']['time'] = (rules.time);
          room['rounds'] = rules.rounds;
      });  
      room['is_host'][socket.id] = true; 
    }

    
    //add player to room
    room['Players'].push({username:data.username,color:color,socketID:socket.id});
    (room['names']).push({socketID:socket.id,username:data.username});
    (room['chosen_usernames']).push(data.username);
    (room)['points'][socket.id] = {username: data.username,points:0};

    io.emit('admin',({username:(room['Players'])[0]['username'], socket:(room['Players'])[0]['socketID']}));
    //update player list to all players in room
    io.to(room_id).emit('users', room['Players'])
    callback({
      col: color,
      name: data.username
    });
    console.log(rooms)
  }) 

  //user disconnection sequence
  socket.on("disconnect", (reason) => {
    console.log('disconnected')
    current_players -= 1;
    //when user disconnects, remove him from the player list
    try{
      var room_players_amnt = (room['Players']).length
      for(var i = 0 ; i < room_players_amnt; i++){
        if((room['Players'])[i]['socketID'] == [socket.id]){
  



          //remove him from room list
          (room['names']).splice(i, 1);
          (room['Players']).splice(i, 1);
          (room['chosen_usernames']).splice(i, 1);
          delete room['points'][socket.id];


          //if admin left, give admin to next player
          if((room)['is_host'][socket.id] && room['Players'].length != 0){
            delete room['is_host'][socket.id];
            io.emit('admin',({username:(room['Players'])[0]['username'], socket:(room['Players'])[0]['socketID']}));
            var new_hst = (room['Players'])[0]['socketID'];
            room['is_host'][new_hst] = true;            
          }


          //if room is empty, delete it
          if(room['Players'].length == 0){
            delete room;
          }
          else{
          //emit disconnection event with player's username and new player list
          io.to(room_id).emit('player_disconnected', ({username : player_id[socket.id], new_list: (room['Players'])}));
          }
          break
        }
      }
    }
    catch(TypeError){
      console.log('no room')
    }
      
      


   



  });


  //game start sequence
  socket.on('start', () => {
    //only host can start the match (person in first position)
    if(socket.id == room['Players'][0].socketID){
      
      //to start, minimum of 2 players required
      if(room['Players'].length >= 2){
        video = rando(videos_qty)

        //add video id to lobby's video list
        room['VIDEOS'] = []
        room['VIDEOS'].push(video)

        //fire game start event with video ID as param
        io.to(room_id).emit('game start', video)
        room['allow_guess'] = true
      }
    }
    room.is_round_playing = true
  })




  //user guessing sequence
  socket.on('user_guessed', (data) => {
    console.log(data)
    //increase guess counter
    room.guesses += 1
    
    //add guess information to room array for later use
    room.guess_data[data.username] = {coords1:data.coords1,coords2:data.coords2,points:data.points,color:data.color}
    
    //add points to user
    room['points'][socket.id].points += parseInt(data.points) 

    //if user guessed on diff coords than 0,0 then they guessed, so notification should show 
    if(data.coords1 != 0 && data.coords2 != 0){
      io.to(room_id).emit('player_guessed', {username:data.username,distance:((data.distance).toFixed(0))})
    }
    //if the guess amount equals the amount of players then all guessed event is triggered
    if (room.guesses == room['Players'].length){
      room.is_round_playing = false

      //fire all guessed event, passing guess data from all players
      io.to(room_id).emit('all_guessed',room.guess_data)
      room['allow_guess'] = false
      
      //restart guess counter and data
      room.guess_data = {}
      room.guesses = 0
    }

  })

  //video error handling
  socket.on('video_error', () => {
    //increase error counter
    (room).error_counter += 1

    //only aknowledge error if more than half the players run into error
    if((room).error_counter >= (room['Players'].length/2)){

      //choose new rand video upon aknowledgment
      while(room['VIDEOS'].includes(video)){
        video =  rando(videos_qty)
      }

      //once new video is found, restart error counters, add new vid index to lobby's video list and fire replacing video event
      room['VIDEOS'].push(video)
      io.to(room_id).emit('replace_vid', video)
      room.players_ready = 0
      room.error_counter = 0
    }
  })



  //Admin ready for next round sequence
  socket.on('new_round', (callback) => {

    //validate user is admin
    if(room['is_host'][socket.id]){
      room.is_round_playing = true
      room['allow_guess'] = true
      //if round counter is less than max rounds set, start new round 
      if(room['current_round'] < parseInt(room['rounds'])){
        console.log(`round: ${room['current_round']}/${parseInt(room['rounds'])}`)
        while(true){
          video = rando(videos_qty)
          if(validateVideo(room['VIDEOS'],video)){
            room['current_round'] += 1
            room['VIDEOS'].push(video)
            io.to(room_id).emit('new_vid', video)
            room.players_ready = 0
            console.log(room[`VIDEOS`])
            break
          }
        }
      }
      else{
        console.log('ending game')
        //if all rounds have been played, end match
        io.to(room_id).emit('end', room.points)
      }
    }
    
  })




});





function validateVideo(list,ind){
  if(list.includes(ind)){
      return false;
  }
  else{
      return true;
  }
}