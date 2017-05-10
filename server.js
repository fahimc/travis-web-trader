var express = require('express');
var app = express();
app.use(express.static('dist'))
console.log('SERVER RUNNING ON http://localhost:3000'); 
app.listen(3000);
