 
const CACHE_NAME='v1_cache_lista_tareas',
urlsToCache=[
'./',
'./resources/imagenes/icon2.svg',
'./resources/js/fontAwesome.js',
'resources/js/script.js'

];


self.addEventListener('install',function(e){
 e.waitUntil(
 		caches.open(CACHE_NAME)
 		.then(function(cache){
 			return cache.addAll(urlsToCache)
 			.then(()=>self.skipWaiting())	
 		})
 		.catch((err)=>console.log("Fallo registro de cache",err))
 	)
})
/*una vez que se instala el SW, se activa y busca
 los recursos para hacer las funciones sin conexion*/
self.addEventListener('activate',function(e){
	const cacheWhiteList=[CACHE_NAME];

	e.waitUntil(
		caches.keys()
		.then((cachesNames)=>{
			cachesNames.map(cacheName=>{
				//Eliminamos lo que ya no se necesita en cache
				if (cacheWhiteList.indexOf(cacheName)== -1) {
					return caches.delete(cacheName)
				}
			})
		})
		//Le indica al SW activar la cache actual
		.then(()=>self.clients.claim())
	)
})

//cuando el navegador recupera una url
self.addEventListener('fetch',function(e){
	//Responde  ya sea con el objeto en cache o continua y busca la url real 
	 e.respondWith(
	 	caches.match(e.request)
	 	.then(res=>{
	 		if (res) {
	 			//recuperando del cache
	 			return res;
	 		}
	 		//recupera la url real
	 		return fetch(e.request);
	 	})
	)
})
