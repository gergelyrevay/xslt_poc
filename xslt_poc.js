var http = require('http');
var url = require('url');
var xslt = require('node_xslt');
var fs = require('fs');

//runs the XSL transform based on the input XSL filename
function sendHTML(req, res){
  var styleFile = decodeURIComponent(req['url'].split('?')[1].split('style=')[1]);
  if (styleFile == null){
    send404(req, res);
  }
  var stylesheet = xslt.readXsltFile(styleFile);
  var data = xslt.readXmlFile('content.xml');
  var responseHtml = xslt.transform(stylesheet, data, []);
  console.log("[] received GET parameter: style=" + styleFile);
  console.log("[] HTML code after transformation: " + responseHtml);
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(responseHtml);
  res.end();
};

//returns a 404 when something goes wrong
function send404(req, res){
  res.writeHead(404, {'Content-Type': 'text/html'});
  res.write('nope');
  res.end();
};

function sendFile(content, res){
  res.writeHead(200, {'Content-Type': 'image/jpeg'});
  res.write(content);
  res.end();
};


//instanciates an HTTP server
var server = http.createServer(function (req, res) {
  console.log(req['url']);
  switch(req['url'].split("?")[0]){
    case '/':
      sendHTML(req, res);
      break;
    case '/ponies.jpg':
      fs.readFile('./ponies.jpg', function(e, content){
        if(e) send404(req, res);
        sendFile(content, res);
      })
      break;
    default:
      send404(req, res);
  }
});

//starts HTTP server on localhost
server.listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');