const mysql=require('mysql')
const conect_sql=require('./conexion_con_bbdd')
//-------------------------------------------------------   CLIENTE ------------------------------------------------------- 

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


// -------------------------------------------------------    USUARIOS  ------------------------------------------------------- 
function tipo_usuario(coneccion,id,callback){
  let query=`SELECT puesto FROM usuarios_general WHERE dni = ${id}`; 
  coneccion.query(query, function(err,data){
    if(err) throw err;
    console.log('datos traidos del login',data[0].puesto)
    callback(data[0].puesto)
    }
)}

function deshabilitar_usuario(coneccion,id){
  let query=`UPDATE usuarios_general SET estado=2 WHERE dni = ${id}`; 
  coneccion.query(query, function(err,data){
    if(err) throw err;
    }
)}

function login(coneccion,datos,callback){
  let query=`SELECT nombrecompleto,puesto,dni  FROM usuarios_general WHERE dni = ${datos.usuario} AND pass =${datos.contraseña} AND estado =1`; 
  coneccion.query(query, function(err,data){
    if(err) throw err;
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

function update_usuario(coneccion,tabla,id,datos){

  coneccion.query(`update ${tabla} set ? WHERE dni=${id}`,[datos],function(err){
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



// -------------------------------------------------------   REPUESTOS ------------------------------------------------------- 
function mostrar_repuestos_marca_modelo(coneccion,callback){
  let query=`SELECT cantidad,id_repuesto,nombre,marca,modelo FROM repuestos JOIN marca ON repuestos.fk_marca=marca.id_marca JOIN modelo ON repuestos.fk_modelo=modelo.id_modelo WHERE repuestos.cantidad != 0 `; 
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data) 
  })
}

function mostrar_repuestos_marca_modelo_para_pedidos(callback){
  let query=`SELECT cantidad,id_repuesto,nombre,marca,modelo FROM repuestos JOIN marca ON repuestos.fk_marca=marca.id_marca JOIN modelo ON repuestos.fk_modelo=modelo.id_modelo`; 
  conect_sql.query(query, function(err,data){
    if(err) throw err;
    callback(data) 
  })
}

function buscar_repuestos_marca_modelo_por_id(coneccion,id,callback){
  let query=`SELECT repuestos.id_repuesto, repuestos.nombre, marca.marca, modelo.modelo FROM repuestos_orden JOIN repuestos ON repuestos.id_repuesto=repuestos_orden.fk_repuesto JOIN marca on marca.id_marca=repuestos.fk_marca JOIN modelo ON modelo.id_modelo=repuestos.fk_modelo WHERE repuestos_orden.fk_orden=${id} `; 
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data) 
  })
}
function ingresar_stock (coneccion,datos,operacion){ //trae la cantidad y suma o resta dependiento la "operacion"

  if(operacion=="suma"){
    let query_sumar=`UPDATE repuestos SET cantidad= cantidad+${datos.cantidad} WHERE id_repuesto=${datos.id_repuesto}`; 
    coneccion.query(query_sumar)
  }

  if(operacion=="resta"){
    if (datos.cantidad==0 ||datos.cantidad==undefined){datos.cantidad=1}; //sino se le pasa nada se resta uno
    let query_resta=`UPDATE repuestos SET cantidad=cantidad-${datos.cantidad} WHERE id_repuesto=${datos.id_repuesto}`; 
    coneccion.query(query_resta)
  }
}

function modificar_repuesto_id(coneccion,datos,callback){ //trae la cantidad y suma o resta dependiento la "operacion"
  console.log(datos)

  let query_sumar=`UPDATE repuestos SET descripcion="${datos.descripcion}" ,nombre="${datos.nombre}",precio=${datos.precio},distribuidor="${datos.distribuidor}" WHERE id_repuesto=${datos.id}`; 
  coneccion.query(query_sumar, function(err,data){
    if(err) throw err;
    callback(data)
  })
}



function crear_repuesto(coneccion,datos,marca,modelo){ 
  console.log(datos)
    let query=`INSERT INTO repuestos( nombre, distribuidor, cantidad, precio, descripcion,fk_marca,fk_modelo) VALUES ('${datos.nombre}','${datos.distribuidor}',${datos.cantidad},${datos.precio},'${datos.descripcion}','${marca}','${modelo}')`;
    coneccion.query(query)
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

function contar_repuerto_id(coneccion,id,calllback){ //revisa por id (int) si el repuesto existe
  let query_validar=`SELECT cantidad  FROM repuestos WHERE id_repuesto = ${id}`; 
  
  coneccion.query(query_validar, function(err,data){
    if(err) throw err;
    calllback(data)
  })
}



function mostrar_repuesto_id(coneccion,id,callback){ //revisa por id (int) si el repuesto existe
  let query=`SELECT id_repuesto, nombre, distribuidor,cantidad, precio, descripcion, marca.marca, modelo.modelo FROM repuestos JOIN marca ON repuestos.fk_marca=marca.id_marca JOIN modelo ON repuestos.fk_modelo= modelo.id_modelo WHERE id_repuesto = ${id}`; 
  
  coneccion.query(query, function(err,data){
    if(err) throw err;
    console.log("repuesto: ", data)
    callback(data)
  })
}
function mostrar_repuestos_con_marca_modelo_stock(coneccion,callback){
  let query=`SELECT id_repuesto, nombre, distribuidor,cantidad, precio, descripcion, marca.marca, modelo.modelo FROM repuestos JOIN marca ON repuestos.fk_marca=marca.id_marca JOIN modelo ON repuestos.fk_modelo= modelo.id_modelo`
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)
  })
}

