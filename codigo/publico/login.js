function inicio(){
    let a =document.getElementById('form_login')
    a.addEventListener('submit',validar)
}

function validar(e){
    e.preventDefault()

    let usuario =document.getElementById('usuario')
    let contraseña =document.getElementById('contraseña')
    let error=[true,true]

    if(usuario.value.lenght<3 || usuario.value.lenght<20){
        usuario.classList.add('is-invalid')
        error[0]=false
    }
    if(contraseña.value.lenght<3 || contraseña.value.lenght<20){
        contraseña.classList.add('is-invalid')
        error[1]=false
    }

    if(error[1]==true && error[0]==true){
        this.submit()
    }
}


window.onload=inicio