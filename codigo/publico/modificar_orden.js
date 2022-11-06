

function inicio(){
    let form =document.getElementById('form_modificar_orden')
    form.addEventListener('submit',validar)
    $('#repuesto').select2()
    $('#repuesto2').select2()
    


}

function validar(e){
    e.preventDefault()
    var datos_op=document.getElementById('datos_op').value
    var x=datos_op.replace(/(\r\n|\n|\r)/gm, " ").replace(/(")/gm, "'")
    document.getElementById('datos_op').value=x
    console.log(datos_op.value)

    this.submit()
}




window.onload=inicio