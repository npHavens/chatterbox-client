// YOUR CODE HERE:
let app = {};

app.init = function() {

};
let url = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
let clientData = {
  name: 'Nick'
};

app.send = function(data) {
  //console.log('Data',data);
  $.ajax({
    url: url,
    type: 'POST',
    data: JSON.stringify(data),
    dataType: 'json'
  });
};

//http://docs.parseplatform.org/rest/guide/#queries

// curl -X GET  -H "X-Parse-Application-Id: 72b8e073a4abde10221ce95f38ed1c63bd7f3d6b"  -H "X-Parse-REST-API-Key: cf1ce23a61e2a40702c347b7dc1e0af8c28f6c7a" http://parse.sfm8.hackreactor.com/chatterbox/classes/messages

app.fetch = function() {
  $.ajax({
    type: 'GET',
    url: url,
    success: function(res) {
      console.log(res);
      let data = res.results;
      for (var i = 0; i < data.length; i++) {
        //console.log(data[i])
        $('#chats').append('<div class="chat"><p><b>' + data[i].username + ': </b><span>' + data[i].text + '</span></p>' + '<span><small>' + data[i].createdAt + '</small></span></div>');
      }
    }

  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.renderMessage = function(msgObj) {
  $('#chats').append('<p>' + msgObj.text + '</p>');
};

app.renderRoom = function(room) {
  $('#roomSelect').append('<p>' + room + '</p>');
};






app.fetch();









