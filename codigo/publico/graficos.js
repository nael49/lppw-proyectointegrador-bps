
function inicio(){

    var ctx1=document.getElementById('myChart1').getContext('2d');
    var ctx2=document.getElementById('myChart2').getContext('2d');
    //var ctx3=document.getElementById('myChart3').getContext('2d');
    var ctx4=document.getElementById('myChart4').getContext('2d');

//-------------------------------------------------------------------------------------------------
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
        .then(datos=>mostrar1(datos))

    var mostrar1 =(tipos) =>{
        tipos.forEach(element => {
            myChart1.data['labels'].push(element.TIPO)
            myChart1.data['datasets'][0].data.push(element.CANTIDAD)
            
        });
    myChart1.update()
    }
    
//---------------------------------------------------------------------------------------------------
    
    const myChart2=new Chart(ctx2,{
        type: 'bar',
        data: {
            datasets: [{
                label: 'Repuestos',
                backgroundColor: ['rgba(255, 99, 132)','rgba(255, 159, 64)','rgba(255, 205, 86)','rgba(75, 192, 192)'],
                borderColor: ['black'],
                borderWidth: 1,
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
    var url ='graficos/repuestos_mas_usados';
    fetch(url)
        .then(response=>response.json())
        .then(array=>mostrar2(array))

    var mostrar2 =(array) =>{
        array.forEach(element => {
            myChart2.data['labels'].push(element.nombre+" "+element.modelo)
            myChart2.data['datasets'][0].data.push(element.CANTIDAD)
            
        });
    myChart2.update()
    }

//------------------------------------------------------------------------------------------------

    const myChart4=new Chart(ctx4,{
        type:'line',
        data:{
            datasets: [{
                label: "Ventas",
                borderColor: ['red'],
                backgroundColor: ['red'],
                fill: false,
                borderWidth:1,
            }]
        },
        options: {
            scale:{
                x:{
                    beginAtZero:false
                }
            },
            plugins: {
            filler: {
                propagate: false,
            },
            },
            interaction: {
            intersect: false,
            }
        }
    })
    var url ='graficos/ingresos_year';
    fetch(url)
        .then(response=>response.json())
        .then(datos=>mostrar(datos))

    var mostrar =(tipos) =>{
        tipos.forEach(element => {
            myChart4.data['labels'].push(element.MES)
            myChart4.data['datasets'][0].data.push(element.TOTAL)
            
        });
        
    myChart4.update()
    }
    

}
window.onload=inicio