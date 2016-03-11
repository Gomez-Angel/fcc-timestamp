var http=require('http');
var fs=require('fs');
var url = require("url");

var server=http.createServer(function(request, response){
    response.writeHead(200, {"Content-Type":"text/plain"});
    var params = url.parse(request.url,true).query;

    console.log(params);	
});
server.listen(3000);