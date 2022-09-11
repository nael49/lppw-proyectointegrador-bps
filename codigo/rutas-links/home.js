const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    res.render('layouts/index')
})

router.get('/sigin',(req,res)=>{
    res.render('layouts/sigin')
})

module.exports=router;
