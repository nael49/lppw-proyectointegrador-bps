const bodyParser = require('body-parser');
const { Router } = require('express');
const express=require('express');
const router = express.Router();
const { authGuestMiddleware, authMiddleware } = require('../auth');

const conect_sql = require('../modelo_datos_bbdd/conexion_con_bbdd')
const {crear_repuesto, ingresar_stock, validar_repuerto_id, mostrar_ordenes_espera, mostrar_mis_ordenes, validar_orden_id, traer_orden_id, mostrar_repuesto_id,
crear_marca, buscar_marca_nombre, buscar_modelo_nombre, crear_modelo, validar_marca_nombre, validar_modelo_nombre, select_from, modificar_repuesto_id, insert, 
mostrar_cliente_id, validar_cliente_id, update_cliente, validar_usuario_id, mostrar_usuario_id, update_usuario, login, tomar_orden, deshabilitar_usuario, 
mostrar_ordenes_para_retirar, mostrar_repuestos_marca_modelo, mostrar_repuestos_con_marca_modelo_stock,buscar_repuestos_marca_modelo_por_id,graficos_tipo_equipo_mes} = require('../modelo_datos_bbdd/operaciones')


router.get('/gerente',authMiddleware,(req,res)=>{
    res.render('layouts/gerente_index')
})

router.get('/recepcionista',authMiddleware,async(req,res)=>{
    console.log(res.locals)
    await mostrar_ordenes_para_retirar(conect_sql,(respuesta)=>{
        res.render('layouts/index-recepcionista',{respuesta})
    })
})

router.get('/clientes',authMiddleware,(req,res)=>{
    select_from(conect_sql,"clientes",(respuesta)=>{
        res.render('layouts/lista_clientes',{respuesta})
    })
})

router.get('/clientes/mod/:id',(req,res)=>{ //teminar
    if(!req.params.id){

    }
    else{
        dni_int=parseInt(req.params.id)
        mostrar_cliente_id(conect_sql,dni_int,(respuesta=>{
            res.render('layouts/modificar_cliente',{respuesta})
        }))
    }
})

router.post('/clientes/mod/:id',async(req,res)=>{
    const{dni_cliente,nombrecompleto,celular,localidad,direccion,email}=req.body
    let error_orden=[]
    console.log(dni_cliente)
    console.log(req.params.id)
    if(!dni_cliente ||  parseInt(dni_cliente)!= 'number'){
        error_orden.push({text:'Error en el DNI'})
    }
    if(!nombrecompleto){
        error_orden.push({text:'Error en el Nombre'})
    }
    if(!celular){
        error_orden.push({text:'Error en el numero de celular'})
    }
    if(!localidad){
        error_orden.push({text:'Error en la Localidad'})
    }
    if(!direccion){
        error_orden.push({text:'Error en la direccion'})
    }
    if(!email){
        error_orden.push({text:'Eroor en el Email'})
    }
    if(error_orden>0){
        if(!dni_cliente ||  parseInt(dni_cliente)!= 'number'){
            req.flash('exito_msg','no existe el cliente')
            res.redirect('/clientes')
        }
        else{
            res.render(`/clientes/mod/:${dni_cliente}`,{error_orden})
        }
        
    }
    else{
        let dni_int=parseInt(dni_cliente)
        let celular_int=parseInt(celular)

        let cliente={
            dni:dni_int,
            nombrecompleto:nombrecompleto,
            celular:celular_int,
            direccion:direccion,
            email:email,
            localidad:localidad
        }
        console.log(cliente)

        await validar_cliente_id(conect_sql,cliente.dni,(respuesta)=>{
            if(respuesta){
                try {
                    update_cliente(conect_sql,cliente)
                    req.flash('exito_msg','Cliente Modificado con exito')
                    res.redirect('/clientes')
                } catch (error) {
                    req.flash('exito_msg','Error al crear cliente')
                    res.redirect('/clientes')
                }
            }
            else{
                req.flash('exito_msg','no existe el cliente')
                res.redirect('/clientes')
            }
        })
    }
    
})

router.get('/crear_orden',authMiddleware, async(req,res)=>{
    await select_from(conect_sql,"tipo_equipo",(respuesta)=>{
        res.render('layouts/crear_orden_trabajo',{respuesta})
    })
    console.log(res.locals)
    console.log(req.session)
    
})

