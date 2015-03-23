/**
     * Funcion que captura las variables pasados por GET
     * http://www.lawebdelprogramador.com/pagina.html?id=10&pos=3
     * Devuelve un array de clave=>valor
     */
    function getGET()
    {
        // capturamos la url
        var loc = document.location.href;
        // si existe el interrogante
        if(loc.indexOf('?')>0)
        {
            // cogemos la parte de la url que hay despues del interrogante
            var getString = loc.split('?')[1];
            // obtenemos un array con cada clave=valor
            var GET = getString.split('&');
            var get = {};

            // recorremos todo el array de valores
            for(var i = 0, l = GET.length; i < l; i++){
                var tmp = GET[i].split('=');
                get[tmp[0]] = unescape(decodeURI(tmp[1]));
            }
            return get;
        }
    }
    
    function params ()
    {
        // Cogemos los valores pasados por get
        var valores=getGET();
        var arrGet = [];
        if(valores)
        {
            // hacemos un bucle para pasar por cada indice del array de valores
            for(var index in valores)
            {                
                arrGet[index] = valores[index];
            }
            //document.write("<br>clave: "+arrGet['u']+" - valor: "+Base64.decode(arrGet['u']));
            //document.write("<br>clave: "+arrGet['p']+" - valor: "+Base64.decode(arrGet['p']));
            return arrGet; // retorno array con parametros get
        }else{
            // no se ha recibido ningun parametro por GET
            document.write("<br>No se ha recibido ningún parámetro");
        }
    }