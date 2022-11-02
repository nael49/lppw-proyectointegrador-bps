const mysql=require('mysql')
const conect_sql=require('./conexion_con_bbdd')
//------------------------   CLIENTE

function mostrar_cliente_id(coneccion,dato,callback){
  let query=`SELECT * FROM clientes WHERE dni=${dato}`;
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)
  })
}

function update_cliente(coneccion,datos){
  let query=`UPDATE clientes SET nombrecompleto='${datos.nombrecompleto}',celular=${datos.celular},direccion='${datos.direccion}',email='${datos.email}',localidad='${datos.localidad}' WHERE dni=${datos.dni}`;
  coneccion.query(query, function(err){
    if(err) throw err;

  })
}

function validar_cliente_id(coneccion,dato,callback){
  let query=`SELECT COUNT(dni) AS dni FROM clientes WHERE dni = ${dato}`;
  coneccion.query(query, function(err,data){
    if(err) throw err;
    if(data[0].dni==0){
      callback(false)
    }
    else{
      callback(true)
    }
   
  })
}


// ------------------------   USUARIOS
function tipo_usuario(coneccion,id,callback){
  let query=`SELECT puesto FROM usuarios_general WHERE dni = ${id}`; 
  coneccion.query(query, function(err,data){
    if(err) throw err;
    console.log('datos traidos del login',data[0].puesto)
    callback(data[0].puesto)
    }
)}

function deshabilitar_usuario(coneccion,id){
  let query=`UPDATE usuarios_general SET estado=0 WHERE dni = ${id}`; 
  coneccion.query(query, function(err,data){
    if(err) throw err;
    }
)}

function login(coneccion,datos,callback){
  let query=`SELECT nombrecompleto,puesto,dni  FROM usuarios_general WHERE dni = ${datos.usuario} AND pass =${datos.contraseña}`; 
  coneccion.query(query, function(err,data){
    if(err) throw err;
    console.log('datos traidos del login',data)
    callback(data)
    }
)}

function validar_usuario_id(coneccion,id,callback){ //revisa por id (int) si el repuesto existe
  let query_validar=`SELECT COUNT(dni) AS dni FROM usuarios_general WHERE dni = ${id}`; 
  coneccion.query(query_validar, function(err,rows){
    if(err) throw err;
    
    if(rows[0].dni==0){ //retorna true si ya existe la pk/ false si no existe la pk
      callback(false)
    }
    else{
      callback(true)
    }
  })
}

function update_usuario(coneccion,tabla,datos){

  coneccion.query(`update ${tabla} set ? WHERE dni=${datos.dni}`,[datos],function(err){
    if(err) throw err;
  })
}

function mostrar_usuario_id(coneccion,id,callback){ //revisa por id (int) si el repuesto existe

  let query_validar=`SELECT *  FROM usuarios_general WHERE dni = ${id}`; 
  
  coneccion.query(query_validar, function(err,data){
    if(err) throw err;
    callback(data)

  })
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

  let query_sumar=`UPDATE repuestos SET descripcion="${datos.descripcion}" ,nombre="${datos.nombre}",precio=${datos.precio},distribuidor="${datos.distribuidor}" WHERE id_repuesto=${datos.id}`; 
  coneccion.query(query_sumar, function(err,data){
    if(err) throw err;
    callback(data)
  })
}



function crear_repuesto(coneccion,datos,marca,modelo,callback){ 
  console.log(datos)
    let query=`INSERT INTO repuestos( nombre, distribuidor, cantidad, precio, descripcion,fk_marca,fk_modelo) VALUES ('${datos.nombre}','${datos.distribuidor}',${datos.cantidad},${datos.precio},'${datos.descripcion}','${marca}','${modelo}')`;
    coneccion.query(query, function(err,data){
      if(err) throw err;
      callback(data)
    })
}

function validar_repuerto_id(coneccion,id,callback){ //revisa por id (int) si el repuesto existe


  let query_validar=`SELECT COUNT(cantidad) AS cantidad FROM repuestos WHERE id_repuesto = ${id}`; 
  
  coneccion.query(query_validar, function(err,data){
    if(err) throw err;
    if(data[0].cantidad==0){
      callback(false)
    }
    else{
      callback(true)
    }

  })
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
  let query=`SELECT id_orden,fecha_creacion,fk_cliente,fk_recepcionista,descripcion_falla FROM orden_trabajo  WHERE orden_trabajo.estado=2`;
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)
  })
}


function mostrar_ordenes_para_retirar(coneccion,callback){
  let query=`SELECT id_orden,fk_cliente,clientes.nombrecompleto,descripcion_falla,tipo_equipo.tipo_equipo FROM orden_trabajo JOIN clientes ON orden_trabajo.fk_cliente =clientes.dni JOIN tipo_equipo on orden_trabajo.fk_tipo_equipo = tipo_equipo.id_tipo WHERE orden_trabajo.estado=5 `;
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)
  })
}

