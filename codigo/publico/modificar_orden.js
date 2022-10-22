function inicio(){
    let form =document.getElementById('form_modificar_orden')
    form.addEventListener('submit',validar)
    let repuesto =document.getElementById('repuesto')
}

function validar(e){
    e.preventDefault()

    this.submit()
}




window.onload=inicio