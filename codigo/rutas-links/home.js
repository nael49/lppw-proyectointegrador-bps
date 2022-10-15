const express=require('express');
const router = express.Router();

const conect_sql = require('../modelo_datos_bbdd/conexion_con_bbdd')



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

        conect_sql.query(`SELECT dni FROM clientes WHERE dni =${cliente.dni}`,function(err,data){
            console.log(data)
        })
        //if(revisar_dni.RowDataPacket.length>0){
        //    res.send('ya exisate')
        //}
        //else{
        await conect_sql.query('INSERT INTO clientes set ?',[cliente]);
        res.send('perfecto')

    }


})


router.get('/sigin',(req,res)=>{
    res.render('layouts/sigin')
})

router.get('/tecnico',(req,res)=>{
    res.render('layouts/mis_ordenes_trabajo')
})

router.get('/tecnico/ordenes',(req,res)=>{
    res.render('layouts/ordenes_trabajo_lista')
})

router.get('/admin',(req,res)=>{
    res.render('layouts/lista_usuario')
})

router.get('/admin/crear_usuario',(req,res)=>{
    res.render('layouts/crear_usuario')
})

router.get('/stock',(req,res)=>{
    res.render('layouts/lista_repuestos')
})

router.get('/stock/crear_repuesto',(req,res)=>{
    res.render('layouts/crear_repuesto')
})

module.exports=router;
