function enableFields(form){
	var atv = getValue("WKNumState");
	if (atv == 0 || atv == 4 || atv == 68){
		form.setEnabled("tipoDocumento",true);
	}else{
		form.setEnabled("tipoDocumento",false);
	}

	//atividades que desabilitam tipo de custo
	if(atv == 4 || atv == 0 || atv == 61 || atv == 68){
		form.setEnabled("tipoCusto",true);		
	}
	else{
		form.setEnabled("tipoCusto",false);
		// customHTML.append("$('#divtipoCusto').hide();");
	}


}