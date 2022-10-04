const express=require('express');
const router = express.Router();

const conect = require('../modelo_datos_bbdd/conexion_con_bbdd')



router.get('/recepcionista',(req,res)=>{
    res.render('layouts/index-recepcionista')
})

router.get('/crear_orden',(req,res)=>{
    res.render('layouts/crear_orden_trabajo')
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


module.exports=router;
