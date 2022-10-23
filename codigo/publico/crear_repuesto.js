function inicio(){
    let a =document.getElementById('form_crear_repuesto')
    a.addEventListener('submit',validar)
}

function validar(e){
    e.preventDefault()
    let nombre =document.getElementById('nombre')
    let marca =document.getElementById('marca')
    let precio =document.getElementById('precio')
    let cantidad =document.getElementById('cantidad')
    let distribuidor =document.getElementById('distribuidor')
    let descripcion =document.getElementById('descripcion')


    let error=[true,true,true,true,true,true]

    if(nombre.value.lenght<3 || nombre.value.lenght<50){
        nombre.classList.add('is-invalid')
        error[0]=false
    }
    if(marca.value.lenght<3 || marca.value.lenght<50){
        marca.classList.add('is-invalid')
        error[1]=false
    }
    if(parseInt(precio.value)<=0 ){
        precio.classList.add('is-invalid')
        error[2]=false
    }
    if(parseInt(cantidad.value)<=0 ){
        cantidad.classList.add('is-invalid')
        error[3]=false
    }
    if(distribuidor.value.lenght<3 || distribuidor.value.lenght<50){
        distribuidor.classList.add('is-invalid')
        error[4]=false
    }


    if(error[1]==true && error[0]==true  && error[2]==true  && error[3]==true  && error[4]==true){
        //this.submit()
    }

}


window.onload=inicio