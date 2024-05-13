

const socket = io()

console.log("linked")

var start_id, player_list, color

console.log(admin)

function game(){
    if(players.length < 2){
        alert('No hay suficientes jugadores!')
    }
    else{
        socket.emit('start')
    }
    
}

var players = []

function func(list,cond){
    //if cond == True => initial board w/ marker colors
    //if cond == False => final board w/ scores
    players = list
    document.querySelectorAll('.player').forEach(e => e.remove());
    //when called, func will delete the html content and create a new one with the updated list
    if(cond){
        for(var element = 0; element < list.length; element++ ){
            var x = document.createElement('div');
            x.classList.add('player', `lobby${list[element].username}`);
            x.innerHTML = `${list[element].username} <i class="fa-solid fa-location-dot right marker ${list[element].username} " style="color: ${list[element].color};"></i>`;
            document.getElementById("players").appendChild(x);
        };   
        document.getElementsByClassName('player')[0].innerHTML += `<i class="fa-solid fa-crown fa-lg" style="color: #FFD43B; margin-left:3%;text-shadow: 0 0 5px black;"></i>`
    }
    else{
        document.getElementById('title').innerHTML = 'Scoreboard'
        //create final scoreboard with all players
        for(let element in list){
            var x = document.createElement('div');
            x.classList.add('player', `end${element}`);
            x.innerHTML = `${list[element].username} <p class="right score">${list[element].points}</p>`;
            document.getElementById("players").appendChild(x);
        }

        document.getElementsByClassName(`player`)[0].classList.add('winner', 'p1')
        document.getElementsByClassName(`player`)[1].classList.add('winner','p2')
        if((document.getElementsByClassName('player')).length >= 3){
            document.getElementsByClassName(`player`)[2].classList.add('winner','p3')
        }

        //paint gold
        document.getElementsByClassName(`player`)[0].style.backgroundColor = '#ffd700'
        //paint silver
        document.getElementsByClassName(`player`)[1].style.backgroundColor = '#c0c0c0'
        if((document.getElementsByClassName('player')).length >= 3){
            //paint copper
            document.getElementsByClassName(`player`)[2].style.backgroundColor = '#b87333'
        }

        

    
}
}


socket.on('users', (users) => {
    //add user to html list and array on new user connection
    func(users, true)
    player_list = users
})




if(room_id == 1){
    room_id = Math.random().toString(36).substring(2, 13); 
}




socket.on('accepted',(rules) => {
    
    
    try{
        document.getElementById('room_id').innerHTML = `ID de Sala : ${room_id}`
    }
    catch(TypeError){
        window.location.href = 'index.html'
    }


    //emit username on connection
    socket.emit('username', {username:username,roomID:room_id.replace(/\s/g, "")}, callback => {
        color = callback.col
        username = callback.name
    })
})
socket.on('rules?', response => {
    document.getElementById('start_button').style.display = 'block'
    response({
        mode: localStorage.getItem('mode'), 
        rounds: localStorage.getItem('rounds'), 
        time :localStorage.getItem('time')
    })
})

socket.on('rules', data => {
    localStorage.setItem('mode', data.mode)
    localStorage.setItem('rounds', data.rounds)
    localStorage.setItem('time', data.time)
})
socket.on("session", ({ sessionID, userID }) => {
// attach the session ID to the next reconnection attempts
socket.auth = { sessionID };
// store it in the localStorage
localStorage.setItem("sessionID", sessionID);
// save the ID of the user
socket.userID = userID;
});

socket.on('player_disconnected', (data) =>{
    console.log('disconneciton aknowledged')
    //rebuild player list (delete html elements and update list)
    document.querySelectorAll(`.lobby${data['username']}`).forEach(e => e.remove());
    
    //update client side player list
    players = data['new_list']
})

socket.on('game start', (id) => {
    start_id = id
    document.getElementsByClassName('pre')[0].style.display = 'none'
    document.getElementsByClassName('post')[0].style.display = 'block'

    const table = document.getElementById('scoretable')
    for(var e in players){
    var row = table.insertRow(1)
    var cell1 = row.insertCell(0)
    cell1.classList.add(`username`,`scoreboard${players[e].username}`)
    var cell2 = row.insertCell(1)
    cell2.classList.add('points')
    cell1.innerHTML = players[e].username
    cell2.innerHTML = 0
    }

    var script = document.createElement('script');
    script.src = '../main_ml.js';
    document.head.appendChild(script)
    
})


socket.on('admin', (data) => {
    if(socket.id == data.socket){
        console.log('im admin')
        admin = true
        document.getElementById('start_button').style.display = 'block'
    }
    
    ((document.getElementsByClassName(`lobby${data.username}`))[0]).innerHTML += `<i class="fa-solid fa-crown fa-lg" style="color: #FFD43B; margin-left:3%;text-shadow: 0 0 5px black;"></i>`
})



//TESTING     


//-------------bots won't actually join the game-------------//
function bot(n){
    for(var i = 0; i < n; i++){
    var usern = `Player${i}`
    var x = document.createElement('div');
    x.classList.add('player', usern);
    x.innerHTML = `${usern} <i class="fa-solid fa-location-dot right marker ${usern} " style="color: #005eff;"></i>`;
    document.getElementById("players").appendChild(x);
    }
    return(`${n} bots added`)
}

