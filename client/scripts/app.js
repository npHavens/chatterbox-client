
let app = {friends: [], roomNames: []};

app.init = function() {
  app.fetch();
  setInterval(app.fetch, 1000);
};

app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';

app.send = function(data) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent', data);
      app.fetch();
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    type: 'GET',
    url: app.server + '?limit=100&order=-updatedAt',
    success: function(data) {
      app.clearMessages();
      for (let i = 0; i < data.results.length; i++) {
        let rmName = data.results[i].roomname;

        if (app.roomNames.indexOf(rmName) === -1) {
          app.renderRoom(rmName);
        }

        let msg = {};
        msg.username = data.results[i].username;
        msg.text = data.results[i].text;
        msg.roomname = data.results[i].roomname;
        msg.createdAt = data.results[i].createdAt;

        if ($('#roomSelect :selected').text().toLowerCase() === msg.roomname) {
          app.renderMessage(msg);
        }
      }
    }
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.renderMessage = function(msgObj) {
  let $chatEl = $(`<div class="chat">
    <span class="username">  ${msgObj.username}</span>
    <span class="text"></span>
    <span style="display:block;" class="room">${msgObj.roomname}</span>
    <small style="display:block;" class="timeStamp"> ${msgObj.createdAt}</small>
    </div>`);

  $chatEl.find('.text').text(': ' + msgObj.text);
  $('#chats').append($chatEl);

  app.friends.forEach(function(friend) {
    if (friend === msgObj.username) {
      $chatEl.find('.username').addClass('friend').next().addClass('bold');
    }
  });
};

app.renderRoom = function(room) {
  app.roomNames.push(room);
  $('#roomSelect').append('<option value=' + room + '>' + room + '</option>');
};

app.handleUsernameClick = function() {
  let name = $.trim($(this).text());
  app.friends.push(name);
  let $users = $('.username');

  $users.each(function() {
    if ($.trim($(this).text()) === name) {
      $(this).addClass('friend');
      $(this).next().addClass('bold');
    }

  });
};

app.handleSubmit = function(user) {
  let msg = $('#message').val();
  let msgObj = {};
  msgObj.username = user;
  msgObj.text = msg;
  msgObj.roomname = $('#roomSelect :selected').text().toLowerCase();

  if (msg) {
    app.send(msgObj);
  }
};


app.init();


$(document).ready(function() {
  $('#msgForm').on('submit', function(e) {
    e.preventDefault();
    var userName = window.location.search.substring(10);
    app.handleSubmit(userName);
    $('#message').val('');
  });

  // Selects all the friends on click of the username
  $('#chats').on('click', '.username', function() {
    app.handleUsernameClick.call($(this));
  });

  $('#roomSelect').on('change', function() {
    app.fetch();
  });

  $('#roomForm').on('submit', function(e) {
    e.preventDefault();
    let newRoom = $('#newRoomName').val();
    app.renderRoom(newRoom);
  });
});











