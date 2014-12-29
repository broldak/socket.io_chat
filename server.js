var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userList = [];
var userDict = {};

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  nickSet = false;
  console.log('a user connected');

  console.log(userList);

  io.emit('users', userList);

  socket.on('set nickname', function(nickname){
    socket.nickname = nickname;
    nickSet = true;

    userDict[nickname] = nickname;

    userList.push({id: socket.id, nick: socket.nickname});
    io.emit('connected', {nick: socket.nickname +' connected.',
                                        users: userList});
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');

    delete userDict[socket.nickname];
    userList = userList.filter(function(elem){
      return elem.id != socket.id;
    });

    io.emit('disconnected', {nick: socket.nickname +' disconnected.',
                                        users: userList});

    console.log(userDict);

  });

  socket.on('chat message', function(msg){
    io.emit('chat message', {nickname: socket.nickname, 
                             message: msg});
    console.log('message: ' + msg);
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on port 3000');
});