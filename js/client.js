var socket = io();

$('#nick-input').focus();

$('#msg-input-form').on('submit', function(){
  socket.emit('chat message', $('#msg-input').val());
  $('#msg-input').val('');
  return false;
});

$('#nickname-form').on('submit', function(){
  socket.emit('set nickname', $('#nick-input').val());
  $('#nickname-form').fadeOut(function(){
    $('#msg-input-form').fadeIn();
    $('#msg-input').focus();
  });
  return false;
});

socket.on('users', function(data){
  if(data.length != 0){
    $('#users').text('');
  }

  data.forEach(function(elem, index, arr){
    $('#users').append($('<li class="user">').text(elem.nick));
  });
});

socket.on('connected', function(data){
  var nick = data.nick;
  var users = data.users;

  $('#users').text('');
  $('#messages').append($('<li class="chat-msg connected">').text(nick));

  users.forEach(function(elem, index, arr){
    $('#users').append($('<li class="user">').text(elem.nick));
  });
});

socket.on('disconnected', function(data){
  var nick = data.nick;
  var users = data.users;

  $('#users').text('');
  $('#messages').append($('<li class="chat-msg disconnected">').text(nick));

  users.forEach(function(elem, index, arr){
    $('#users').append($('<li class="user">').text(elem.nick));
  });
});

socket.on('chat message', function(data){
  var nick = data.nickname;
  var msg = data.message;

  $('.empty-messages').fadeOut();

  var text = '<span class="msg-nick">'+nick+': ';
  text = text+'</span><span class="msg-text">'+msg+'</span>';

  $('#messages').append($('<li class="chat-msg">').html(text));
  $('#messages').scrollTop($('#messages')[0].scrollHeight);
  $('#msg-input').focus();
});