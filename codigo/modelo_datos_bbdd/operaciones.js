const mysql=require('mysql')

function mostrar_repuesto(coneccion,callback){
    let query="SELECT * FROM repuestos";
    coneccion.query(query, function(err,data){
      if(err) throw err;
      callback(data)
    })
}

function crear_repuesto(coneccion,callback,datos){
    let query=`INSERT INTO 'repuestos' ('nombre', 'distribuidor', 'cantidad', 'precio', 'descripcion') VALUES (${datos.nombre},${datos.distribuidor},${datos.cantidad},${datos.precio},${datos.descripcion})`;
    coneccion.query(query, function(err,data){
      if(err) throw err;
      callback(data)
    })
}


module.exports={mostrar_repuesto,crear_repuesto}