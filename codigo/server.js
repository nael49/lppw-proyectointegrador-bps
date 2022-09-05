
const express = require ('express');
const exphlb = require('express-handlebars');
const path= require('path');
const methodoverride= require('method-override');
const sesion=require('express-session')


//inicializacion
const app = express();


//configuracion
app.set('port',process.env.PORT||3000);
app.set('views',path.join(__dirname,'handlebars'));
const hbs=exphlb.create({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
})
app.set('view engine','.hbs');
app.engine('.hbs',hbs.engine)

app.set(express.urlencoded({extended: false}));
app.use(methodoverride('_method'));
app.use(sesion({
    secret:'secreto',
    resave:true,
    saveUninitialized:true
}))

//RUTAS /LINKS
    app.use(require('./rutas-links/home.js'));



//Server lanzado
app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'))
});


// ////////////////////////////////
/*function getContentType(filePath) {
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
    if (filePath.startsWith('.//')) {
        filePath = './'+filePath.substr(3);
    }
    if (filePath.endsWith('/')) {
        filePath += 'index.html';
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
*/