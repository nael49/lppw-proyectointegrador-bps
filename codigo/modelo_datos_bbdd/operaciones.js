const mysql=require('mysql')

function mostrar_repuesto(coneccion,callback){
    let query="SELECT * FROM repuestos";
    coneccion.query(query, function(err,data){
      if(err) throw err;
      callback(data)
    })
}

function crear_repuesto(coneccion,datos,callback){ 
  console.log(datos)
    let query=`INSERT INTO repuestos( nombre, distribuidor, cantidad, precio, descripcion) VALUES ('${datos.nombre}','${datos.distribuidor}',${datos.cantidad},${datos.precio},'${datos.descripcion}')`;
    coneccion.query(query, function(err,data){
      if(err) throw err;
      callback(data)
    })
}


function ingresar_stock (coneccion,datos,callback){
  console.log(datos)

  //consultar cuanto hay en stock
  let query_contar=`SELECT cantidad FROM repuestos WHERE id_repuesto =${datos.id}`; //ajustar
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)

  })

  let query=`UPDATE repuestos SET 'cantidad'=${datos.cantidad} WHERE id_repuesto=${datos.id}`; //ajustar
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)
  })
}

function validar_repuerto_id(coneccion,id){ //revisa por id (int) si el repuesto existe
    let datos_validar

    let query_validar=`SELECT COUNT(cantidad) AS cantidad FROM repuestos WHERE id_repuesto = ${id}`; 
    
    coneccion.query(query, function(err,rows){
      if(err) throw err;
      callback(rows)
      datos_validar=rows[0].cantidad

    })

  if(datos_validar==0){ //retorna true/false
    return false
  }
  else{
    return true
  }
}



module.exports={mostrar_repuesto,crear_repuesto,ingresar_stock,validar_repuerto_id}