// YOUR CODE HERE:
let app = {};

app.init = function() {

};

let clientData = {
  name: 'Nick'
};

app.send = function(data) {
  //console.log('Data',data);
  $.ajax({
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(data),
    dataType: 'json'
  });
};


