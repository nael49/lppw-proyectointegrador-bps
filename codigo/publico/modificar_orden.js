

function inicio(){
    let form =document.getElementById('form_modificar_orden')
    form.addEventListener('submit',validar)
    let repuesto =document.getElementById('repuesto')
    repuesto.addEventListener('change',mostrar_cantidad)
    $("#repuesto2").select2()
    form.addEventListener('submit',validar)
}

function mostrar_cantidad(){
    let repuesto =document.getElementById('repuesto').value
    let label =document.getElementById('label_cantidad')
    label.innerHTML="Cantidad  => En stock="

    fetch('/cantidad', {
        method: 'POST',
        headers:{'Content-type':'application/json'},
        body: JSON.stringify({id:repuesto})
     })
     .then(response=>response.json())
    .then(datos=>mostrar1(datos))

    var mostrar1 =(tipos) =>{
        label.innerHTML+=tipos[0].cantidad
    }

}

function validar(e){
    e.preventDefault()
    var datos_op=document.getElementById('datos_op').value
    var x=datos_op.replace(/(\r\n|\n|\r)/gm, " ").replace(/(")/gm, "'")
    document.getElementById('datos_op').value=x


    this.submit()
}




window.onload=inicio