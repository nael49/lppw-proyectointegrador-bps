function inicio(){
    let form =document.getElementById('form_modificar_orden')
    form.addEventListener('submit',validar)

    $('#repuesto').select2()
    
}

function validar(e){
    e.preventDefault()

    this.submit()
}




window.onload=inicio