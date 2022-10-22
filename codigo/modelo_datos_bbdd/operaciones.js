const mysql=require('mysql')


// ------------------------   USUARIOS

function mostrar_usuarios_t(coneccion,callback){
  let query="SELECT * FROM usuarios_tecnicos";
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)
  })
}

function mostrar_usuarios_g(coneccion,callback){
  let query="SELECT * FROM usuarios_general";
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)
  })
}


function validar_usuario_id(coneccion,id,tipo){ //revisa por id (int) si el repuesto existe
  let datos_validar
  let query_validar
  if(tipo=1){
    query_validar=`SELECT COUNT(dni) AS dni FROM 'usuarios_tecnicos' WHERE dni = ${id}`; 
  }
  else{
    query_validar=`SELECT COUNT(dni) AS dni FROM 'usuarios_general' WHERE dni = ${id}`; 
  }
   
  
  coneccion.query(query_validar, function(err,rows){
    if(err) throw err;
    datos_validar=rows[0].cantidad
    console.log("datos de validar si existe: "+ datos_validar)

  })

  if(datos_validar==0){ //retorna true si ya existe la pk/ false si no existe la pk
    return false
  }
  else{
    return true
  }
}


// ------------------------   REPUESTOS

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

function validar_repuerto_id(coneccion,id){ //revisa por id (int) si el repuesto existe
  let datos_validar

  let query_validar=`SELECT COUNT(cantidad) AS cantidad FROM repuestos WHERE id_repuesto = ${id}`; 
  
  coneccion.query(query_validar, function(err,rows){
    if(err) throw err;
    datos_validar=rows[0].cantidad
    console.log("datos de validar si existe: "+ datos_validar)

  })

if(datos_validar==0){ //retorna true/false
  return false
}
else{
  return true
}
}


// ------------------------   ORDENES

function mostrar_ordenes_espera(coneccion,callback){
  let query=`SELECT fecha_creacion,fk_cliente,fk_recepcionista,descripcion_falla,marca.marca,modelo.modelo FROM orden_trabajo JOIN marca ON orden_trabajo.fk_marca = marca.id_marca JOIN modelo ON orden_trabajo.fk_modelo = modelo.id_modelo WHERE orden_trabajo.estado=2`;
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)
  })
}

function mostrar_mis_ordenes(coneccion,datos,callback){
  let query=`SELECT  id_orden,fecha_creacion,fk_cliente,fk_recepcionista,descripcion_falla, marca.marca, modelo.modelo, estados.nombre FROM orden_trabajo JOIN marca ON orden_trabajo.fk_marca = marca.id_marca JOIN modelo ON orden_trabajo.fk_modelo= modelo.id_modelo JOIN estados ON orden_trabajo.estado =estados.id_estados WHERE fk_tecnico=${datos} AND estado != 5 AND estado != 6` ; //cambiar datos
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)
  })
}

function validar_orden_id(coneccion,datos){  //si existe la orden retorna true 
  let datos_validar

  let query_validar=`SELECT COUNT(id_orden) AS id_orden FROM orden_trabajo WHERE id_orden = ${datos}`; 
  
  coneccion.query(query_validar, function(err,rows){
    if(err) throw err;
    datos_validar=rows[0].id_orden
    console.log("datos de validar si existe: "+ datos_validar)

  })

  if(datos_validar==0){ //retorna true/false
    return false
  }
  else{
    return true
  }
}

function traer_orden_id(coneccion,datos,callback){
  let query=`SELECT  id_orden,descripcion_falla,fk_marca, marca.marca, modelo.modelo,estado,estados.nombre FROM orden_trabajo JOIN marca ON orden_trabajo.fk_marca = marca.id_marca JOIN modelo ON orden_trabajo.fk_modelo= modelo.id_modelo JOIN estados ON orden_trabajo.estado =estados.id_estados WHERE id_orden=${datos}` ; 
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)
  })
}
 // ------------------------    STOCK

function ingresar_stock (coneccion,datos,callback){
  console.log(datos)

  //consultar cuanto hay en stock
  let query_contar=`SELECT cantidad FROM repuestos WHERE id_repuesto =${datos.id_repuesto}`; //ajustar
  coneccion.query(query_contar, function(err,data){
    if(err) throw err;
    let cantidad_traida=data[0].cantidad
    callback(data)
    let query_sumar=`UPDATE repuestos SET cantidad=${cantidad_traida+datos.cantidad} WHERE id_repuesto=${datos.id_repuesto}`; //ajustar
    coneccion.query(query_sumar, function(err,data){
      if(err) throw err;
      callback(data)
    })
  })
}

//-------------------------------ESTADOS

function mostrar_estados(coneccion,selector,callback){
  let query
  if(selector==1){
    query="SELECT * FROM estados WHERE id_estados!=6";
  }
  else{
    query="SELECT * FROM estados ";
  }
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)
  })
}


module.exports={mostrar_repuesto,crear_repuesto,ingresar_stock,validar_repuerto_id,validar_usuario_id,mostrar_ordenes_espera,mostrar_mis_ordenes,
validar_orden_id,traer_orden_id,mostrar_estados
}