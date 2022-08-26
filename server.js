var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

http.createServer(function (request, response) { 

    var filePath = './' + url.parse(request.url).pathname;

    var contentType = getContentType(filePath);

    getStringFromFile(request, response, contentType, filePath);

}).listen(3000);
console.log('Servidor escuchando en http://127.0.0.1:3000/');



// ////////////////////////////////
function getContentType(filePath) {
    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.htm': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };    
    return mimeTypes[extname] || 'application/octet-stream';
}

function getStringFromFile(request, response, contentType, filePath) {
    if (filePath == './') {
        filePath = './index.html';
        contentType = 'text/html';
    }
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end('Recurso no encontrado\n');
            }
            else {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}