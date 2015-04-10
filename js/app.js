$(document).ready(function() {
    
    // Wait for device API libraries to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
        navigator.splashscreen.hide();        
    }
    
    
  $("#message").css("display","none");
  $("#msg_user").css("display","none");
  
  $("#tabla").css("display","none");
  
  $("#user").attr("placeholder","Código Universitario");
  $("#user").attr("maxlength","10");

//  $('#user').keypress(function (){
//    //this.value = (this.value + '').replace(/[^0-9]/g, '');
//    if ((event.keyCode < 48) || (event.keyCode > 57))
//        event.returnValue = false;
//  });

  $('#user').blur(function (){
      if (this.value.length < 10)
      {
          $("#msg_user").css("display","block");
           $("#message").css("display","none");
          $("#msg_user").text("El campo debe contener 10 dígitos");
      }else
      {
          $("#msg_user").css("display","none");
      }
  });

  function valida (val)
  {
      if (val.length > 0)
      {
          return true;
      }
      return false;
  }

  $("#login").click(function() {
        var user = $("#user").val();
        var pass = $("#password").val(); 

        if (!(valida(user) && valida(pass)))
        {
            $("#message").css("display","block");            
            $("#message").text("Debe completar todos los campos");
           
        }else{
            
            $("#message").css("display","none");
            $("#msg_user").css("display","none");
            $("#message").text("");
            var request = $.ajax({
            url: "http://alumnos.unp-academico.com/test/historial.php",
            type: "post",
            dataType: "json",
            data: {
                ALUMNO : user,
                DNI: pass
            },
            beforeSend:function(){$("#login").text("Accediendo...").css("disabled",!0)}
          });          
          
          
          request.done(function( response ) {
              $("#login").text("Acceder").css("disabled",0);              
              //alert("semestres.html?u=" + Base64.encode(user) + "&p=" + Base64.encode(pass));
              if (response.Exito === "1")
              {
                  window.location.href = "semestres.html?u=" + Base64.encode(user) + "&p=" + Base64.encode(pass);
              }else
              {
                  $("#message").css("display","block");
                  $("#message").text(response.Mensaje);
              }
              
          });
          request.fail(function( jqXHR, textStatus , err ) {
              $("#login").text("Acceder").css("disabled",0);
              $("#message").css("display","block");
              $("#message").text("Ocurrió un error, inténtelo más tarde");
          });

          }
    });
    
//    $("#btnMostrar").click(function (){
//        var datos = params();
//        $("#user").text(Base64.decode(datos['u'])).css("color","#000");
//        $("#pass").text(Base64.decode(datos['p'])).css("color","#000");
//    });
    var datos = params();
    $("#user").text(Base64.decode(datos['u'])).css("color","#000");
    $("#pass").text(Base64.decode(datos['p'])).css("color","#000");
    
    var usuario = Base64.decode(datos['u']);
    var password = Base64.decode(datos['p']);
    
    /////////-- consulta para traer la data de cursos
    var request = $.ajax({
        url: "http://alumnos.unp-academico.com/test/historial.php",
        type: "post",
        dataType: "json",
        data: {
            ALUMNO : usuario,
            DNI: password
        },
        beforeSend:function(){$("#img_load").css("background","img/loading.gif")}
      });
      
      request.done(function( response ) {              
              //alert("semestres.html?u=" + Base64.encode(user) + "&p=" + Base64.encode(pass));
              if (response.Exito === "1")
              {
                  $("#codigo").text(usuario).css("color","#FF0000");              
                  $("#alumno").text(response.NOMBRE).css("color","#FF0000"); 
                  //----------------carga de combo------------------------------
                  var regs = response.HISTORIAL.length;
                  
                  var arr = [];
                  for (i = 0 ; i < regs ; i++)
                  {
                      arr[i] = response.HISTORIAL[i].SEMESTRE.trim();
                  }
                  //console.log( arr );
                  var arr2 = [];
                  arr2 = eliminateDuplicates(arr);
                  //console.log( arr2 );
                  for (j = 0 ; j < arr2.length ; j++)
                  {
                      $("#semestres").append("<option value='"+arr2[j]+"'> Semestre  "+arr2[j]+"</option>");                      
                  }
                  
                  var cursos = [];
                  
                  for(i = 0; i<regs; i++)
                  {
                      cursos[i] = response.HISTORIAL[i];
                  }
                  //console.log(cursos);                                    
                  
                  //--------------------------SELCT
                  var sem = "";
                  $("#semestres").change(function (){
                      sem = $("#semestres").val();
                      if (sem == 0)
                      {
                          $("#tabla").css("display","none");
                      }else
                      {
                          $("#tabla").css("display","block");
                      }
                      $("table tbody").text("");
                      //console.log(sem);                      
                      //-------------solo sem
                        var cur_sem = [];
                        var n = 0;
                        for (i = 0; i < regs; i++)
                        {
                            if (sem == $.trim(cursos[i]['SEMESTRE']))
                            {
                                cur_sem[n] = cursos[i];
                                 //console.log("OK ");
                                 n++;
                            }                            
                        }
                        
                        if(sem == 1)
                        {
                            for (j = 0; j< arr2.length; j++) {
                                for (i = 0; i < regs; i++)
                                {
                                    if (arr2[j] == $.trim(cursos[i]['SEMESTRE']))
                                    {
                                        cur_sem[n] = cursos[i];
                                         //console.log("OK ");
                                         n++;
                                    }                            
                                }
                            }
                        }
                        
                        //console.log(sem+" :: todo: "+regs+" solo: "+cur_sem.length);
                        //console.log(cur_sem);
                        var cabeza = "";
                         if (sem == 1)
                        {
                            cabeza = "";
                            cabeza = "<th>Semestre</th>" + $("table thead tr").html();
                            $("table thead tr").html(cabeza);
                        }else
                        {
                            cabeza = "";
                            cabeza = "<th>Código</th><th>Curso</th><th>Cred.</th><th>Nota</th><th>C.</th>";
                            $("table thead tr").html(cabeza);
                        }
                        //console.log(cabeza);
                        for(i = 0; i < cur_sem.length; i++)
                        {
                            $("table tbody").append("<tr>");
                            if (sem == 1)
                            {
                                $("table tbody").append("<td>"+cur_sem[i]['SEMESTRE'] +"</td>");
                            }
                            $("table tbody").append("<td>"+cur_sem[i]['COD_CURSO']+"</td><td>"+cur_sem[i]['DESC_CURSO']+"</td><td>"+cur_sem[i]['CREDITOS']+"</td><td>"+cur_sem[i]['Nota']+"</td><td>"+cur_sem[i]['ciclo']+"</td>");
                            $("table tbody").append("</tr>");
                        }
                      
                  });
                  
                  
              }else
              {
                  $("#message").css("display","block");
                  $("#message").text(response.Mensaje);
              }
              
          });
          request.fail(function( jqXHR, textStatus , err ) {
              //salir
          });
          
          function eliminateDuplicates(arr) {
            var i,
                len=arr.length,
                out=[],
                obj={};

            for (i=0;i<len;i++) {
               obj[arr[i]]=0;
            }
            for (i in obj) {
               out.push(i);
            }
            return out;
           }
           
           
           //---------------------------------------          

} );

 function cambiaPass(caja) {
                var nuevo=document.createElement("input");
                nuevo.setAttribute("type","password");
                nuevo.setAttribute("name",caja.name);
                nuevo.setAttribute("value","");
                nuevo.setAttribute("style","width: 60%");
                nuevo.setAttribute("placeholder","Contraseña");
                nuevo.setAttribute("maxlength","30");
                nuevo.setAttribute("id",caja.id)
                document.getElementById("formulario").replaceChild(nuevo,caja);
                nuevo.focus();
            }