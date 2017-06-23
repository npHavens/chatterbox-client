
let app = {};

app.init = function() {
  app.fetch();
};

app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';

app.send = function(data) {
  //console.log('Data',data);
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent',data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

//http://docs.parseplatform.org/rest/guide/#queries

// curl -X GET  -H "X-Parse-Application-Id: 72b8e073a4abde10221ce95f38ed1c63bd7f3d6b"  -H "X-Parse-REST-API-Key: cf1ce23a61e2a40702c347b7dc1e0af8c28f6c7a" http://parse.sfm8.hackreactor.com/chatterbox/classes/messages

app.fetch = function() {
  $.ajax({
    type: 'GET',
    url: app.server,
    success: function(data) {

      for (let i = 0; i < data.results.length; i++) {
        //console.log(data.results[i]);
        var text = document.createTextNode(data.results[i].text);
        //console.log(text);
        $('#chats').append(`
          <div class="chat">
            <p style="margin:0;" id="${i}">
              <span class="username">
                ${data.results[i].username}
              </span>
            </p>
            <em>
              <small>
                Message Sent: ${data.results[i].createdAt}
              </small>
            <em>
          </div>
        `);
        $('#' + i).append(text);
      }
    }
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.renderMessage = function(msgObj) {
  $('#chats').append('<p class="username">'+ msgObj.username + ': ' + msgObj.text + '</p>');
};

app.renderRoom = function(room) {
  $('#roomSelect').append('<p>' + room + '</p>');
};

app.handleUsernameClick = function() {
  let name = $(this).text();
  let $users = $('.username');
  //console.log($users.length)

  $users.each(function(index, user) {
    if(user.textContent === name) {
      $(this).addClass('friend');
    }
  });
};

app.handleSubmit = function() {
  let msg = $('#message').val();
  let msgObj = {};
  msgObj.username = 'userJay';
  msgObj.text = msg;
  msgObj.roomname = 'lobby';
  console.log(msg);
  if (msg !== undefined) {
    app.send(msgObj);
  }
};


app.init();


$(document).ready(function() {

  $('form').on('submit', function(e) {
    e.preventDefault();
    app.handleSubmit();
    //let msg = $('#message').val();
    //console.log(msg);
    //app.send(msg);
  });

  // Selects all the friends on click of the username
  $('#chats').on('click', '.username', function() {
    app.handleUsernameClick.call($(this));
  });
});











