function aranque(){
    var noti=document.getElementById('noti')
    var cuenta=document.getElementById('cuenta')
    var nav_notificaciones=document.getElementById('dropdownMenuButton1')
    nav_notificaciones.addEventListener('click',marcar_leido)

    var url ='/notificaciones';
    fetch(url)
        .then(response=>response.json())
        .then(datos=>mostrar1(datos))

    var mostrar1 =(tipos) =>{
        console.log(tipos)
        var contador=0
        tipos.forEach(element => {
            var hr =document.createElement('hr')
            noti.innerHTML+=element.tipo,'<br><a class="nav-link" href="/leido/'+element.id
            noti.appendChild(hr)
            if(element.leido==0){
                console.log(element.leido)
                contador+=1
            }
        });
        cuenta.innerHTML=contador
    }
}

function marcar_leido(){
    var puesto={
        puesto:document.getElementById('puesto_usuario').innerHTML
    }
    $.ajax({
        url:"/leido",
        type:"POST",
        data:puesto,
        success:function(info){
            console.log("leido")
            var cuenta2=document.getElementById('cuenta')
            cuenta2.innerHTML=0
        },
    })
}
document.addEventListener('DOMContentLoaded',aranque,false)




