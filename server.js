var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

app.listen(port);

app.get('/listLocations', function (req, res) {
   console.log("listLocations")
   res.end( JSON.stringify("{hello:hello2}"));
   
})

console.log('weather RESTful API server started on: ' + port);