 window.onload=()=>{

    const elemTag=(x)=>document.querySelector(x);
    const formulario=elemTag("#formulario");
    const taskList=elemTag("#taskList");
    const btnClear= elemTag("#btnClear");
    const  Storage="tasks";
    const diasSe=[ "Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"];
    const mesAn=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
  .then(function(reg){
    console.log('Registro de SW exitoso',reg);
  })
  .catch(function(err){
    console.warn('Error al tratar de registrar el service worker',err);
  })
}

    if (typeof(Storage)!=="undefined") 
    {
        console.log("LocalStorage Disponible");    
    }else{
        console.log("LocalStorage no soportado en este navegador");
    }

    
    renderData()//cargamos los datos y los dibujamos en el listado

    formulario.addEventListener("submit",(e)=>{
        e.preventDefault();
       const tarea=formulario.querySelector("#inpTodo").value;
       const fecha=formulario.querySelector("#inpDate").value;
       
        if (tarea!=='' || fecha!=='') {
          let task={ "task":tarea,"date":fecha}
          localSave(task);
       
          elemTag("#alert").classList.remove("fadeClass");
        }
        else{

          elemTag("#alert").innerHTML="Todos los Campos deben de estar llenos";
          elemTag("#alert").classList.add("fadeClass");
          

        }




      

       
       formulario.reset();

    })//fin eventos del formulario

    taskList.addEventListener("click",(e)=>{

     


      if(e.target.id==="btnDelete"){

       deleteTask(e.path[1].id-1);
      }

      
      
    })

    btnClear.addEventListener("click",(e)=>{
      e.preventDefault();

      clearList();
      renderData()
    })


    function localSave(obj) {
        
        let personas=[];
        let items=localStorage.getItem(Storage);
        if(items!==null){          
          personas=JSON.parse(localStorage.getItem(Storage));           
        }
        
        
        personas.push(obj);
        
        console.log(personas);
        
        
        localStorage.setItem(Storage,JSON.stringify(personas));
        renderData()
    }//fin funcion localSave
    function renderData(){
      let tareas=setPriority();


    

      tareas.sort((a, b) => a.prioridad - b.prioridad)//reorganiza el arreglo por su prioridad de menor a mayor
      taskList.innerHTML='';
      tareas.forEach(function(item,index){  
            let clase='', date = new Date(item.fecha);
            if(item.prioridad<4){
              clase="critico"
            }
            else if(item.prioridad>=4 && item.prioridad <=5){
              clase="urgente"
            }
            else{
              clase="no_urgente"
            }
            taskList.innerHTML+=`<li class="listTask--list__item ${clase}" id='${index+1}' >  <p> ${item.tarea}.</p><span class="date"> <i class="fa fa-calendar"></i>  ${diasSe[date.getDay()]} ${parseInt(date.getDate()+1)} de ${mesAn[date.getMonth()]} del ${date.getFullYear()}</span><button class="btnDelete" id="btnDelete"><i class="fa fa-trash"></i></button></li>`;

            });



       if (tareas.length === 1 ) {
         elemTag(".cantidadTask").innerHTML=`Tienes ${tareas.length} tarea pendiente.`;
         btnClear.classList.toggle("hidden");
         btnClear.innerHTML="Limpiar Lista";
       }
       else if( tareas.length > 1 ){
         elemTag(".cantidadTask").innerHTML=`Tienes ${tareas.length} tareas pendientes.`
          btnClear.innerHTML="Limpiar Lista";
       }
      else {
         elemTag(".cantidadTask").innerHTML=` No tienes tareas pendientes.`;

         btnClear.classList.toggle("hidden")

      }
        console.table(tareas) 
         
    }//fin funcion renderData


   
    function setPriority(){
          
          let msPerDay = 24 * 60 * 60 * 1000; // Número de milisegundos por día
          let tareas=[],obj=[];//arreglos
          let tarea={};
          
          
          if(localStorage.getItem(Storage)!=null){
            tareas=JSON.parse(localStorage.getItem(Storage));
          }
          
          
          
          tareas.forEach((item)=>{
            let date=new Date(item.date),today= new Date(),prioridad;
            let dateDiff=Math.floor((date.getTime()-today.getTime())/msPerDay) + 1; //diferencia en dias de las dos fechas;
            prioridad= dateDiff >=1 ? dateDiff : 1;
            
            
            tarea={
              "tarea":item.task,
              "fecha":item.date,
              "prioridad":prioridad
                
            };
            
            obj.push(tarea);



          })    

         return obj;
    }//fin funcion SetPriority
  

function deleteTask(id) {
  console.log(id)

   let tareas=[],
        dataInLocalStorage=localStorage.getItem(Storage),
       confirmacion;
    
    tareas=JSON.parse(dataInLocalStorage);
    


    tareas.splice(id,1)
    


    confirmacion=confirm("¿Esta Seguro que desea eliminar esta Tarea?");
    
    if(confirmacion){
    
     localStorage.setItem(Storage,JSON.stringify(tareas));
       renderData();
   }
    console.table(tareas);
    
    
   
}

function clearList() {
  localStorage.removeItem(Storage);
}


}//fin funcion onload

  