router.post('/crear_orden',authMiddleware,async(req,res)=>{ 
    console.log(req.body)
    const { nombrecompleto , dni, localidad, direccion, celular, email, tipo_equipo, descripcion_falla, datos_importantes,pago } = req.body;
    const error_orden=[]


    if(!pago){
        error_orden.push({text:'ingrese una seña o en su defecto "0"'})
    }
    if(!nombrecompleto){
        error_orden.push({text:'ingrese nombre completo'})
    }
    if(!dni){
        error_orden.push({text:'ingrese el dni'})
    }
    if(!localidad){
        error_orden.push({text:'ingrese localidad'})
    }
    if(!email){
        error_orden.push({text:'ingrese email'})
    }
    if(!direccion){
        error_orden.push({text:'ingrese direccion'})
    }
    if(!celular){
        error_orden.push({text:'ingrese numero de celular'})
    }
    if(!tipo_equipo){
        error_orden.push({text:'ingrese tipo de equipo'})
    }

    if(!descripcion_falla){
        error_orden.push({text:'ingrese descripcion de la falla'})
    }
    if(!datos_importantes){
        error_orden.push({text:'ingrese datos importantes'})
    }

    if(error_orden.length>0){
        await select_from(conect_sql,"tipo_equipo",(respuesta)=>{
            res.render('layouts/crear_orden_trabajo',{respuesta,error_orden})
        })
    }

    else{
        let tipo_equipo_int=parseInt(tipo_equipo)
        let celular_int=parseInt(celular)
        let dni_int =parseInt(dni)
        let pago_int =parseInt(pago)

        let cliente={
            dni : dni_int,
            nombrecompleto: nombrecompleto,
            celular : celular_int,
            direccion:direccion,
            email:email,
            localidad:localidad
        }
        let orden_trabajo={  //por ahora con esto sirve
            fk_cliente:dni_int,
            descripcion_falla:descripcion_falla,
            fk_tipo_equipo:tipo_equipo_int,
            fk_recepcionista:req.session.user,
            datos_importantes:datos_importantes,
            estado:2,
            fk_tipo_equipo:tipo_equipo_int,
            pago:pago_int
        }

        try {
            let query=`SELECT COUNT(dni) AS ID FROM clientes WHERE dni =${cliente.dni}`
            await conect_sql.query(query,function(err, dato){           //---------------Revisa si ya existe el dni
                if(err)throw err;
                if(dato[0].ID!=0){ //si ya xiste
                    req.flash('exito_msg','El cliente ya existe')
                    re.redirect('/crear_orden_cliente_existe')
                    return
                }
                else{ //si el cliente no existe
                    try {
                        insert(conect_sql,"clientes",cliente)
                        insert(conect_sql,"orden_trabajo",orden_trabajo)
                        req.flash('exito_msg','Orden de Trabajo creada con Exito')
                        res.redirect('/recepcionista')
                    } 
                    catch (error) {
                        
                    }
                    
                };
            })
        }
        catch (err) {
            console.log("huno un error")
            throw err;
        }

    }
})

router.get('/crear_orden_cliente_existe',authMiddleware,async(req,res)=>{
    await select_from(conect_sql,"tipo_equipo",(respuesta)=>{
        select_from(conect_sql,"clientes",(datos_dni)=>{
            res.render('layouts/crear_orden_trabajo_cliente_existe',{respuesta,datos_dni})
        })
    })
})

router.post('/crear_orden_cliente_existe',authMiddleware,async(req,res)=>{  
    const{dni,descripcion_falla,tipo_equipo,pago,datos_importantes}= req.body
    const error_orden=[]
    if(!datos_importantes){
        error_orden.push({text:'Ingrese los datos del equipo'})
    }
    if(!pago || isNaN(parseInt(tipo_equipo))){
        error_orden.push({text:'ingrese una seña o en su defecto "0"'})
    }
    if(!tipo_equipo || isNaN(parseInt(tipo_equipo))){
        error_orden.push({text:'Tipo de equipo incorrecto'})
    }
    if(!dni || isNaN(parseInt(dni))){
        error_orden.push({text:'Dni incorrecto'})
    }

    if(!descripcion_falla){
        error_orden.push({text:'falta Descripcion'})
    }

    if(error_orden.length>0){
        req.render('layouts/crear_orden_trabajo_cliente_existe',{error_orden})
    }
    if(error_orden.length==0){
        let int_dni=parseInt(dni)
        let tipo_equipo_int=parseInt(tipo_equipo)
        let int_pago=parseInt(pago)

        let orden_trabajo={ //esquema para enviar a la base de datos
            estado: 2,
            descripcion_falla: descripcion_falla,
            fk_cliente: int_dni,
            fk_tipo_equipo:tipo_equipo_int,
            fk_recepcionista:req.session.user,
            pago:int_pago,
            datos_importantes:datos_importantes
        }
        
        try {
            await validar_cliente_id(conect_sql,dni,(respuesta)=>{
                if (respuesta) {
                    conect_sql.query(`INSERT INTO orden_trabajo set ?`,[orden_trabajo])
                    req.flash('exito_msg','Orden de Trabajo Creada')
                    res.redirect('/recepcionista')
                } else {
                    req.flash('exito_msg','El cliente no existe')
                    res.redirect('/crear_orden')
                }
            })
                
        } catch (err) {
            if(err)throw err;
            res.redirect('/recepcionista')
        }
    }
    
})




