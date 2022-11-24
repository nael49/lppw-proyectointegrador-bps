

function aranque(){
    const ordenamiento=document.getElementById('ordenamiento')
    var t=ordenamiento.value
    ordenamiento.addEventListener('change',ordenar)
    ordenar()
}

function ordenar(){
    const valor=document.getElementById('ordenamiento').value

    var tbody =document.getElementById('tbody')
    tbody.innerText=""
    var thead =document.getElementById('thead')
    thead.innerText=""

    fetch('/ordenar_pagos',{
        method: 'POST',
        headers:{'Content-type':'application/json'},
        body: JSON.stringify({id:valor})
     })
    .then(response=>response.json())
    .then(datos=>cambiar(datos))

    var cambiar =(tipos) =>{

        var mes=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
        if(parseInt(valor)==1){
            var lista=["MES","DIA","PAGO"]
            
            cabezera(lista)

            for (let index = 0; index < tipos.length; index++) {
                var z=document.createElement('tr') //datos 
                var y1=document.createElement('td')
                var y2=document.createElement('td')
                var y3=document.createElement('td') //dentro del tr
                y1.classList.add("text-center")
                y2.classList.add("text-center")
                y3.classList.add("text-center")


                y1.innerHTML=mes[(tipos[index].MES)-1]
                z.appendChild(y1)

                y2.innerHTML=tipos[index].DIA
                z.appendChild(y2)

                y3.innerHTML=tipos[index].PAGO
                z.appendChild(y3)
                
                tbody.appendChild(z)
            }
        }
        if(parseInt(valor)==2){
            var lista=["AÑO","MES","PAGO"]
            cabezera(lista)
            for (let index = 0; index < tipos.length; index++) {
                var z=document.createElement('tr') //datos 
                var y1=document.createElement('td')
                var y2=document.createElement('td')
                var y3=document.createElement('td') //dentro del tr
                y1.classList.add("text-center")
                y2.classList.add("text-center")
                y3.classList.add("text-center")

                y1.innerHTML=tipos[index].AÑO
                z.appendChild(y1)

                y2.innerHTML=mes[(tipos[index].MES)-1]
                z.appendChild(y2)

                y3.innerHTML=tipos[index].PAGO
                z.appendChild(y3)
                
                tbody.appendChild(z)
            }
        }
        if(parseInt(valor)==3){
            var lista=["AÑO","PAGO"]
            cabezera(lista)
            for (let index = 0; index < tipos.length; index++) {
                var z=document.createElement('tr') //datos 
                var y1=document.createElement('td')
                var y2=document.createElement('td')
                y1.classList.add("text-center")
                y2.classList.add("text-center")

                y1.innerHTML=tipos[index].AÑO
                z.appendChild(y1)

                y2.innerHTML=tipos[index].PAGO
                z.appendChild(y2)
                
                tbody.appendChild(z)
            }
        }
    }
}

function cabezera(lista){
    for (let index = 0; index < lista.length; index++) {   //cabezera
        var thead =document.getElementById('thead')
        
        var x=document.createElement('th')
        x.classList.add("text-center")
        x.scope="col"
        x.innerHTML=lista[index]
        thead.appendChild(x)
    }
}


document.addEventListener('DOMContentLoaded',aranque,false)