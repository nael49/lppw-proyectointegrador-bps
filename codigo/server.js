
const express = require ('express');
const exphlb = require('express-handlebars');
const path= require('path');
const methodoverride= require('method-override');
const sesion=require('express-session')
const flash=require('connect-flash');
const { reset } = require('nodemon');
const cookieparser=require('cookie-parser')
const { authUserMiddleware } = require('./auth');

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

app.use(express.urlencoded({extended: false}));
app.use(express.text())
app.use(express.json())

app.use(methodoverride('_method'));
app.use(cookieparser('secret'))
app.use(sesion({
    cookie: { maxAge: 600000 },
    secret:'secreto',
    resave:true,
    saveUninitialized:true,
}))

app.use(flash())
app.use(authUserMiddleware);
app.use((req, res, next) => {
    res.locals.exito_msg = req.flash("exito_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
  });

//RUTAS /LINKS
    app.use(require('./rutas-links/home.js'));

//archivos publicos para el front
app.use(express.static(path.join(__dirname,'publico')))

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