router.get('/sigin',authGuestMiddleware,(req,res)=>{
    res.render('layouts/sigin')
})

router.post('/sigin',authGuestMiddleware,async(req,res)=>{ 
    const{usuario,contraseña}=req.body
    let error_orden=[]
    if(!usuario || isNaN(parseInt(usuario))){
        error_orden.push({text:'Ingrese usuario'})
    }
    if(!contraseña || isNaN(parseInt(contraseña))){
        error_orden.push({text:'Ingrese contrseña'})
    }
    if(error_orden.length>0){
        res.render('layouts/sigin',{error_orden})
    }
    if(error_orden.length==0){ 
        let int_usuario=parseInt(usuario)
        let int_pass=parseInt(contraseña)

        let nuevo_usuario={
            usuario:int_usuario,
            contraseña:int_pass
        }
    
        await login(conect_sql,nuevo_usuario,(respuesta)=>{
            if(respuesta[0]){
                console.log('existe el usuario')
                if(respuesta[0].dni==nuevo_usuario.usuario){
                    req.session.user = nuevo_usuario.usuario;
                    req.session.puesto=respuesta[0].puesto
                    req.session.nombre=respuesta[0].nombrecompleto
                    console.log("sesion creada", req.session)
                    res.redirect('/sigin')
                    return
                }
                else{
                    req.flash('exito_msg','Usuario y/o contraseña invalido')
                    res.redirect('/sigin')
                    return
                }
            }
            else{
                console.log('no existe el usuario')
                req.flash('exito_msg','Usuario y/o contraseña invalido')
                res.redirect('/sigin')
                return
            }
        })
    }
})

router.get('/logout',authMiddleware, (req, res) => {
    req.session.destroy();
    res.redirect('/sigin');
});

router.get('/tecnico',authMiddleware, async(req,res)=>{

    console.log("datos globales: ",res.locals.userLogged)


    await mostrar_ordenes_espera(conect_sql,(respuesta)=>{
        if(respuesta[0]==undefined){
            let error_orden=[]
            error_orden.push({text:"No hay mas Ordenes en Espera"})
            res.render('layouts/ordenes_trabajo_lista',{error_orden})
        }
        else{
            respuesta[0].fecha_creacion=(respuesta[0].fecha_creacion).toString().substring(0,10) //convierte la fecha y hora en solo fecha para mostrar
            console.log(respuesta)
            let user={
                admin:1,
            }
            res.render('layouts/ordenes_trabajo_lista',{respuesta})
        }
    })
})

router.get('/tecnico/add/:id',authMiddleware, async(req,res)=>{  
    let id
    if (req.params.id) {
        if(!isNaN(parseInt(req.params.id))){
            id=parseInt(req.params.id)
        }
        else{
            req.flash('exito_msg','Orden Invalida')
            res.redirect('/tecnico')
            return
        }
        
    } 
    else {
        req.flash('exito_msg','Orden Invalida')
        res.redirect('/tecnico')
        return
    }

    let dato={
        id_orden:id
    }
    await validar_orden_id(conect_sql,dato.id_orden,(respuesta)=>{
        if(respuesta){
           
            if(res.locals.userLogged.puesto=="TECNICO"){
                tomar_orden(conect_sql,res.locals.userLogged.dni,dato.id_orden,(respuesta2)=>{
                    console.log(respuesta2)
                    req.flash('exito_msg','has tomado esta Orden')
                    res.redirect('/tecnico')
                })
            }
            else{
                req.flash('exito_msg','Usuario no es Tecnico')
                res.redirect('/tecnico')
            }
        }
        else{
            req.flash('exito_msg','Orden Invalida')
            res.redirect('/tecnico')
        }
    })
})


router.get('/tecnico/misordenes',authMiddleware,async(req,res)=>{
    try {
        console.log(req.session.user) 
        await mostrar_mis_ordenes(conect_sql,req.session.user,(respuesta)=>{ 
            console.log("respuesta: ",respuesta) 
            if(respuesta==undefined){        //si no tiene ordenes asignadas
                req.flash('exito_msg','No Tienes Ordenes Asignadas')
                res.redirect('/tecnico/misordenes')
            }
            else{
                for (let index = 0; index < respuesta.length; index++) {
                    respuesta[index].fecha_creacion=(respuesta[index].fecha_creacion).toString().substring(0,10) //convierte la fecha y hora en solo fecha para mostrar
                    
                }
                res.render('layouts/mis_ordenes_trabajo',{respuesta})
            }  
        })
    } 
    catch (error) {
        res.send('Error en la BBDD')
    }
})

