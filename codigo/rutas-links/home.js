const bodyParser = require('body-parser');
const { json } = require('body-parser');
const express=require('express');
const router = express.Router();

const conect_sql = require('../modelo_datos_bbdd/conexion_con_bbdd')
const {mostrar_repuesto , crear_repuesto, ingresar_stock, validar_repuerto_id, mostrar_ordenes_espera, mostrar_mis_ordenes, validar_usuario_id, validar_orden_id, traer_orden_id, mostrar_estados, mostrar_repuesto_id} = require('../modelo_datos_bbdd/operaciones')


router.get('/gerente',(req,res)=>{
    res.render('layouts/gerente_index')
})

router.get('/recepcionista',(req,res)=>{
    res.render('layouts/index-recepcionista')
})

router.get('/crear_orden', (req,res)=>{
    res.render('layouts/crear_orden_trabajo')
})

router.post('/crear_orden_p',async(req,res)=>{  //ejemplo de crear un cliente en sql
    console.log(req.body)
    const { nombrecompleto , dni, localidad, direccion,celular,email,marca,modelo,descripcion_falla } = req.body;
    const error_orden=[]

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
    if(!marca){
        error_orden.push({text:'ingrese marca'})
    }
    if(!modelo){
        error_orden.push({text:'ingrese modelo'})
    }
    if(!descripcion_falla){
        error_orden.push({text:'ingrese descripcion de la falla'})
    }

    if(error_orden.length>0){
        res.render('layouts/crear_orden_trabajo',{
            error_orden,
            nombrecompleto,
            dni,
            localidad,
            direccion,
            celular,
            email,
            marca,
            modelo,
            descripcion_falla
        })
    }

    else{
        celular_int=parseInt(celular)
        dni_int =parseInt(dni)
        const cliente={
            dni : dni_int,
            nombrecompleto,
            celular : celular_int,
            direccion,
            email,
            localidad,
        }

        let datos_traidos //aca se guarda en 1 si ya existe el dni y en 0 sino

        try {
            conect_sql.query(`SELECT COUNT(dni) AS ID FROM clientes WHERE dni =${cliente.dni}`,function(err, rows){ //revisa si ya existe el dni
                if(err)throw err;
                datos_traidos=rows[0].ID
                res.status(200).send('perfecto')
            })
        } catch (err) {
            console.log("huno un error")
            throw err;
        }
        
        if(datos_traidos==1){ //si ya esiste
            res.redirect('/crear_orden_g')
            return
        }
        else{ //si el usuario no existe
            await conect_sql.query('INSERT INTO clientes set ?',[cliente]);
            res.status(200).send('perfecto')
        }

    }
})


router.post('/crear_orden_existe_usuario',async(req,res)=>{
    const{dni,marca,modelo,descripcion_falla}= req.body
    const error_orden=[]

    if(!dni){
        error_orden.push({text:'Dni incorrecto'})
    }
    if(!marca){
        error_orden.push({text:'marca incorrecta'})
    }
    if(!modelo){
        error_orden.push({text:'modelo incorrecto'})
    }
    if(!descripcion_falla){
        error_orden.push({text:'falta Descripcion'})
    }
    let int_dni=parseInt(dni)

    let orden_trabajo={ //esquema para enviar a la base de datos
        estado: 2,
        descripcion_falla: descripcion_falla,
        fk_marca: marca,
        fk_modelo: modelo,
        fk_cliente: int_dni
    }
    
    try {
        await conect_sql.query(`INSERT INTO orden_trabajo set ?`,[orden_trabajo])
    } catch (err) {
        if(err)throw err;
    }
})

router.get('/crear_orden_g',(req,res)=>{
    res.render('layouts/crear_orden_trabajo_cliente_existe')
})


router.get('/sigin',(req,res)=>{
    res.render('layouts/sigin')
})
router.post('/sigin',(req,res)=>{ //completar
    res.render('layouts/sigin')
})

router.get('/tecnico', async(req,res)=>{

    await mostrar_ordenes_espera(conect_sql,(respuesta)=>{
        respuesta[0].fecha_creacion=(respuesta[0].fecha_creacion).toString().substring(0,10) //convierte la fehca y hora en solo fecha para mostrar
        console.log(respuesta)
        res.render('layouts/ordenes_trabajo_lista',{respuesta})
    })

})

router.get('/tecnico/misordenes',async(req,res)=>{
    try {
        await mostrar_mis_ordenes(conect_sql,35122299,(respuesta)=>{
            respuesta[0].fecha_creacion=(respuesta[0].fecha_creacion).toString().substring(0,10) //convierte la fehca y hora en solo fecha para mostrar
            console.log(respuesta)
            res.render('layouts/mis_ordenes_trabajo',{respuesta})
        })
    } catch (error) {
        res.send('Error en la BBDD')
    }
})

router.get('/tecnico/orden/:id',async(req,res)=>{         //---------------- MODIFICAR ORDENES ------------------
    console.log(req.params.id)
    let id_int=parseInt(req.params.id)

    if(await validar_orden_id(conect_sql,id_int)){

        await mostrar_estados(conect_sql,1,(estados)=>{

            mostrar_repuesto (conect_sql,(datos)=>{
            
                traer_orden_id(conect_sql,id_int,(respuesta)=>{
    
                    respuesta[0].id_orden=(respuesta[0].id_orden).toString()
                    respuesta[0].fk_marca=(respuesta[0].fk_marca).toString()
                    respuesta[0].estado=(respuesta[0].estado).toString()
        
                    console.log("orden de la bbdd: ",respuesta)
                    //let para_mandar=respuesta[0]
        
                    res.render('layouts/modificar_orden',{respuesta,datos,estados})
                })
            })
        })
        
    }
    else{

    }
})

