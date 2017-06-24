
let app = {};

app.init = function() {
  app.fetch();
};

app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';

app.send = function(data) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent',data);
      //app.fetch();
      $('#chats').load("../index.html");
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

      for (let i = 0; i < data.results.length; i++) {
        //console.log(data.results[i]);
        //var text = document.createTextNode(data.results[i].text);
        let msg = {};
        msg.username = data.results[i].username;
        msg.text = data.results[i].text;
        msg.roomname = data.results[i].roomname;
        msg.createdAt = data.results[i].createdAt;


        //console.log(text);
        // $('#chats').append(`
        //   <div class="chat">
        //     <p style="margin:0;">
        //       <span class="username">
        //         ${data.results[i].username}
        //       </span>
        //     </p>
        //     <em>
        //       <small>
        //         Message Sent: ${data.results[i].createdAt}
        //       </small>
        //     <em>
        //   </div>
        // `);
        // $('p').append(text);
        app.renderMessage(msg);
      }
    }
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.renderMessage = function(msgObj) {
  let $chatEl = $(`<div class="chat">
    <span class="username">  ${msgObj.username} : </span>
    <span class="text"></span>
    <small style="display:block;" class="timeStamp">${msgObj.createdAt}</small>
    </div>`);

  $chatEl.find('.text').text(msgObj.text);
  $('#chats').append($chatEl);
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

app.handleSubmit = function(user) {
  let msg = $('#message').val();
  let msgObj = {};
  msgObj.username = user;
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
    //var url = window.location.href;
    var userName = window.location.search.substring(10);
    //console.log(userName)
    app.handleSubmit(userName);
    //let msg = $('#message').val();
    //console.log(msg);
    //app.send(msg);
  });

  // Selects all the friends on click of the username
  $('#chats').on('click', '.username', function() {
    app.handleUsernameClick.call($(this));
  });
});