router.get('/tecnico/orden/:id',authMiddleware,async(req,res)=>{ 
    let lista_estados=["Cancelado","En Espera","En Revision","En Reparacion","Reparado","Finalizado"]        
    let listfilter
    let lista_enviar=[]
    if (isNaN(parseInt(req.params.id))) {
        req.flash('exito_msg','Orden invalida')
        res.redirect('/tecnico')
    } 
    
    else {
        let id_int=parseInt(req.params.id)
        await validar_orden_id(conect_sql,id_int,(resultado)=>{
            if(resultado){
                mostrar_repuestos_marca_modelo(conect_sql,(datos)=>{
                    traer_orden_id(conect_sql,id_int,(respuesta)=>{
                        for (let index = 0; index < lista_estados.length; index++) {
                            if(respuesta[0].nombre==lista_estados[index]){
                                listfilter= lista_estados.filter((item) => item !== respuesta[0].nombre)

                                for (let index = 0; index < listfilter.length; index++) {
                                    lista_enviar.push({estado:listfilter[index]})
                                    
                                }
                            }
                        }
                        buscar_repuestos_marca_modelo_por_id(conect_sql,id_int,(respuesta2)=>{
                            console.log(respuesta2)
                            res.render('layouts/modificar_orden',{respuesta,datos,lista_enviar,respuesta2})
                        })
                    })
                })
            }
            else{
                req.flash('exito_msg','Orden invalida')
                res.redirect('/tecnico')
            }
        })
    }
})

router.post('/tecnico/orden/:id',authMiddleware,async(req,res)=>{ //--------------------------------------------casi
    let id=req.params.id
    let lista_estados=["En Espera","En Revision","En Reparacion","Reparado","Finalizado"]  
    const{repuesto,estado,datos_op,id_orden}=req.body
    let error_orden=[]
    let validador=true

    console.log("datos de modificar orden",req.body)
    console.log("tipo de dato repuesto", typeof repuesto)

    if(!id_orden || isNaN(parseInt(id_orden))){
        error_orden.push({text:"error al elegir repuestos"})
    }
    
    if(estado==lista_estados[3]){                           //si el equipo ya termino de reparar
        validador=false
        if(error_orden.length>0){
            req.flash("exito_msg","Error en repuestos o el estado")
            res.redirect(`/tecnico/misordenes`)
            return
        }
        if(error_orden.length==0){
            try {
                let query=`UPDATE orden_trabajo SET  datos_importantes="${datos_op}",estado=5,hora_fin=NOW() WHERE id_orden=${id}`        
                conect_sql.query(query)
                req.flash("exito_msg","La orden de trabajo se envio correctamente")
                res.redirect(`/tecnico/misordenes`)
                return
            } 
            catch (error) {
                req.flash("exito_msg","Error en la orden de trabajo")
                res.redirect(`/tecnico/misordenes`)
                return
            }  
        }
    }
    if (estado==lista_estados[0] ) {                          //si el tecnico se quiere desvincular de una orden
        validador=false
        if(error_orden.length>0){
            req.flash("exito_msg","Error en repuestos o el estado")
            res.redirect(`/tecnico/misordenes`)
            return
        }
        if(error_orden.length==0){
            try {
                let query=`UPDATE orden_trabajo SET estado=2,datos_importantes=${datos_op},hora_inicio=NULL,fk_tecnico=NULL WHERE id_orden=${id}`
                await conect_sql.query(query)
                req.flash("exito_msg","Se ha desvinculado de la orden de trabajo con exito")
                res.redirect(`/tecnico/misordenes`)
                return
            } 
            catch (error) {
                req.flash("exito_msg","Error en la orden de trabajo")
                res.redirect(`/tecnico/misordenes`)
                return
            }  
        }
    }
    if(validador){                   //si el equipo todavia necesita cambios
        if(!repuesto && estado==lista_estados[2]){
            error_orden.push({text:"error al elegir repuestos "})
        }
        if(!estado || !lista_estados.includes(estado)){
            error_orden.push({text:"error al elegir estado"})
        }
    
        if(error_orden.length>0){
            req.flash("exito_msg","Error en repuestos o el estado")
            req.flash("exito_msg","Solo al terminar la reparacion se acepta el recuadro 'repuestos' vacio")
            res.redirect(`/tecnico/orden/${id}`)
            return
        }
        if(error_orden.length==0){
            await validar_orden_id(conect_sql,id,(respuesta)=>{
                if(respuesta){
                    if(typeof repuesto =='object'){                 //si repuestos trae varias cosas
                        
                        for (let index = 0; index < repuesto.length; index++) {
                            try {

                                let query=`INSERT INTO repuestos_orden (fk_orden,fk_repuesto) VALUES (${id_orden},${repuesto[index]})`
                                conect_sql.query(query)

                                let datos_sql={
                                    cantidad:0,
                                    id_repuesto:parseInt(id_orden)
                                }  
                                ingresar_stock(conect_sql,datos_sql,"resta") 
                            } 
                            catch (error) {
                                req.flash("exito_msg","Error al cargar los repuestos!!! Contacte al Programador")
                                 res.redirect(`/tecnico/misordenes`)
                            }   
                        }
                    }
                    if(typeof repuesto =='string'){        //repuesto solo tiene un repuesto
                        if(parseInt(repuesto)>0){
                            let datos_insert={
                                fk_orden:parseInt(id_orden),
                                fk_repuesto:parseInt(repuesto)
                            }         
                            insert(conect_sql,"repuestos_orden",datos_insert)
    
                            let datos_stock={
                                cantidad:0,
                                id_repuesto:parseInt(id_orden)
                            }  
                            ingresar_stock(conect_sql,datos_stock,"resta") 
                        }
                        
                    }
                    let query2=`UPDATE orden_trabajo SET estado = 4,datos_importantes=${datos_op} WHERE id_orden=${id_orden}`
                    conect_sql.query(query2)
                    req.flash("exito_msg","La orden de trabajo fue actualizada correctamente")
                    res.redirect(`/tecnico/misordenes`)
                }
                else{
                    req.flash("exito_msg","La orden de trabajo no existe")
                    res.redirect(`/tecnico/misordenes`)
                }
            })
            
        }
    }
})

