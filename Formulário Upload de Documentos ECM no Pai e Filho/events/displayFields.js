function displayFields(form,customHTML){
	customHTML.append("\n<!-- Aqui começa o displayfields =) -->\n");	
	var nsolicitacao = getValue("WKNumProces");
	form.setValue("numSolicitacao", nsolicitacao);
	customHTML.append("<script>");
	//var contratoAnexado = form.getValue("hdnContratoAdd");

	var atividadeAnterior = form.getValue("idStatus"); 
	customHTML.append("\n$(\"form\").append(\"<input id='statusAnterior' name='statusAnterior' value='"+ atividadeAnterior +"' type='hidden' disabled='disabled'></input>\");");

	var atv = getValue("WKNumState");

	customHTML.append("var FORM_MODE = '" + form.getFormMode() + "';");
 
	customHTML.append("var template = $('#tmplStatus').html();");
	customHTML.append("var obj = statusAtv('"+atv+"');");
	customHTML.append("$('#status').append(Mustache.render(template, obj));");
	customHTML.append("\n\nvar atividadeDescHist = nomeDaAtividade("+ nsolicitacao +", "+ 0 +", "+ atv +");\n\n");
	// customHTML.append("\n\nalert(atividadeDescHist);\n\n");
	customHTML.append("$('#idStatus').val(obj.id);");
	customHTML.append("$('#descStatus').val(obj.descricao);");
	
	var areaConsulta = form.getValue('areaSol') == "" ? null : form.getValue('areaSol'); 
	var parteConsulta = form.getValue('areaSol') == "" ? null : form.getValue('areaSol'); 
	var moedaConsulta = form.getValue('areaSol') == "" ? null : form.getValue('moeda'); 
	var tipoDocConsulta = form.getValue('tipoDoc') == "" ? null : form.getValue('tipoDoc'); 

//	customHTML.append('\n	function carregaCampos (){\n');
	customHTML.append('\n	console.log("Busca tipos");');
	customHTML.append('\n	carregaCamposSelect("areaSol","codArea","from_areas_solicitantes","nomeArea","' + areaConsulta + '");');
	customHTML.append('\n	carregaCamposSelect("tbOutrasPartes select","codParte","form_partes_determinacao","descricaoParte","' + parteConsulta + '");');
	customHTML.append('\n	carregaCamposSelect("moedaValorMes","idMoeda","form_moeda","descricaoMoeda","' + moedaConsulta + '");');
	customHTML.append('\n	carregaCamposSelect("tipoDoc","codDoc","dsTipoDocContratos","tipoDoc","' + tipoDocConsulta + '");');
//	customHTML.append('\n	}\n');
	

	//customHTML.append("$('#nomeContratoAdd').text('Nome do arquivo: "+contratoAnexado+"');");
	
	/*var idContrato = form.getValue("idContrato");
	if (idContrato.trim() != "") {
		customHTML.append("$('#downloadContrato').show();");
		customHTML.append("$('.btnDownload').attr('href',gerarLinkArquivo("+idContrato+"));");
	}*/	
	
	var usuario = getValue("WKUser");
	customHTML.append("var userAtual = nomeUsrCompleto('"+usuario+"');");

	customHTML.append("$('#ultimoUsuario').val(nomeUsrCompleto('"+usuario+"'));");

	customHTML.append("$('#divConsolidacao').hide();");
	customHTML.append("$('#divAprovOutrasPartes').hide();");
	//bloqueio do formulário preenchido inicialmente

//	customHTML.append("selectTipoDoc();");

	// Se o contrato for um aditivo de outra solicitação, exibe solicitação de origem
	var solPrincipalAditivo = form.getValue('SolPrincipalAditivo');

	if (solPrincipalAditivo != "") {
		customHTML.append("\nvar solicitacaoDeOrigem = " + solPrincipalAditivo + ";\n");

		var link = "/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=" + solPrincipalAditivo;
		var	codigoAditivo = "<div id='divSolPrincipalAditivo' class='row'>";
			codigoAditivo += "<div class='col-md-12 form-group alert alert-success' style='text-align: center;'>";
			codigoAditivo += "<p>Esta solicitação é um aditivo do contrato número <b><a target='_blank' href='"+ link +"'>"+ solPrincipalAditivo +"</a></b></p>";
			codigoAditivo += "</div>"; 
			codigoAditivo += "</div>"; 
			customHTML.append("\n$('#formContrato').append(\"" + codigoAditivo + "\");\n");
		customHTML.append('\n$("#divSolPrincipalAditivo").insertBefore("#formContrato");\n');
	}
	
	if (atv >= 5) {
		customHTML.append("alterarPastaECM();");
	}
	
	if (atv == 4 || atv == 0) {
		customHTML.append("$('#nomeSolicitante').val(nomeUsrCompleto('"+usuario+"'));");
		customHTML.append("$(document).ready(function(){FLUIGC.calendar('.date');});");
		customHTML.append("$('#usrSolicitante').val('"+usuario+"');");
		customHTML.append("$('#dataSolicitacao').val(dataAtualFormatada());");
		customHTML.append("$('#explicativoPartes').html('Clique no botão \"Adicionar partes\" para inserir as partes participantes do contrato');");
		
		
		/*var contratoAnexado = form.getValue("hdnContratoAdd");
		if (contratoAnexado == ""){
			customHTML.append("$('#divAddContrato').show();");
			customHTML.append("$('#divRmvContrato').hide();");
		} else {
			customHTML.append("$('#divAddContrato').hide();");
			customHTML.append("$('#divRmvContrato').show();");
		}*/

		
		
	}
	
	if (atv > 4) {
		
		customHTML.append("$('.btnAddAnexo').closest('a').hide();");
		customHTML.append("$('.btnRmvAnexo').closest('a').hide();");
		customHTML.append("$('.btnAddContrato').closest('a').hide();");
		customHTML.append("$('.btnRmvContrato').closest('a').hide();");

		customHTML.append("$('#nomeDoAprovador').val(nomeUsrCompleto(verificaAprovador('"+usuario+"')));");



		customHTML.append("setDivReadOnly(Array('formContrato'));");
		customHTML.append("montaDocumentosAnx();");
		
		customHTML.append("$('#btnAddPapel').hide();");
		customHTML.append("$('#btnRmvParte').hide();");

		//customHTML.append("$('#divAnaliseSuperior').show();");
	}


	//exibição das divs de aprovação de acordo com a atividade
	var aprovSuperior = (atv > 4) ? ".show();" : ".hide();";   
	var analiseSol = (atv == 96) ? ".show();" : ".hide();";
	var analiseCS = (atv == 13 || atv == 48 || atv == 146) ? ".show();" : ".hide();";
	var analiseLog = (atv == 15 || atv == 51 || atv == 143) ? ".show();" : ".hide();";
	var analiseFin = (atv == 11 || atv == 56 || atv == 151) ? ".show();" : ".hide();";
	var analiseFiscal = (atv == 149 || atv == 150 || atv == 160) ? ".show();" : ".hide();";
	var analiseECommerce = (atv == 184 || atv == 187 || atv == 188) ? ".show();" : ".hide();";
	var analiseCon = (atv == 5) ? ".show();" : ".hide();";
	var coletaAssina = (atv == 34) ? ".show();" : ".hide();"; 
	var coletaAssSolicita = (atv == 32) ? ".show();" : ".hide();";
	var contratoVigente = (atv == 106) ? ".show();" : ".hide();";
	var contratoExpirado = (atv == 108) ? ".show();" : ".hide();";
	var revisaoCS = (atv == 48 || atv == 146) ? ".show();" : ".hide();";
	var revisaoLog = (atv == 51 || atv == 143) ? ".show();" : ".hide();";
	var revisaoFin = (atv == 56 || atv == 151) ? ".show();" : ".hide();";
	var revisaoFiscal = (atv == 150 || atv == 160) ? ".show();" : ".hide();";
	var revisaoECommerce = (atv == 187 || atv == 188) ? ".show();" : ".hide();";

	var comentview = (atv == 5 || atv == 44 || atv == 48 || atv == 51 || atv == 56 || atv == 30 || atv == 32 || atv == 34 || atv == 38 || atv == 106 || atv == 146 || atv == 149 || atv == 150 || atv == 160 || atv == 204) ? ".show();" : ".hide();";

	customHTML.append("$('#envioAreas')" + analiseCon);
	customHTML.append("$('#divComentario').hide();");

	customHTML.append("$('#divAnaliseSuperior')" + aprovSuperior);
	customHTML.append("$('#divAnaliseSol')" + analiseSol);
	customHTML.append("$('#divAnaliseCS')" + analiseCS);
	customHTML.append("$('#divAnaliseLog')" + analiseLog);
	customHTML.append("$('#divAnaliseFin')" + analiseFin);
	customHTML.append("$('#divAnaliseFiscal')" + analiseFiscal);
	customHTML.append("$('#divAnaliseECommerce')" + analiseECommerce);
	customHTML.append("$('#divColetaAssJuridico')" + coletaAssina);
	customHTML.append("$('#divColetaAssSolicitante')" + coletaAssSolicita);
	customHTML.append("$('#divContratoVigente')" + contratoVigente);
	customHTML.append("$('#divContratoExpirado')" + contratoExpirado);
	customHTML.append("$('#divRevisaoCS')" + revisaoCS);
	customHTML.append("$('#divRevisaoLog')" + revisaoLog);
	customHTML.append("$('#divRevisaoFin')" + revisaoFin);
	customHTML.append("$('#divRevisaoFiscal')" + revisaoFiscal);
	customHTML.append("$('#divRevisaoECommerce')" + revisaoECommerce);

	customHTML.append("$('#divContraConsolidado').hide();");
	customHTML.append("$('#divAnxConsolidado').hide();");

	// Mover análise e histórico para o final do formulário 
	customHTML.append("$('#divRevisaoCS').remove().insertBefore($('#divDocEncerrado'));");
	customHTML.append("$('#divAnaliseCS').remove().insertBefore($('#divDocEncerrado')); $('#divAnaliseCS legend').css('padding-top','20px');");
	customHTML.append("$('#divRevisaoLog').remove().insertBefore($('#divDocEncerrado'));");
	customHTML.append("$('#divAnaliseLog').remove().insertBefore($('#divDocEncerrado')); $('#divAnaliseLog legend').css('padding-top','20px');");
	customHTML.append("$('#divRevisaoFiscal').remove().insertBefore($('#divDocEncerrado'));");
	customHTML.append("$('#divAnaliseFiscal').remove().insertBefore($('#divDocEncerrado')); $('#divAnaliseFiscal legend').css('padding-top','20px');");
	customHTML.append("$('#divRevisaoFin').remove().insertBefore($('#divDocEncerrado'));");
	customHTML.append("$('#divAnaliseFin').remove().insertBefore($('#divDocEncerrado')); $('#divAnaliseFin legend').css('padding-top','20px');");
	customHTML.append("$('#divRevisaoSol').remove().insertBefore($('#divDocEncerrado'));");
	customHTML.append("$('#divAnaliseSol').remove().insertBefore($('#divDocEncerrado')); $('#divAnaliseSol legend').css('padding-top','20px');");
//	customHTML.append("$('#divRevisaoSuperior').remove().insertBefore($('#divDocEncerrado'));");
//	customHTML.append("$('#divAnaliseSuperior').remove().insertBefore($('#divDocEncerrado')); $('#divAnaliseSuperior legend').css('padding-top','20px');");


//	if (atv != 4 || atv != 5 || atv != 61 || atv != 30 ||atv != 32 || atv != 34 || atv != 106) {
//		customHTML.append("$('#divAnaliseSuperior').hide();");
//	}
	
	if (atv != 61 && atv != 204) {
		customHTML.append("setDivReadOnly(Array('divAnaliseSuperior'));");
		customHTML.append("$('#divAnaliseSuperior').hide();");		
	}

	//bloqueio da edição das aprovações
	else  {
		customHTML.append("alterarPastaECM();");
		customHTML.append("$('#downloadContrato').show();");
		customHTML.append("$('.btnAddRevisaoContr').closest('a').hide();");
		customHTML.append("$('.btnAddRevisaoAnexo').closest('a').hide();");

	}

	if (atv != 11) {
		customHTML.append("$('#divHistAprovFin1').hide();");
		customHTML.append("$('#divHistAprovFin2').hide();");
	}
	
	if (atv != 13) {
		customHTML.append("$('#divHistAprovCS1').hide();");
		customHTML.append("$('#divHistAprovCS2').hide();");
	}

	if (atv != 15) {
		customHTML.append("$('#divHistAprovLog1').css('display', 'none');");
		customHTML.append("$('#divHistAprovLog2').css('display', 'none');");
	}

	if (atv != 149) {
		customHTML.append("$('#divHistAprovFiscal1').css('display', 'none');");
		customHTML.append("$('#divHistAprovFiscal2').css('display', 'none');");
	}
	
	if(atv == 5){
		customHTML.append("$('#explicativoPartes').html('Clique no botão \"Adicionar partes\" para inserir as partes participantes do contrato');");

		customHTML.append("alterarPastaECM()");
		customHTML.append("\nmontaHistCompleto();\n");
		customHTML.append("\n$(\"#divAnaliseFin\").show();\n");
		customHTML.append("\n$(\"#divAnaliseFin legend\").html(\"Histórico de Revisão\");\n");

		customHTML.append("\n$(\"#divAnaliseSuperior\").hide();\n");

		customHTML.append("$('#aprovJuridico>option:first').attr('selected','selected').attr('disabled','true');");
		customHTML.append("setDivEnabled(Array('partes'));");

		customHTML.append('if($("#tbTrContrato>tbody").children("tr").length > 1){$(".btnAddContrato").closest("a").hide();}');
		customHTML.append(" else {$('.btnAddContrato').closest('a').show();}");

		customHTML.append('if($("#tbTrAnexos>tbody").children("tr").length > 1){$(".btnAddAnexo").closest("a").hide();}');
		customHTML.append(" else {$('.btnAddAnexo').closest('a').show();}");

		customHTML.append("$('#btnAddPapel').show();");
		customHTML.append("$('#btnRmvParte').show();");

		customHTML.append("$('#divObsJuridico label').html('Comentários');");
	}

	if (atv == 61 || atv == 204) {
		customHTML.append("\n$(\"#aprovSuperiorObs\").val(\"\");\n");
		customHTML.append("$('#divAnaliseSuperior').show();");
		customHTML.append("$('#nomeDoAprovador').val(nomeUsrCompleto('"+usuario+"'));");
		
		if (atv == 204) {
			customHTML.append("$('#divAnaliseSuperior legend').html('Aprovação Presidência');");
			customHTML.append("montaHistCompleto();");		
			customHTML.append("\n$(\"#divAnaliseFin\").show();\n");
			customHTML.append("\n$(\"#divAnaliseFin legend\").html(\"Histórico de Revisão\");\n");
		}
	}

	// Validar aprovação presidência
	if (atv != 61 || atv != 204 || atv != 34 ) {
		customHTML.append("\n$(\"#aprovSuperior\").val(\"\");\n");
	}

	if (atv == 11){
		customHTML.append("$('#aprovFinObs').val('');");
		customHTML.append("$('select#aprovFin').val('--- Selecione um item ---');");
		customHTML.append("montaHistCompleto();");
		// customHTML.append("if($('#observRevisaoFin').val()){");
		// customHTML.append("$('#divRevisaoFin').hide();");
		// customHTML.append("montaHistAreas('Fin');");
		// customHTML.append("setDivReadOnly(Array('divRevisaoFin'));");
		// customHTML.append("}");
		customHTML.append("$('.btnRemoveRevisao').hide();");
		customHTML.append('if($("#tbTrContrato>tbody").children("tr").length <= 1){$("#tbTrContrato>tbody").append("<tr><td><p>Não foram anexados documentos</p></td></tr>");}');
		customHTML.append('if($("#tbTrAnexos>tbody").children("tr").length <= 1){$("#tbTrAnexos>tbody").append("<tr><td><p>Não foram anexados documentos</p></td></tr>");}');
	}

	if (atv == 149){
		customHTML.append("$('#aprovFiscalObs').val('');");
		customHTML.append("$('select#aprovFiscal').val('--- Selecione um item ---');");
		customHTML.append("montaHistCompleto();");
		// customHTML.append("if($('#observRevisaoFiscal').val()){");
		// customHTML.append("$('#divRevisaoFiscal').hide();");
		// customHTML.append("montaHistAreas('Fiscal');");
		// customHTML.append("setDivReadOnly(Array('divRevisaoFiscal'));");
		// customHTML.append("}");
		customHTML.append("$('.btnRemoveRevisao').hide();");
		customHTML.append('if($("#tbTrContrato>tbody").children("tr").length <= 1){$("#tbTrContrato>tbody").append("<tr><td><p>Não foram anexados documentos</p></td></tr>");}');
		customHTML.append('if($("#tbTrAnexos>tbody").children("tr").length <= 1){$("#tbTrAnexos>tbody").append("<tr><td><p>Não foram anexados documentos</p></td></tr>");}');
	}

	if (atv == 184){
		customHTML.append("$('#aprovECommerceObs').val('');");
		customHTML.append("$('select#aprovECommerce').val('--- Selecione um item ---');");
		customHTML.append("montaHistCompleto();");
		// customHTML.append("if($('#observRevisaoECommerce').val()){");
		// customHTML.append("$('#divRevisaoECommerce').hide();");
		// customHTML.append("montaHistAreas('ECommerce');");
		// customHTML.append("setDivReadOnly(Array('divRevisaoECommerce'));");
		// customHTML.append("}");
		customHTML.append("$('.btnRemoveRevisao').hide();");
		customHTML.append('if($("#tbTrContrato>tbody").children("tr").length <= 1){$("#tbTrContrato>tbody").append("<tr><td><p>Não foram anexados documentos</p></td></tr>");}');
		customHTML.append('if($("#tbTrAnexos>tbody").children("tr").length <= 1){$("#tbTrAnexos>tbody").append("<tr><td><p>Não foram anexados documentos</p></td></tr>");}');
	}

	if (atv == 13){
		customHTML.append("$('#aprovCSObs').val('');");
		customHTML.append("$('select#aprovCS').val('--- Selecione um item ---');");
		customHTML.append("montaHistCompleto();");
		// customHTML.append("if($('#observRevisaoCS').val()){");
		// customHTML.append("$('#divRevisaoCS').hide();");
		// customHTML.append("montaHistAreas('CS');");
		// customHTML.append("setDivReadOnly(Array('divRevisaoCS'));");
		// customHTML.append("}");
		customHTML.append("$('.btnRemoveRevisao').show();");
		customHTML.append('if($("#tbTrContrato>tbody").children("tr").length <= 1){$("#tbTrContrato>tbody").append("<tr><td><p>Não foram anexados documentos</p></td></tr>");}');
		customHTML.append('if($("#tbTrAnexos>tbody").children("tr").length <= 1){$("#tbTrAnexos>tbody").append("<tr><td><p>Não foram anexados documentos</p></td></tr>");}');
	} 

	if (atv == 15){
		customHTML.append("$('#aprovLogObs').val('');");
		customHTML.append("$('select#aprovLog').val('--- Selecione um item ---');");
		customHTML.append("montaHistCompleto();");
		// customHTML.append("if($('#observRevisaoLog').val()){");
		// customHTML.append("$('#divRevisaoLog').hide();");
		// customHTML.append("montaHistAreas('Log');");
		// customHTML.append("setDivReadOnly(Array('divRevisaoLog'));");
		// customHTML.append("}");
		customHTML.append("$('.btnRemoveRevisao').hide();");
		customHTML.append('if($("#tbTrContrato>tbody").children("tr").length <= 1){$("#tbTrContrato>tbody").append("<tr><td><p>Não foram anexados documentos</p></td></tr>");}');
		customHTML.append('if($("#tbTrAnexos>tbody").children("tr").length <= 1){$("#tbTrAnexos>tbody").append("<tr><td><p>Não foram anexados documentos</p></td></tr>");}');
	}
	
	if(atv == 34){
		customHTML.append("$('#divContrato').show();");
		customHTML.append("$('#divTrackingContrato').show();");
		customHTML.append("$('.btnRemoveRevisao').show();");
		customHTML.append("$('.btnRemoveRevisao').show();");

		customHTML.append("$('#divColetaAssJuridico').show();");
		idContrato = form.getValue("btnAddContratoAssSol");
		customHTML.append("$('.btnDownloadAssjur').attr('href',gerarLinkArquivo("+idContrato+"));");
		
		customHTML.append("$(\"#envioAreas\").show();");
		customHTML.append("\n$('#divAnaliseFin').show();\n");
		customHTML.append("\nmontaHistCompleto();\n");
		customHTML.append("\n$(\"#divAnaliseFin legend\").html(\"Histórico de Revisão\");\n");


	}

	if(atv == 32){
		//customHTML.append("$('#divContrato').hide();");
		customHTML.append("montaContratoConsol();");
		customHTML.append("$('#divContraConsolidado').show();");
		customHTML.append("$('#divAnxConsolidado').show();");
		customHTML.append("$('#divContrato').hide();");
		customHTML.append("$('.btnAddRevisaoContr').closest('a').hide();");
		customHTML.append("$('.btnAddRevisaoAnexo').closest('a').hide();");
		customHTML.append("$('#divTrackingContrato').hide();");

		customHTML.append("$('#divColetaAssSolicitante').show();");
	}

	if(atv == 87){
		customHTML.append("$('#divAprovOutrasPartes').show();");
		customHTML.append("$('#divContrato').hide();");
	}
	if (atv == 96){
		customHTML.append("montaContratoConsol();");
		customHTML.append("$('#divContraConsolidado').show();");
		customHTML.append("$('#divAnxConsolidado').show();");

		customHTML.append("$('#divContrato').hide();");
		customHTML.append("$('#divTrackingContrato').hide();");

		customHTML.append("$('.btnRemoveRevisao').hide();");
		
	}

	// Cosolidar contrato
	if(atv == 30){
		customHTML.append("$('#divConsolidacao').show();");
		customHTML.append("$('#downloadContrato').show();");
		customHTML.append("$('.btnRemoveRevisao').show();");

		customHTML.append("\n$('#divAnaliseFin').show();\n");
		customHTML.append("\nmontaHistCompleto();\n");
		customHTML.append("\n$(\"#divAnaliseFin legend\").html(\"Histórico de Revisão\");\n");


		customHTML.append("setDivReadOnly(Array('divAnaliseFin'));");
		customHTML.append("setDivReadOnly(Array('divAnaliseFiscal'));");
		customHTML.append("setDivReadOnly(Array('divAnaliseLog'));");
		customHTML.append("setDivReadOnly(Array('divAnaliseCS'));");

		customHTML.append('if($("#tbTrContrato>tbody").children("tr").length > 1){$(".btnAddContrato").closest("a").hide();}');
		customHTML.append(" else {$('.btnAddContrato').closest('a').show();}");

		customHTML.append('if($("#tbTrAnexos>tbody").children("tr").length > 1){$(".btnAddAnexo").closest("a").hide();}');
		customHTML.append(" else {$('.btnAddAnexo').closest('a').show();}");
	}


	if (atv == 44) {
		customHTML.append("setDivReadOnly(Array('divAnaliseSol'));");
		customHTML.append("$('#btnAddAnexo').closest('a').show();");
	}



	if (atv == 48 || atv == 146) {
		customHTML.append("$('#observRevisaoCS').val('');");
		customHTML.append("setDivReadOnly(Array('divAnaliseCS'));");
		customHTML.append("\nmontaHistCompleto();\n");
		customHTML.append("\n$(\"#divAnaliseFin legend\").html(\"Histórico de Revisão\");\n");
		//customHTML.append("montaHistAreas('CS');");
		customHTML.append("$('#divAnaliseCS').show();");
		customHTML.append("$('#divRevisaoCS').show();");
		customHTML.append("$('.btnRemoveRevisao').hide();");

		if (atv != 48 && atv == 146) {
			customHTML.append("$('#divRevisaoCS legend').html('Revisão Jurídico - Customer Service');");
		}
	}
	


	if (atv == 51 || atv == 143) {
		customHTML.append("$('#observRevisaoLog').val('');");
		customHTML.append("setDivReadOnly(Array('divAnaliseLog'));");
		customHTML.append("\nmontaHistCompleto();\n");
		customHTML.append("\n$(\"#divAnaliseFin legend\").html(\"Histórico de Revisão\");\n");
		//customHTML.append("montaHistAreas('Log');");
		customHTML.append("$('#divAnaliseLog').show();");
		customHTML.append("$('#divRevisaoLog').show();");
		customHTML.append("$('.btnRemoveRevisao').hide();");	
		
		if (atv != 51 && atv == 143) {
			customHTML.append("$('#divRevisaoLog legend').html('Revisão Jurídico - Logística');");
		}
	}

	if (atv == 56 || atv == 151) {
		customHTML.append("$('#observRevisaoFin').val('');");
		customHTML.append("setDivReadOnly(Array('divAnaliseFin'));");
		customHTML.append("\nmontaHistCompleto();");
		customHTML.append("\n$(\"#divAnaliseFin legend\").html(\"Histórico de Revisão\");\n");
		//		customHTML.append("montaHistAreas('Fin');");
		customHTML.append("$('#divAnaliseFin').show();");
		customHTML.append("$('#divRevisaoFin').show();");
		customHTML.append("$('.btnRemoveRevisao').hide();");
		
		if (atv != 56 && atv == 151) {
			customHTML.append("$('#divRevisaoFin legend').html('Revisão Jurídico - Financeiro');");
		}
	
	}

	
	if (atv == 150 || atv == 160) { 
		customHTML.append("\n$('#observRevisaoFiscal').val('');");
		customHTML.append("\nsetDivReadOnly(Array('divAnaliseFiscal'));");
		customHTML.append("\nmontaHistCompleto();");
		customHTML.append("\n$(\"#divAnaliseFin legend\").html(\"Histórico de Revisão\");\n");
		//customHTML.append("\nmontaHistAreas('Fiscal');");
		customHTML.append("\n$('#divAnaliseFiscal').show();");
		customHTML.append("\n$('#divRevisaoFiscal').show();");
		customHTML.append("\n$('.btnRemoveRevisao').hide();");
		
		if (atv != 150 && atv == 160) {
			customHTML.append("\n$('#divRevisaoFiscal legend').html('Revisão Jurídico - Fiscal');");
		}
	}
	
	if (atv == 187 || atv == 188) { 
		customHTML.append("\n$('#observRevisaoECommerce').val('');");
		customHTML.append("\nsetDivReadOnly(Array('divAnaliseECommerce'));");
		customHTML.append("\nmontaHistCompleto();");
		customHTML.append("\n$(\"#divAnaliseFin legend\").html(\"Histórico de Revisão\");\n");
		//customHTML.append("\nmontaHistAreas('Fiscal');");
		customHTML.append("\n$('#divAnaliseECommerce').show();");
		customHTML.append("\n$('#divRevisaoECommerce').show();");
		customHTML.append("\n$('.btnRemoveRevisao').hide();");
		
		if (atv != 187 && atv == 188) {
			customHTML.append("\n$('#divRevisaoECommerce legend').html('Revisão Jurídico - Atendimento E-Commerce');");
		}
	}

	if (atv == 106 || atv == 72) {
		//customHTML.append("setDivReadOnly(Array('formContrato'));");
		customHTML.append("$('#divContrato').hide();");
		customHTML.append("$('#divTrackingContrato').hide();");
		customHTML.append("$('#divAnxConsolidado').show();");
		customHTML.append("$('#divContraConsolidado').show();");
		customHTML.append("montaContratoVigente();");
		// Alterações solicitadas na reunião do dia 14/03

		customHTML.append("\n$('.btnRemoveRevisao').hide();");
		customHTML.append("\n$('.btnAddRevisaoContr').closest('a').hide();");
		customHTML.append("\n$('.btnAddRevisaoAnexo').closest('a').hide();");
		customHTML.append("\n$('#divTrackingContrato').show();");
		customHTML.append("\n$('#divContrato').show();");

		customHTML.append("\n$('#divContrato legend').html('Revisões de contrato realizadas durante o processo');");
		customHTML.append("\n$('#divContrato p').html('');");
		customHTML.append("\n$('#divTrackingContrato legend').html('Revisões de anexos realizadas durante o processo');");
		customHTML.append("\n$('#divTrackingContrato p').html('');");


		customHTML.append("\n$('#divAnaliseFin').show();\n");
		customHTML.append("\nmontaHistCompleto();\n");
		customHTML.append("\n$(\"#divAnaliseFin legend\").html(\"Histórico de Revisão\");\n");

		// var histFiscal = form.getValue('hdnJsonHistFiscal');
		// var histLog = form.getValue('hdnJsonHistLog');
		// var histFin = form.getValue('hdnJsonHistFin');
		// var histCS = form.getValue('hdnJsonHistCS');

		// if (histFiscal != '') {
			// customHTML.append("\n$('#divAnaliseFiscal').show();\nmontaHistAreas('Fiscal');\n");
		// }
		
		// if (histFin != '') {
			// customHTML.append("\n$('#divAnaliseFin').show();\nmontaHistAreas('Fin');\n");
		// }

		// if (histCS != '') {
			// customHTML.append("\n$('#divAnaliseCS').show();\nmontaHistAreas('CS');\n");
		// }

		// if (histLog != '') {
			// customHTML.append("\n$('#divAnaliseLog').show();\nmontaHistAreas('Log');\n");
		// }
		
		// Fim alterações solicitadas na reunião do dia 14/03             'undefined'
		
		//customHTML.append("$('#btnAddAnexo').closest('a').hide();");
		//customHTML.append("$('#divContratoVigente').show();");
	}

	if (atv == 108) {
		//customHTML.append("setDivReadOnly(Array('formContrato'));");
		customHTML.append("$('#divContrato').hide();");
		customHTML.append("$('#divTrackingContrato').hide();");
		customHTML.append("$('#divAnxConsolidado').show();");
		customHTML.append("$('#divContraConsolidado').show();");
		customHTML.append("montaContratoVigente();");
		
		customHTML.append("$('#usuarioExpira').val(nomeUsrCompleto('"+usuario+"'));");
		customHTML.append("$('#idUsuarioExpira').val('"+usuario+"');");
		customHTML.append("$('#dataExpirado').val(dataAtualFormatada());");
		//customHTML.append("$('#btnAddAnexo').closest('a').hide();");
		//customHTML.append("$('#divContratoVigente').show();");
	}
	

	if(atv == 68){
		customHTML.append("$('#explicativoPartes').html('Clique no botão \"Adicionar partes\" para inserir as partes participantes do contrato');");

		customHTML.append("setDivEnabled(Array('formContrato'));");
		customHTML.append("$(document).ready(function(){FLUIGC.calendar('.date');});");

		var teste = form.getValue("aprovSuperior");
		customHTML.append("console.log('"+teste+"');");

		if(teste == "corrigir"){
			//customHTML.append("setDivReadOnly(Array('divAnaliseSuperior'));");
			customHTML.append("$('#divAnaliseSuperior').show();");
			
		}
		if(form.getValue("aprovJuridico") == 'nao'){
			customHTML.append("$('#envioAreas').show();");
			customHTML.append("$('#divAreasAnalise').hide();");
			customHTML.append("$('#divObsJuridico').show();");
			customHTML.append("setDivReadOnly(Array('envioAreas'));");
		}

		if(form.getValue("dataTermino") == null || form.getValue("dataTermino") == ""){
			
			customHTML.append("$('#indeterminado').prop('checked', true);");
			customHTML.append("$('#dataTermino').attr('disabled',true);");

		}
		if(form.getValue("idContrato")){	
			//customHTML.append("$('#divAddContrato').hide();");
          	customHTML.append("$('#divRmvContrato').show();");

		} else {
			//customHTML.append("$('#divAddContrato').show();");
          	customHTML.append("$('#divRmvContrato').hide();");
		}
		customHTML.append("$('#btnAddAnexo').closest('a').show();");
		customHTML.append("$('.btnAddRevisaoAnexo').closest('a').hide();");
		customHTML.append("$('.btnAddRevisaoContr').closest('a').hide();");
		customHTML.append("$('.btnAddContrato').closest('a').show();");
		customHTML.append("$('.btnRmvContrato').closest('a').show();");
		customHTML.append("$('.btnRmvAnexo').closest('a').show();");

		customHTML.append("$('#btnAddPapel').show();");
		customHTML.append("$('#btnRmvParte').show();");

		
	}

	//atividades que possuem aprovação do juridico
	if (atv == 5 || atv == 143 || atv == 146 || atv == 151 || atv == 160 || atv == 188) {		
		customHTML.append("$('#aprovJudiciario').val(nomeUsrCompleto('"+usuario+"'));");
	}
	customHTML.append('\n$("span option").hide();\n');
	customHTML.append('\n</script>\n');
}