function mostrar_mis_ordenes(coneccion,datos,callback){
  let query=`SELECT  id_orden,fecha_creacion,fk_cliente,fk_recepcionista,descripcion_falla ,estados.nombre FROM orden_trabajo  JOIN estados ON orden_trabajo.estado =estados.id_estados WHERE fk_tecnico=${datos} AND estado != 5 AND estado != 6` ; //cambiar datos
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)
  })
}

function validar_orden_id(coneccion,datos,callback){  //si existe la orden retorna true 
  let query_validar=`SELECT COUNT(id_orden) AS id_orden FROM orden_trabajo WHERE id_orden = ${datos}`; 
  
  coneccion.query(query_validar, function(err,dato){
    if(err) throw err;
    if(dato[0].id_orden==0){ //no existe = falso
      callback(false)
    }
    else{
      callback (true) //existe true
    }
  })

  
}

function traer_orden_id(coneccion,datos,callback){
  let query=`SELECT  id_orden,descripcion_falla,estados.nombre FROM orden_trabajo  JOIN estados ON orden_trabajo.estado =estados.id_estados WHERE id_orden=${datos}` ; 
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)
  })
}


function tomar_orden(coneccion,datos,id_orden,callback){ //terminar

    coneccion.query(`UPDATE  orden_trabajo  set estado = 4, fk_tecnico=${datos}   WHERE id_orden = ${id_orden}`  , function(err,data){
      if(err) throw err;
      callback(data)
    })
}



//-------------------------------ESTADOS

function mostrar_estados(coneccion,selector,callback){
  let query
  if(selector==1){
    query="SELECT * FROM estados WHERE id_estados!=6 ";
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


function crear_modelo(coneccion,datos){ //revisa por id (int) si el repuesto existe
  let query=`INSERT INTO modelo (modelo) VALUES ('${datos}')`; 
  
  coneccion.query(query, function(err,data){
    if(err) throw err;
    console.log("modelos: ", data)
  })
}

function buscar_modelo_nombre(coneccion,dato,callback){ //revisa por id (int) si el repuesto existe
  let query=`SELECT * FROM modelo where modelo ="${dato}"`; 
  let dato_bbdd
  coneccion.query(query, function(err,data){
    if(err) throw err;
    console.log("modelo: ", data)
    callback(data)
  })
}

function validar_modelo_nombre(coneccion,datos,callback){  //si existe la orden retorna true 
  let query_validar=`SELECT COUNT(id_modelo) AS id_modelo FROM modelo WHERE modelo = "${datos}"`; 
  
  coneccion.query(query_validar, function(err,rows){
    if(err) throw err;
    console.log("datos de validar si existe: ", rows)
    if(rows[0].id_modelo==0){ //retorna false si no existe
      callback(false)
    }
    else{
      callback(true)
    }
  })
}



//-------------------------------MARCA

function validar_marca_nombre(coneccion,datos,callback){  //si existe la orden retorna true 
  let query_validar=`SELECT COUNT(id_marca) AS id_marca FROM marca WHERE marca="${datos}"`; 
  
  coneccion.query(query_validar, function(err,data){
    if(err) throw err;

    if(data[0].id_marca==0){ //retorna false si no existe
      callback (false)
    }
    else{
      callback (true)
    }
  })
}

function buscar_marca_nombre(coneccion,dato,callback){ //revisa por id (int) si el repuesto existe
  let query=`SELECT * FROM marca where marca ='${dato}'`; 
  
  coneccion.query(query, function(err,data){
    if(err) throw err;
    console.log("marca: ", data)
    callback(data)
  })
}

function crear_marca(coneccion,datos){ //revisa por id (int) si el repuesto existe
  let query=`INSERT INTO marca (marca) VALUES ('${datos}')`; 
  
  coneccion.query(query, function(err,data){
    if(err) throw err;
    console.log("marca: ", data)
  })
}

//-------------------------------FUNCIONES GENERICAS

function select_from(coneccion,tabla,callback){
  let query=`SELECT * FROM ${tabla}`; 
  coneccion.query(query, function(err,data){
    if(err) throw err;
    console.log("select * from: ", data)
    callback(data)
  })
}

function insert (coneccion,tabla,datos){

  coneccion.query(`INSERT INTO ${tabla} set ?`,[datos],function(err,data){
    if(err) throw err;
    console.log(data)
  })
}



module.exports={crear_repuesto,ingresar_stock,validar_repuerto_id,validar_usuario_id,mostrar_ordenes_espera,mostrar_mis_ordenes,validar_orden_id,traer_orden_id,
mostrar_estados,contar_repuerto_id,mostrar_repuesto_id,modificar_repuesto_id,crear_marca,crear_modelo,buscar_marca_nombre,buscar_modelo_nombre,validar_marca_nombre,
validar_modelo_nombre,select_from,insert,mostrar_cliente_id,update_cliente,validar_cliente_id,mostrar_usuario_id,update_usuario,login,tipo_usuario,tomar_orden,
deshabilitar_usuario,mostrar_ordenes_para_retirar
}