router.get('/admin',authMiddleware,async (req,res)=>{
    select_from(conect_sql,"usuarios_general",(respuesta)=>{
        
        for (let index = 0; index < respuesta.length; index++) {
            respuesta[index].fecha_inicio=respuesta[index].fecha_inicio.substring(0, 10);
                if(respuesta[index].estado==1){
                    respuesta[index].estado="Habilitado"
                }
                else{
                    respuesta[index].estado="Desabilitado"
                }
            console.log(respuesta[index].fecha_inicio)
        }

        res.render('layouts/lista_usuario',{respuesta})
    })
})

router.get('/admin/crear_usuario',authMiddleware,(req,res)=>{
    res.render('layouts/crear_usuario')
})

router.post('/admin/crear_usuario',authMiddleware, async(req,res)=>{
    console.log(req.body)
    const {puesto,direccion,localidad,DNI,nombreyapellido,fecha_ingreso,numerocelular,email,pass}= req.body

    const error_orden=[]

    if(!pass){
        error_orden.push({text:'Contraseña incorrecta'})
    }
    if(!direccion){
        error_orden.push({text:'Dni incorrecto'})
    }
    if(!localidad){
        error_orden.push({text:'Dni incorrecto'})
    }
    if(!DNI){
        error_orden.push({text:'Dni incorrecto'})
    }
    if(!puesto){
        error_orden.push({text:'Puesto incorrecto'})
    }
    if(!nombreyapellido){
        error_orden.push({text:'Nombre Y Apellido incorrecto'})
    }
    if(!fecha_ingreso){
        error_orden.push({text:'falta Fecha de Ingreso'})
    }
    if(!numerocelular){
        error_orden.push({text:'Falta Numero de Celular'})
    }
    if(!email){
        error_orden.push({text:'Email Incorrecto o no Ingresado'})
    }

    if(error_orden.length>0){
        res.render('/admin/crear_usuario',{error_orden})
        return
    }

    let dni_int =parseInt(DNI)
    let numero_int=parseInt(numerocelular)

    let nuevo_usuario_g={ //esquema para enviar a la base de datos (general)
        dni: dni_int,
        direccion:direccion,
        localidad:localidad,
        puesto: puesto,
        nombrecompleto: nombreyapellido,
        fecha_inicio: fecha_ingreso,
        celular: numero_int,
        email:email,
        estado:1,
        pass:pass
    }
    
    try {
        await validar_usuario_id(conect_sql,nuevo_usuario_g.dni,(respuesta)=>{
            if (respuesta) {
                req.flash('exito_msg',"ERROR !!! El usuario ya existe ")
                res.redirect("/admin/crear_usuario") //completar con redirect
            } 
            else {
                conect_sql.query(`INSERT INTO usuarios_general set ?`,[nuevo_usuario_g])
                req.flash('exito_msg',"Usuario Creado con Exito ")
                res.redirect("/admin") 
            }
        })
     

    } catch (err) {
        if(err)throw err;
    }
})