router.post('/tecnico/orden/:id',async(req,res)=>{
    const{repuesto,estado,datos_op}=req.body
    console.log(repuesto)
    console.log(estado)
    console.log(datos_op)
    res.send('bien')

})

router.get('/admin',(req,res)=>{
    res.render('layouts/lista_usuario')
})

router.get('/admin/crear_usuario',(req,res)=>{
    res.render('layouts/crear_usuario')
})

router.post('/admin/crear_usuario', async(req,res)=>{
    console.log(req.body)
    const {puesto,direccion,localidad,DNI,nombreyapellido,fecha_ingreso,numerocelular,email}= req.body

    const error_orden=[]

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
        estado:1
    }
    let nuevo_usuario_t={ //esquema para enviar a la base de datos (tecnico)
        dni: dni_int,
        nombrecompleto: nombreyapellido,
        fecha_inicio: fecha_ingreso,
        celular: numero_int,
        email:email,
        estado:1
    }
    
    console.log("puesto elegido: "+puesto)
    if(puesto=="TECNICO"){
        try {
            await conect_sql.query(`INSERT INTO usuarios_tecnicos set ?`,[nuevo_usuario_t])
            let datos_enviar={text:'usuario creado'}
            res.render('layouts/crear_usuario',{datos_enviar}) //se envia a la misma pagina con una alerta de creado
            return
            
        } catch (err) {
            if(err)throw err;
        }
    }
    else{
        try {
            await conect_sql.query(`INSERT INTO usuarios_general set ?`,[nuevo_usuario_g])

            let datos_enviar={text:'usuario creado'}
            res.render('layouts/crear_usuario',{datos_enviar}) //se envia a la misma pagina con una alerta de creado
            return
        } catch (err) {
            if(err)throw err;
        }
    }
    res.send(200,"usuario creado") //completar con redirect
    

})

router.get('/stock', async(req,res)=>{

    await mostrar_repuesto(conect_sql,(resultado)=>{ //busca los repuestos y los envia al front
        console.log(resultado[0])
        res.render('layouts/lista_repuestos',{resultado})  //completar el front (hbs)

    }) 
})

router.get('/stock/mod/:dato', async(req,res)=>{   //completar ----------------------------------------------error--------------------
    let dato=req.params.dato
    console.log( "dato recibido en get :"+dato)
    if(validar_repuerto_id(conect_sql,dato)){
        await mostrar_repuesto_id(conect_sql,dato,(respuesta)=>{
            res.render('layouts/modificar_repuesto',{respuesta})
        })
        
    }
    else{
        res.status(404).send('Respuesto no encontrado')
    }
})

router.post('/stock/:id',async(req,res)=>{
    console.log("datos post:",req.body)
    const{id,nombre,modelo,marca,precio,distribuidor}=req.body
    let id_int=parseInt(id);
    let precio_int=parseInt(precio);
    let datos={
        id:id_int,
        nombre:nombre,
        modelo:modelo,
        marca:marca,
        precio:precio_int,
        distribuidor:distribuidor
    }
    
})

router.get('/stock/crear_repuesto',(req,res)=>{
    res.render('layouts/crear_repuesto')
})

router.post('/stock/crear_repuesto',async (req,res)=>{
    let error_orden={text:'Repuesto creado con exito'}
    const{ nombre,distribuidor,cantidad,precio,descripcion }=req.body
    let cantidad_int= parseInt(cantidad)
    let precio_int= parseInt(precio)

    let esquema={
        nombre:nombre,
        distribuidor:distribuidor,
        cantidad:cantidad_int,
        precio:precio_int,
        descripcion:descripcion
    }
    try {
        await crear_repuesto(conect_sql,esquema,(datos_res) =>{
            console.log(datos_res)
        })
    } catch (error) {
        console.log(error)
    }
    
    
    res.redirect('/stock/crear_repuesto')
    return;
})

router.get('/stock/ingresar_stock',(req,res)=>{  //carga los repuestos y los manda al front
    mostrar_repuesto(conect_sql ,(respuesta)=>{
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

        console.log("datos del front: "+datos.cantidad+"  id"+datos.id_repuesto)

        if(validar_repuerto_id(conect_sql,datos.id_repuesto)){ //el repuesto existe?
            try {
                ingresar_stock(conect_sql,datos,"suma",(respuesta)=>{
                    console.log(respuesta)
                    error_orden.push({text:"stock agregado"})
                    console.log("antes del loca")

                    mostrar_repuesto(conect_sql ,(respuesta)=>{
                        res.render('layouts/sumar_repuesto',{repuestos_de_bbdd:respuesta,error_orden})
                    })
                    console.log("despues del loca")

                })
            } catch (error) {
                console.log("si existe error: "+error)
            }
            
        }
        else{
            error_orden.push({text:'El repuesto no existe '})
            mostrar_repuesto(conect_sql ,(respuesta)=>{
                res.render('layouts/sumar_repuesto',{repuestos_de_bbdd:respuesta,error_orden})
            })
        }
    }
})

module.exports=router;
