const conect1= require('./modelo_datos_bbdd/conexion_con_bbdd')
const conect2= require('./modelo_datos_bbdd/conexion_sql2')

const authMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        // res.sendStatus(401);
        res.redirect('/sigin');
    }
};
const authGuestMiddleware = (req, res, next) => {
    if (req.session && req.session.user && req.session.puesto) {
        if(req.session.puesto=="RECEPCIONISTA"){
            res.redirect('recepcionista')
        }
        if(req.session.puesto=="GERENTE"){
            res.redirect('gerente')
        }
        if(req.session.puesto=="TECNICO"){
            res.redirect('tecnico')
        }
        if(req.session.puesto=="ADMIN"){
            res.redirect('admin')
        }
        if(req.session.puesto=="ADMINISTRADOR_DE_DEPOSITO"){
            res.redirect('stock')
        }
       ;
    } else {
        next();
    }
};

const authUserMiddleware = async (req, res, next) => {
    if (req.session && req.session.user) {
        console.log("dato de usuario", req.session.user)
        let userLoggedId = req.session.user;
        if (userLoggedId) {
            let userLogged
                let queryStr = `SELECT * FROM usuarios_general WHERE dni = ${userLoggedId}`;
                let rows, fields;
                [rows, fields] =await conect2.query(
                    queryStr,
                );
                if (rows.length > 0) {
                    userLogged= rows[0]
                }

                res.locals.userLogged = userLogged;
                console.log("dato de res.locals", res.locals)
                if(userLogged.puesto=="TECNICO"){
                    userLogged.tecnico=1
                }
                if(userLogged.puesto=="ADMINISTRADOR_DE_DEPOSITO"){
                    userLogged.stock=1
                }
                if(userLogged.puesto=="RECEPCIONISTA"){
                    userLogged.recepcionista=1
                }
                if(userLogged.puesto=="ADMIN"){
                    userLogged.admin=1
                }
                if(userLogged.puesto=="GERENTE"){
                    userLogged.gerente=1
                }
        }
    }
    next();
}




module.exports = {
    authMiddleware,
    authGuestMiddleware,
    authUserMiddleware,
};