router.get('/admin/mod/:id',authMiddleware, async(req,res)=>{   //terminar
    let id=req.params.id
    let tipos_usuarios=["TECNICO","ADMINISTRADOR","RECEPCIONISTA","GERENTE","ADMIN. STOCK"]
    let listfilter
    let lista_enviar=[]

    if(!req.params.id ||isNaN(parseInt(id))) {
        req.flash('exito_msg',"ERROR !!! El usuario no existe ")
        res.redirect("/admin") 
    } 
    else {
        validar_usuario_id(conect_sql,id,(respuesta)=>{
            if(respuesta){
                mostrar_usuario_id(conect_sql,id,(respuesta2)=>{
                    
                        for (let index = 0; index < tipos_usuarios.length; index++) {
                            if (respuesta2[0].puesto==tipos_usuarios[index]) {
                                listfilter= tipos_usuarios.filter((item) => item !== respuesta2[0].puesto)  
    
                                for (let index = 0; index < listfilter.length; index++) {
                                    lista_enviar.push({puesto:listfilter[index]})
                                    
                                }
                            }
                        }
                        if(respuesta2[0].estado==1){
                            let estado={lalala:1}
                            res.render('layouts/modificar_usuario',{respuesta:respuesta2,lista_enviar,estado})
                        }
                        else{
                            res.render('layouts/modificar_usuario',{respuesta:respuesta2,lista_enviar})
                        }
                })
            }
            else{
                req.flash('exito_msg',"ERROR !!! El usuario no existe ")
                res.redirect("/admin") //completar con redirect
            }
        })
    }
    

})

router.post('/admin/mod/:id',authMiddleware, async(req,res)=>{                      //terminar
    console.log(req.body)
    const{dni,pass,nombrecompleto,direccion,localidad,email,celular,puesto,estado}=req.body
    let tipos_usuarios=["TECNICO","ADMINISTRADOR","RECEPCIONISTA","GERENTE","ADMIN. STOCK"]
    let error_orden=[]


    if(!dni){
        error_orden.push({text:'no hay dni'})
    }
    if(!pass){
        error_orden.push({text:'no ingreso una password'})
    }
    if(!nombrecompleto){
        error_orden.push({text:'no ingreso el nombre completo'})
    }
    if(!direccion){
        error_orden.push({text:'no ingreso una direccion'})
    }
    if(!localidad){
        error_orden.push({text:'no ingreso una localidad'})
    }
    if(!email){
        error_orden.push({text:'no ingreso un email'})
    }
    if(!celular){
        error_orden.push({text:'no ingreso un celular'})
    }
    if(!puesto){
        error_orden.push({text:'no ingreso un puesto'})
    }
    if(!estado || !isNaN(parseInt(estado)) || parseInt(estado)>2 ||parseInt(estado)<1){
        error_orden.push({text:'no ingreso un estado valido'})
    }
    if(!tipos_usuarios.includes(puesto)){
        error_orden.push({text:'no ingreso un puesto valido'})
    }
    if(error_orden.length>0){
        if (!dni || !isNaN(parseInt(dni))) {
            req.flash('exito_msg',"ERROR !!! El usuario no existe ")
            res.redirect('/admin')
        } else {
            req.flash('exito_msg',error_orden)
            res.redirect(`/admin/mod/:${dni}`)
        }
    }

    if(error_orden.length==0){
        let dni_int=parseInt(dni)
        let celular_int=parseInt(celular)
        let estado_int=parseInt(estado)

        let usuario={
            pass:pass,
            nombrecompleto:nombrecompleto,
            direccion:direccion,
            localidad:localidad,
            email:email,
            celular:celular_int,
            puesto:puesto,
            estado:estado_int
        }
        validar_usuario_id(conect_sql,usuario,(respuesta)=>{  
            if(respuesta){ //si existe el usuario
                update_usuario(conect_sql,"usuarios_general",dni_int,usuario) //actualiza la tabla
                req.flash('exito_msg',"El usuario fue actualizado correctamente ")
                res.redirect('/admin')
            }
            else{//si no existe el usuario
                req.flash('exito_msg',"ERROR !!! El usuario no existe ")
                res.redirect('/admin')
            }
        })
    }
})

