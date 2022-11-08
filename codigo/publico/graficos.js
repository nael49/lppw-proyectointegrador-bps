
function inicio(){
    var ctx1=document.getElementById('myChart1').getContext('2d');
    var ctx2=document.getElementById('myChart2').getContext('2d');
    var ctx3=document.getElementById('myChart3').getContext('2d');

    const myChart1=new Chart(ctx1,{
        type:'bar',
        data:{
            datasets: [{
              label: "tipos de equipos reparados",
              backgroundColor:['rgba(255, 99, 132)','rgba(255, 159, 64)','rgba(255, 205, 86)','rgba(75, 192, 192)'],
              borderColor:['black'],
              borderWidth:1,

            }]
        },
        options: {
            scale:{
                y:{
                    beginAtZero:true
                },
                x: {
                    grid: {
                      offset: true
                    }
                }
            }
        }
    })
    var url ='graficos/tipos_equipo';
    fetch(url)
        .then(response=>response.json())
        .then(datos=>mostrar(datos))

    var mostrar =(tipos) =>{
        tipos.forEach(element => {
            myChart1.data['labels'].push(element.TIPO)
            myChart1.data['datasets'][0].data.push(element.CANTIDAD)
            
        });
    myChart1.update()
    //console.log(myChart1.data)
    }
    
    
    const myChart2=new Chart(ctx2,{
        type: 'bar',
        data: {
            labels:["compu","celular"],
            datasets: [{
                label: 'tipos de equipos',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
                data:[3,4],
            }]
        },
        options: {
            scale:{
                y:{
                    beginAtZero:true
                },
                x:{
                    
                }
            }
        }
    })
}


window.onload=inicio