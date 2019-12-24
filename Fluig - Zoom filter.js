function setSelectedZoomItem(selectedItem) {
	
	var sistema = "solicitacao";      
	var tpsistema = "categoriaSistema";
	var aplicacao = "produtoAplicacao";
	var tpsolicitacao = 'processoTpSolicitacao';
    
	if(selectedItem.inputId == sistema){
		//window['categoriaSistema'].setValue(selectedItem["codSolicitacao"] + ' - ' + selectedItem["descSolicitacao"]);                                
		reloadZoomFilterValues(tpsistema, "codSolicitacao," + selectedItem["codSolicitacao"]);
		$("#codSolicitacao").val(selectedItem["codSolicitacao"]);                          
	}        
	else if(selectedItem.inputId == tpsistema){
		var codSolicitacao = $("#"+sistema).val();
		codSolicitacao = (codSolicitacao) ? codSolicitacao[0].split("-") : [codSolicitacao];
		reloadZoomFilterValues(aplicacao, "codSolicitacao," +codSolicitacao[0].trim()+','+"codSistemaCategoria," + selectedItem["codSistemaCategoria"]);	                
		$("#codSistemaCategoria").val(selectedItem["codSistemaCategoria"]);                          
	}
	else if(selectedItem.inputId == aplicacao){   
		
		var codSolicitacao = $("#"+sistema).val();
		codSolicitacao = (codSolicitacao) ? codSolicitacao[0].split("-") : [codSolicitacao];
		
		var codSistemaCategoria = $("#"+tpsistema).val();
		codSistemaCategoria = (codSistemaCategoria) ? codSistemaCategoria[0].split("-") : [codSistemaCategoria];
		
		reloadZoomFilterValues(tpsolicitacao, "codSolicitacao," +codSolicitacao[0].trim()+","+"codSistemaCategoria," + codSistemaCategoria[0].trim() +","+"codTipoAplicacao," + selectedItem["codTipoAplicacao"]);	                
		$("#codProdutoAplicacao").val(selectedItem["codTipoAplicacao"]);
	}
	else if(selectedItem.inputId == tpsolicitacao){   
		$("#codProcessoTpSolicitacao").val(selectedItem["codTipoSolicitacao"]);
	}
	else if(selectedItem.inputId == "chapaNome"){ 
		carregarDadosFuncionario(selectedItem["colleagueId"]);
		$('#usuarioEmail').val(carregaDadosUser(selectedItem["colleagueId"]).values[0].mail);
	}
}

function removedZoomItem(removedItem) {
	
	var sistema = "solicitacao";      
	var tpsistema = "categoriaSistema";
	var aplicacao = "produtoAplicacao";
	var tpsolicitacao = 'processoTpSolicitacao';
	
	if (removedItem.inputId == sistema) {
		
		var zoomField = document.getElementById(tpsistema);
		var length = zoomField.options.length;
		for (i = 0; i < length; i++) {
			zoomField.options[i].remove();
		}
		
		var zoomField = document.getElementById(aplicacao);
		var length = zoomField.options.length;
		for (i = 0; i < length; i++) {
			zoomField.options[i].remove();
		}
		
		var zoomField = document.getElementById(tpsolicitacao);
		var length = zoomField.options.length;
		for (i = 0; i < length; i++) {
			zoomField.options[i].remove();
		}
		
	}
	else if (removedItem.inputId == tpsistema) {		
		
		var codSolicitacao = $("#"+sistema).val();
		codSolicitacao = (codSolicitacao) ? codSolicitacao[0].split("-") : [codSolicitacao];
		
		reloadZoomFilterValues(tpsistema, "codSolicitacao," + codSolicitacao[0].trim());
		
		var zoomField = document.getElementById(aplicacao);
		var length = zoomField.options.length;
		for (i = 0; i < length; i++) {
			zoomField.options[i].remove();
		}
		
		var zoomField = document.getElementById(tpsolicitacao);
		var length = zoomField.options.length;
		for (i = 0; i < length; i++) {
			zoomField.options[i].remove();
		}
		
		
	}
	else if (removedItem.inputId == aplicacao) {		
		
		var codSolicitacao = $("#"+sistema).val();
		codSolicitacao = (codSolicitacao) ? codSolicitacao[0].split("-") : [codSolicitacao];
		
		var codSistemaCategoria = $("#"+tpsistema).val();
		codSistemaCategoria = (codSistemaCategoria) ? codSistemaCategoria[0].split("-") : [codSistemaCategoria];
		
		reloadZoomFilterValues(aplicacao, "codSolicitacao," +codSolicitacao[0].trim()+','+"codSistemaCategoria," + codSistemaCategoria[0].trim());
		
		var zoomField = document.getElementById(tpsolicitacao);
		var length = zoomField.options.length;
		for (i = 0; i < length; i++) {
			zoomField.options[i].remove();
		}
		
	}
	else if (removedItem.inputId == tpsolicitacao) {
		
		var codSolicitacao = $("#"+sistema).val();
		codSolicitacao = (codSolicitacao) ? codSolicitacao[0].split("-") : [codSolicitacao];
		
		var codSistemaCategoria = $("#"+tpsistema).val();
		codSistemaCategoria = (codSistemaCategoria) ? codSistemaCategoria[0].split("-") : [codSistemaCategoria];
		
		var codTipoAplicacao = $("#"+aplicacao).val();
		codTipoAplicacao = (codTipoAplicacao) ? codTipoAplicacao[0].split("-") : [codTipoAplicacao];
		
		reloadZoomFilterValues(tpsolicitacao, "codSolicitacao," +codSolicitacao[0].trim()+","+"codSistemaCategoria," + codSistemaCategoria[0].trim() +","+"codTipoAplicacao," + codTipoAplicacao[0].trim());
	}
}