router.post('/admin/delete/:id',authMiddleware, async(req,res)=>{  //ruta no usada por ahora (ya hay manera de desabilitar)
    if(!req.params.id || isNaN(parseInt(req.params.id))){
    }
    else{
        let dato={
            id_usuario:parseInt(req.params.id)
        }
        await validar_usuario_id(conect_sql,dato.id_usuario,(respuesta)=>{
            if (respuesta) {
                deshabilitar_usuario(conect_sql,dato.id_usuario)
                req.flash('exito_msg',"Usuario Desabilitado con Exito ")
                res.redirect("/admin") 
            } 
            else {
                req.flash('exito_msg',"El usuario no existe")
                res.redirect("/admin") 
            }
        })
    }
})  


router.get('/stock',authMiddleware, async(req,res)=>{
    console.log(res.locals)
    await mostrar_repuestos_con_marca_modelo_stock(conect_sql,(resultado)=>{ //busca los repuestos y los envia al front
        res.render('layouts/lista_repuestos',{resultado})  //completar el front (hbs)
    }) 
})

router.get('/stock/mod/:dato',authMiddleware, async(req,res)=>{   //completar ----------------------------------------------error--------------------
    let dato=req.params.dato
    if(!dato || isNaN(parseInt(dato))){
        req.flash('exito_msg','El repuesto no existe')
        res.redirect('/stock')
    }
    else{
        await validar_repuerto_id(conect_sql,dato,(dato_val)=>{
            if (dato_val) {
                mostrar_repuesto_id(conect_sql,dato,(respuesta)=>{
                    res.render('layouts/modificar_repuesto',{respuesta})
                })
            } else {
                req.flash('exito_msg','El repuesto no existe')
                res.redirect('/stock')
            }
        })
    }
    

})

router.post('/stock/mod/:id',authMiddleware,async(req,res)=>{  //terminar
    console.log("datos post:",req.body)
    const{id,nombre,precio,distribuidor,descripcion}=req.body
    let id_int=parseInt(id);
    let precio_int=parseInt(precio);
    let datos={
        id:id_int,
        nombre:nombre,
        precio:precio_int,
        distribuidor:distribuidor,
        descripcion:descripcion
    }
    await validar_repuerto_id(conect_sql,datos.id,(respuesta)=>{
        if(respuesta){ //si existe
            modificar_repuesto_id(conect_sql,datos,(respuesta2)=>{
                res.redirect("/stock")
            })
        }
        else{   //si el repesto no existe
            res.status(404).send("no es encontro el repuesto")
        }
    })
    
})

router.get('/stock/crear_repuesto',authMiddleware,(req,res)=>{
    console.log(res.locals)
    res.render('layouts/crear_repuesto')  
})

