function inicio(){
    let a =document.getElementById('form_crear_usuario')
    a.addEventListener('submit',validar)
}

function validar(e){
    e.preventDefault()

    let nombreyapellido =document.getElementById('nombreyapellido')
    let DNI =document.getElementById('DNI')
    let puesto =document.getElementById('puesto')
    let fecha_ingreso =document.getElementById('fecha_ingreso')
    let numerocelular =document.getElementById('numerocelular')
    let direccion =document.getElementById('direccion')
    let localidad =document.getElementById('localidad')
    let email =document.getElementById('email')

    let error=[true,true,true]

    if(nombreyapellido.value.lenght<4 || nombreyapellido.value.lenght>50){
        nombreyapellido.classList.add('is-invalid')
        error[0]=false
    }
    if(direccion.value.lenght<3 || direccion.value.lenght>50){
        direccion.classList.add('is-invalid')
        error[1]=false
    }
    if(isNaN(parseInt(DNI.value)) || DNI.value.lenght<5 || DNI.value.lenght>9){
        DNI.classList.add('is-invalid')
        error[2]=false
    }


    if(error[0]==true && error[1]==true && error[2]==true){
        this.submit()
    }
}


window.onload=inicio