// ------------------------------------------------   ORDENES -----------------------------------------------  
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
  let query=`SELECT  id_orden,descripcion_falla,estados.nombre,datos_importantes FROM orden_trabajo  JOIN estados ON orden_trabajo.estado =estados.id_estados WHERE id_orden=${datos}` ; 
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)
  })
}


function tomar_orden(coneccion,datos,id_orden,callback){ 

    coneccion.query(`UPDATE  orden_trabajo  set estado = 3,hora_inicio=NOW(), fk_tecnico=${datos}   WHERE id_orden = ${id_orden}`  , function(err,data){
      if(err) throw err;
      callback(data)
    })
}

function mostrar_todas_las_ordenes(coneccion,callback){ 
  coneccion.query(`SELECT id_orden,fecha_creacion,fecha_retiro,fk_tecnico,fk_recepcionista,fk_cliente,estados.nombre AS estado,descripcion_falla,tipo_equipo.tipo_equipo FROM orden_trabajo JOIN tipo_equipo on tipo_equipo.id_tipo=orden_trabajo.fk_tipo_equipo JOIN estados ON estados.id_estados=orden_trabajo.estado`, function(err,data){
    if(err) throw err;
    callback(data)
  })
}


//------------------------------------------------------ ESTADOS ------------------------------------------------------- 

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

function traer_id_estado(coneccion,dato,callback){
  let query=`SELECT id_estados FROM estados WHERE nombre='${dato}' `;
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)
  })
}

//-------------------------------     MODELO    ------------------------------------------------------- 
 

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



//------------------------------------------------------- MARCA     ------------------------------------------------------- 

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

//-------------------------------------------------------    FUNCIONES GENERICAS ------------------------------------------------------- 

function select_from(coneccion,tabla,callback){
  let query=`SELECT * FROM ${tabla}`; 
  coneccion.query(query, function(err,data){
    if(err) throw err;
    callback(data)
  })
}

function insert (coneccion,tabla,datos){
  coneccion.query(`INSERT INTO ${tabla} set ?`,[datos],function(err,data){
    if(err) throw err;
  })
}

function select_from_where_condicion(tabla,columna,condicion,dato,callback){
  let query
  if (condicion==1) {
    query=`SELECT * FROM ${tabla} WHERE ${columna}<${dato}`; 
  }
  if (condicion==2) {
    query=`SELECT * FROM ${tabla} WHERE ${columna}>${dato}`
  }
  conect_sql.query(query, function(err,data){
    if(err) throw err;
    console.log("select * from: ", data)
    callback(data)
  })
}

function select_from_where_id(tabla,columna,id,callback){
  let query=`SELECT * FROM ${tabla} WHERE ${columna}=${id}`; 
  conect_sql.query(query, function(err,data){
    if(err) throw err;
    console.log("select * from: ", data)
    callback(data)
  })
}

//-------------------------------------------------------  REPUESTO_ORDEN     ------------------------------------------------------- 

function select_repuesto_orden_id_orden(coneccion,id,callback){
  coneccion.query(`SELECT * FROM repuestos_orden WHERE fk_orden=${id}`,function(err,data){
    if(err) throw err;
    callback(data)
  })
}


function repuesto_orden_exite_el_repuesto(coneccion,data,callback){
  coneccion.query(`SELECT COUNT(cantidad) AS cantidad FROM repuestos_orden WHERE fk_orden=${data.orden} AND fk_repuesto= ${data.repuesto}` ,function(err,data){
    if(err) throw err;
    if(data.cantidad==0){
      callback(false)
    }
    else{
      callback(true)
    }
    
  })
}
//---------------------------------------------  GRAFICOS ------------------------------------------------------- 

function graficos_tipo_equipo_mes(coneccion,callback){
  let query= `SELECT tipo_equipo.tipo_equipo AS TIPO, COUNT(id_orden) as CANTIDAD FROM orden_trabajo JOIN tipo_equipo ON orden_trabajo.fk_tipo_equipo=tipo_equipo.id_tipo WHERE hora_inicio BETWEEN DATE_SUB(NOW(), INTERVAL 4 MONTH) AND NOW() GROUP BY fk_tipo_equipo DESC`
  coneccion.query(query,function(err,data){
    console.log(data)
    callback(data)
  })
}


