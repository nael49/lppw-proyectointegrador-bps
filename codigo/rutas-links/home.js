const express=require('express');
const router=express.Router();

router.get('/recepcionista',(req,res)=>{
    res.render('layouts/index-recepcionista')
})

router.get('/sigin',(req,res)=>{
    res.render('layouts/sigin')
})

router.get('/tecnico',(req,res)=>{
    res.render('layouts/index-tecnico')
})



module.exports=router;
