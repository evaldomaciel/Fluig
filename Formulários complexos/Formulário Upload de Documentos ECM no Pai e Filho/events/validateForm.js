function validateForm(form){
	var atv = getValue("WKNumState");
	
	if (atv == 5){
		
		if(form.getValue("aprovJuridico") == 'sim'){
			var validado = false;
			
			validado = form.getValue("areaFinancas") == "on" ? true : validado;
			validado = form.getValue("areaFiscal") == "on" ? true : validado;
			validado = form.getValue("areaCustomer") == "on" ? true : validado;
			validado = form.getValue("areaLogistica") == "on" ? true : validado;
			validado = form.getValue("areaECommerce") == "on" ? true : validado;
			validado = form.getValue("semAnalise") == "on" ? true : validado;
			
			if (!validado){
				throw "É necessário selecionar uma área para poder enviar a solicitação, por favor revise os campos!";
			}
		}
	}

	if (atv == 30){
		var validado = false;
		
		validado = form.getValue("analiseParte") == "sim" ? true : validado;
		validado = form.getValue("analiseParte") == "nao" ? true : validado;
		
		if (!validado){
			throw "É necessário informar se terá aprovação das partes pertencentes ao contrato!";
		}
	}
	if(atv == 108){
		if(form.getValue("motivoExpirado") == null || form.getValue("motivoExpirado") == "" || form.getValue("motivoExpirado") == undefined){
			throw "Por favor, informe o motivo do encerramento do contrato";
		}
	}
}