function graficos_ingresos_por_año(coneccion,callback){
  let query= `SELECT MONTH(hora_fin) MES, SUM(pago) TOTAL FROM orden_trabajo WHERE YEAR(hora_fin) = YEAR(NOW()) GROUP BY Mes DESC;`
  coneccion.query(query,function(err,data){
    console.log(data)
    callback(data)
  })
}

function repuestos_mas_usados(coneccion,callback){
  let query= `SELECT repuestos.nombre,modelo.modelo, COUNT(fk_orden) AS CANTIDAD FROM repuestos_orden JOIN repuestos ON repuestos.id_repuesto= repuestos_orden.fk_repuesto JOIN modelo on modelo.id_modelo=repuestos.fk_modelo GROUP BY fk_repuesto  ASC LIMIT 5`
  coneccion.query(query,function(err,data){
    console.log(data)
    callback(data)
  })
}

//---------------------------------------------  NOTIFICACIONES ------------------------------------------------------- 

function mostrar_notificaciones(coneccion,puesto,callback){   //(MEJORAR EL ORDENAMIENTO)
  let query= `SELECT id,tipo,leido,fecha FROM notificaciones WHERE para ="${puesto}"`
  coneccion.query(query,function(err,data){
    callback(data)
  })
}

function marcar_como_leido(coneccion,puesto){
  let query= `UPDATE notificaciones set leido=1 WHERE para ="${puesto}"`
  coneccion.query(query)
  
}


//---------------------------------------- INFORMES --------------------------------------------------

function informe_tecnico_id(coneccion,id,callback){
  let query= `SELECT fk_tecnico,hora_inicio,hora_fin,id_orden,tipo_equipo.tipo_equipo FROM orden_trabajo JOIN tipo_equipo ON tipo_equipo.id_tipo=orden_trabajo.fk_tipo_equipo WHERE fk_tecnico =${id} AND estado =5`
  coneccion.query(query,function(err,data){
    callback(data)
  })
}



function informe_pagos(coneccion,filtro,callback){ // terminar y cambiar estado a 6
  let query
  if(filtro=="dia"){
    query= `SELECT DAY(hora_fin) AS DIA,MONTH(hora_fin) AS MES, SUM(pago) AS PAGO FROM orden_trabajo WHERE estado=5 AND YEAR(NOW())=YEAR(hora_fin) GROUP BY DAY(hora_fin) ORDER BY MONTH(hora_fin)`
  }
  if(filtro=="mes"){
    query= `SELECT MONTH(hora_fin) AS MES,YEAR(hora_fin) AS AÑO, SUM(pago) AS PAGO FROM orden_trabajo WHERE estado=5 AND YEAR(NOW())=YEAR(hora_fin) GROUP BY MONTH(hora_fin) ORDER BY YEAR(hora_fin)`
  }
  if(filtro=="año"){
    query= `SELECT YEAR(hora_fin) AS AÑO, SUM(pago) AS PAGO FROM orden_trabajo WHERE estado=5  GROUP BY YEAR(hora_fin) ORDER BY YEAR(hora_fin)`
  }
  coneccion.query(query,function(err,data){
    callback(data)
  })
}


//--------------------------------------------------------PEDIDOS--------------------------------------

function validar_pedido_id(id,callback){ //revisa por id (int) si el repuesto existe
  let query_validar=`SELECT COUNT(cantidad) AS cantidad FROM pedidos WHERE id = ${id}`; 
  
  conect_sql.query(query_validar, function(err,data){
    if(err) throw err;
    if(data[0].cantidad==0){
      callback(false)
    }
    else{
      callback(true)
    }
  })
}

function update_pedidos(tabla,id,datos){

  conect_sql.query(`update ${tabla} set ? WHERE id=${id}`,[datos],function(err){
    if(err) throw err;
  })
}


module.exports={crear_repuesto,ingresar_stock,validar_repuerto_id,validar_usuario_id,mostrar_ordenes_espera,mostrar_mis_ordenes,validar_orden_id,traer_orden_id,
mostrar_estados,contar_repuerto_id,mostrar_repuesto_id,modificar_repuesto_id,crear_marca,crear_modelo,buscar_marca_nombre,buscar_modelo_nombre,validar_marca_nombre,
validar_modelo_nombre,select_from,insert,mostrar_cliente_id,update_cliente,validar_cliente_id,mostrar_usuario_id,update_usuario,login,tipo_usuario,tomar_orden,
deshabilitar_usuario,mostrar_ordenes_para_retirar,mostrar_repuestos_marca_modelo,traer_id_estado,mostrar_repuestos_con_marca_modelo_stock,buscar_repuestos_marca_modelo_por_id,
select_repuesto_orden_id_orden,graficos_tipo_equipo_mes,graficos_ingresos_por_año,repuestos_mas_usados,mostrar_todas_las_ordenes,mostrar_notificaciones,marcar_como_leido,
repuesto_orden_exite_el_repuesto,informe_tecnico_id,informe_pagos,select_from_where_condicion,select_from_where_id,mostrar_repuestos_marca_modelo_para_pedidos,validar_pedido_id,
update_pedidos
}