router.post('/stock/crear_repuesto',authMiddleware,async (req,res)=>{  //terminar
    let error_orden=[]

    const{ nombre,distribuidor,cantidad,precio,descripcion,marca,modelo }=req.body

    let cantidad_int= parseInt(cantidad)
    let precio_int= parseInt(precio)
    let modelo_lower=modelo.toLocaleLowerCase()
    let marca_lower=marca.toLocaleLowerCase()

    let esquema={
        marca,
        modelo,
        nombre:nombre,
        distribuidor:distribuidor,
        cantidad:cantidad_int,
        precio:precio_int,
        descripcion:descripcion
    }
    if (!nombre || nombre.length<3){
        error_orden.push({text:"error en el nombre"})
    }
    if (!distribuidor || distribuidor.length<3){
        error_orden.push({text:"error en el distribuidor"})
    }
    if (!cantidad_int || cantidad_int<0 || typeof cantidad_int != 'number'){
        error_orden.push({text:"error en la cantidad"})
    }
    if (!precio_int || precio_int<0 || typeof precio_int != 'number'){
        error_orden.push({text:"error en el precio"})
    }
    if (!descripcion || descripcion.length<3){
        error_orden.push({text:"error en la descripcion"})
    }
    if (!marca_lower || marca_lower.length<3){
        error_orden.push({text:"error en la marca"})
    }
    if (!modelo_lower || modelo_lower.length<3){
        error_orden.push({text:"error en el modelo"})
    }

    if(error_orden.length>0){
        res.render('/stock/crear_repuesto',{error_orden})
    }
            
    if(error_orden.length==0){               //si no existen errores pasa a crear el repuesto
        await validar_marca_nombre(conect_sql,marca_lower,(datos_val)=>{ 
            console.log(datos_val)
            if(datos_val){                  //revisa si existe la marca sino la crea
                buscar_marca_nombre(conect_sql,marca_lower,(respuesta)=>{ 

                    esquema.marca=respuesta[0].id_marca
                    console.log("esquema modelo "+esquema.marca)
                    console.log(respuesta)
                    console.log(respuesta[0].id_marca)
                    
                    validar_modelo_nombre(conect_sql,modelo_lower,(datos_val2)=>{
                        if(datos_val2){
                            buscar_modelo_nombre(conect_sql,modelo_lower,(respuesta2)=>{
                                esquema.modelo=respuesta2[0].id_modelo
                                console.log("esquema modelo "+esquema.modelo)
                                console.log(respuesta2.id_modelo)
        
                                crear_repuesto(conect_sql,esquema,respuesta[0].id_marca,respuesta2[0].id_modelo)
                                error_orden={text:'Repuesto creado con exito'}
                                res.render('layouts/crear_repuesto',{error_orden})
                                
                            })
                        }
                        else{
                            crear_modelo(conect_sql,modelo_lower)
                            buscar_modelo_nombre(conect_sql,modelo_lower,(respuesta2)=>{
                                esquema.modelo=respuesta2[0].id_modelo
                                crear_repuesto(conect_sql,esquema,respuesta[0].id_marca,respuesta2[0].id_modelo)
                                req.flash('exito_msg','Repuesto creado con exito')
                                res.redirect('/stock')
                            })
                            
                        }
                        
                    })
                })
            }
            
            else{
                crear_marca(conect_sql,marca_lower)
                buscar_marca_nombre(conect_sql,marca_lower,(respuesta)=>{ 
                    esquema.marca=respuesta[0].id_marca

                    validar_modelo_nombre(conect_sql,modelo_lower,(datos_val2)=>{
                        if(datos_val2){
                            buscar_modelo_nombre(conect_sql,modelo_lower,(respuesta2)=>{
                                esquema.modelo=respuesta2[0].id_modelo
                                crear_repuesto(conect_sql,esquema,respuesta[0].id_marca,respuesta2[0].id_modelo)
                                req.flash('exito_msg','Repuesto creado con exito')
                                res.redirect('/stock')
                                
                            })
                        }
                        else{
                            crear_modelo(conect_sql,modelo_lower)
                            buscar_modelo_nombre(conect_sql,modelo_lower,(respuesta2)=>{
                                esquema.modelo=respuesta2.id_modelo
                                crear_repuesto(conect_sql,esquema,respuesta[0].id_marca,respuesta2[0].id_modelo)
                                req.flash('exito_msg','Repuesto creado con exito')
                                res.redirect('/stock')
                            })
                        }
                    })
                }) 
            }
        })     
    }
})

router.get('/stock/ingresar_stock',(req,res)=>{  //carga los repuestos y los manda al front
    select_from(conect_sql ,"repuestos",(respuesta)=>{
        console.log(respuesta)
        res.render('layouts/sumar_repuesto',{repuestos_de_bbdd:respuesta})
    })
})

router.post('/stock/ingresar_stock',(req,res)=>{
    const{repuesto,cantidad}=req.body

    console.log("repuesto "+typeof repuesto+"   cantidad"+typeof cantidad)
    const error_orden=[]

    if(!repuesto) {
        error_orden.push({text:'Error al ingresar Repuesto'})
    }
    if(!cantidad ){
        error_orden.push({text:'Error al ingresar Cantidad'})
    }

    if(error_orden.length>0){
        res.redirect('/stock/ingresar_stock',{error_orden})
        return
    }
    else{
        let id_int=parseInt(repuesto)
        let cantidad_int=parseInt(cantidad)

        let datos={
            id_repuesto: id_int,
            cantidad: cantidad_int
        };

        validar_repuerto_id(conect_sql,datos.id_repuesto,(validador)=>{   //el repuesto existe? 
            if(validador){
                try {
                    ingresar_stock(conect_sql,datos,"suma")
                    error_orden.push({text:"stock agregado"})
                    select_from(conect_sql ,"repuestos",(respuesta)=>{
                        res.render('layouts/sumar_repuesto',{repuestos_de_bbdd:respuesta,error_orden})
                    })
                } 
                catch (error) {
                    console.log("si existe error: "+error)
                }
            }
            else{
                error_orden.push({text:'El repuesto no existe '})
                select_from(conect_sql ,"repuestos",(respuesta)=>{
                res.render('layouts/sumar_repuesto',{repuestos_de_bbdd:respuesta,error_orden})
                })
            }
        }) 
    }
})


//------------------------------------GRAFICOS

router.get('/graficos/tipos_equipo',authMiddleware, async(req,res)=>{
    await graficos_tipo_equipo_mes(conect_sql,(respuesta)=>{
        
        res.json(respuesta)
    })
})


module.exports=router;
