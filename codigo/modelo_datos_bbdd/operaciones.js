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

function ingresar_stock (coneccion,datos,operacion,callback){ //trae la cantidad y suma o resta dependiento la "operacion"
  console.log(datos)

  //consultar cuanto hay en stock
  let query_contar=`SELECT cantidad FROM repuestos WHERE id_repuesto =${datos.id_repuesto}`; //traigo la cantidad
  coneccion.query(query_contar, function(err,data){
    if(err) throw err;

    let cantidad_traida=data[0].cantidad
    callback(data) 

    if(operacion=="suma"){
      let query_sumar=`UPDATE repuestos SET cantidad=${cantidad_traida+datos.cantidad} WHERE id_repuesto=${datos.id_repuesto}`; 
      coneccion.query(query_sumar, function(err,data){
        if(err) throw err;
        callback(data)
      })
    }
    if(operacion=="resta"){
      let query_sumar=`UPDATE repuestos SET cantidad=${cantidad_traida-datos.cantidad} WHERE id_repuesto=${datos.id_repuesto}`; 
      coneccion.query(query_sumar, function(err,data){
        if(err) throw err;
        callback(data)
      })
    }
  })
}

function modificar_repuesto_id(coneccion,datos,callback){ //trae la cantidad y suma o resta dependiento la "operacion"
  console.log(datos)

  let query_sumar=`UPDATE repuestos SET nombre=${datos.nombre},modelo=${datos.modelo},precio=${datos.precio},marca=${datos.marca},distribuidor=${datos.distribuidor} WHERE id_repuesto=${datos.id_repuesto}`; 
  coneccion.query(query_sumar, function(err,data){
    if(err) throw err;
    callback(data)
  })
}

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



function contar_repuerto_id(coneccion,id){ //revisa por id (int) si el repuesto existe
  let datos_validar

  let query_validar=`SELECT cantidad  FROM repuestos WHERE id_repuesto = ${id}`; 
  
  coneccion.query(query_validar, function(err,rows){
    if(err) throw err;
    datos_validar=rows[0].cantidad
    console.log("cantidad de repuestos: "+ datos_validar)

  })
  return datos_validar

}

function mostrar_repuesto_id(coneccion,id,callback){ //revisa por id (int) si el repuesto existe
  let query_validar=`SELECT * FROM repuestos WHERE id_repuesto = ${id}`; 
  
  coneccion.query(query_validar, function(err,data){
    if(err) throw err;
    console.log("repuesto: ", data)
    callback(data)
  })
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

//-------------------------------MODELO
function mostrar_modelos(coneccion,callback){ //revisa por id (int) si el repuesto existe
  let query=`SELECT * FROM modelo`; 
  
  coneccion.query(query, function(err,data){
    if(err) throw err;
    console.log("modelos: ", data)
    callback(data)
  })
}

function crear_modelo(coneccion,datos){ //revisa por id (int) si el repuesto existe
  let query=`INSERT INTO modelo (modelo) VALUES (${datos}')`; 
  
  coneccion.query(query, function(err,data){
    if(err) throw err;
    console.log("modelos: ", data)
  })
}

function buscar_modelo_nombre(coneccion,dato,callback){ //revisa por id (int) si el repuesto existe
  let query=`SELECT * FROM modelo where modelo =${dato}`; 
  let dato_bbdd
  coneccion.query(query, function(err,data){
    if(err) throw err;
    console.log("modelo: ", data)
    callback(data)
  })
}

function validar_modelo_nombre(coneccion,datos){  //si existe la orden retorna true 
  let query_validar=`SELECT COUNT(id_modelo) AS id_modelo FROM modelo WHERE modelo = ${datos}`; 
  
  coneccion.query(query_validar, function(err,rows){
    if(err) throw err;
    console.log("datos de validar si existe: "+ rows)
    if(rows[0].id_modelo==0){ //retorna false si no existe
      return false
    }
    else{
      return true
    }
  })
}



//-------------------------------MARCA
function mostrar_marcas(coneccion,callback){ //revisa por id (int) si el repuesto existe
  let query=`SELECT * FROM marca`; 
  
  coneccion.query(query, function(err,data){
    if(err) throw err;
    console.log("marca: ", data)
    callback(data)
  })
}

function validar_marca_nombre(coneccion,datos){  //si existe la orden retorna true 
  let query_validar=`SELECT COUNT(id_marca) AS id_marca FROM marca WHERE marca = ${datos}`; 
  
  coneccion.query(query_validar, function(err,rows){
    if(err) throw err;
    console.log("datos de validar si existe: "+ rows)
    if(rows[0].id_marca==0){ //retorna false si no existe
      return false
    }
    else{
      return true
    }
  })
}

function buscar_marca_nombre(coneccion,dato,callback){ //revisa por id (int) si el repuesto existe
  let query=`SELECT * FROM marca where marca =${dato}`; 
  
  coneccion.query(query, function(err,data){
    if(err) throw err;
    console.log("marca: ", data)
    callback(data)
  })
}

function crear_marca(coneccion,datos){ //revisa por id (int) si el repuesto existe
  let query=`INSERT INTO marca (marca) VALUES (${datos}')`; 
  
  coneccion.query(query, function(err,data){
    if(err) throw err;
    console.log("marca: ", data)
  })
}

module.exports={mostrar_repuesto,crear_repuesto,ingresar_stock,validar_repuerto_id,validar_usuario_id,mostrar_ordenes_espera,mostrar_mis_ordenes,
validar_orden_id,traer_orden_id,mostrar_estados,contar_repuerto_id,mostrar_repuesto_id,modificar_repuesto_id,mostrar_marcas,mostrar_modelos,
crear_marca,crear_modelo,buscar_marca_nombre,buscar_modelo_nombre,validar_marca_nombre,validar_modelo_nombre
}