
    //variáveis da widget
    variavelNumerica = null,
    variavelCaracter = null,

    //método iniciado quando a widget é carregada

    	$(function () {
    		$('#fileupload').fileupload({
    		    dataType: 'json',
    		    done: function (e, data) {
    		    	
    		    	var myLoading1 = FLUIGC.loading('#upload-file');
    		    	myLoading1.show();

                    var folderId = $("#contractFolderId").val();

                    if(!folderId){
                        $.ajax({
                             async : false,
                                type : "POST",
                                contentType: "application/json",
                                url : '/api/public/ecm/document/createFolder',

                                data: JSON.stringify({
                                    "description": "teste",
                                    "parentId": "847",
                                }),

                                success: function(data) {
                                    console.log(data);
                                    folderId = data.content.id;
                                    $("#contractFolderId").val(folderId);
                                },
                        });
                    }

                    
    		    	console.log(data.result.files);
    		        $.each(data.result.files, function (index, file) {
    		            $.ajax({
    		                async : true,
    		                type : "POST",
    		                contentType: "application/json",
    		                url : '/api/public/ecm/document/createDocument',
    		
    		        		data: JSON.stringify({
    		        			"description": file.name,
    		        			"parentId": folderId,
    		        			"attachments": [{
    		        				"fileName": file.name
    		        			}],
    		        		}),

    		        		error: function() {
    		        			FLUIGC.toast({
    		        			     title: '',
    		        			     message: "Falha ao enviar",
    		        			     type: 'danger'
    		        			 });
    		        			myLoading1.hide();
    		        		},
    		        		
    		        		success: function(data) {
    		        			FLUIGC.toast({
    		        			     title: '',
    		        			     message: "Documento publicado - " + file.name,
    		        			     type: 'info'
    		        			 });
    		        			myLoading1.hide();
    		        		},
    		        	});
    		        });
    		    }
    		});
    	});

  
    //BIND de eventos
   
