
let app = {};

app.friends = [];

app.roomNames = [];

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
      console.log('chatterbox: Message sent',data);
      app.fetch();
      //$('#chats').load("../index.html");
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
      //console.log(data.results);


      app.clearMessages();
      for (let i = 0; i < data.results.length; i++) {
        let rmName = data.results[i].roomname;
        //console.log(data.results[i].roomname);
        if(app.roomNames.indexOf(rmName) === -1) {
          app.roomNames.push(rmName);
          $('#roomSelect').append("<option value=" + rmName + ">" + rmName + "</option>");
          //console.log(app.roomNames);
        }
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
        if($('#roomSelect :selected').text().toLowerCase() === data.results[i].roomname) {
          //console.log("!!!")
          app.renderMessage(msg);
        }


      }

    }
  });
};

app.clearMessages = function() {
  $('#chats').html('');
  //app.fetch();
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
  $('#roomSelect').append("<option value=" + room + ">" + room + "</option>");
};

app.handleUsernameClick = function() {
  let name = $.trim($(this).text());

  app.friends.push(name);
  //console.log(app.friends)
  let $users = $('.username');
  //console.log($users.length)

  $users.each(function(index, user) {
    //console.log($.trim($(this).text()))
    //console.log($.trim($(this).text()))
    if($.trim($(this).text()) === name) {
      //console.log('matched')
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
  console.log(msg);
  if (msg !== undefined) {
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
    //console.log(app.roomNames)
    app.roomNames.push(newRoom);
    app.renderRoom(newRoom);
  });
});











