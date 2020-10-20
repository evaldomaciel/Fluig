console.clear();

//var codPastaContrato = "847"; // Homologação //CÓDIGO DA PASTA EM QUE SERÃO INSERIDAS AS PASTAS DAS SOLICITAÇÕS (PASTA PAI)
var codPastaContrato = "7972"; // Produção //CÓDIGO DA PASTA EM QUE SERÃO INSERIDAS AS PASTAS DAS SOLICITAÇÕS (PASTA PAI)

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
	sURLVariables = sPageURL.split('&'),
	sParameterName,
	i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
		
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
		}
	}
};

var WKNumState = getUrlParameter('WKNumState');

function nomeDaAtividade(atividade, indice, WKNumState) {
	var teste = []; 
	$.ajax({
		type: 'GET',
		async : false,
		contentType: "application/json",
		url: '/process-management/api/v2/activities?processInstanceId=' + atividade,
		success: function(data) {
			var i = 0;
			var contador = Object.keys(data['items']).length;
			var objeto = (data['items']);
			while (i < contador) {
				var atividade = objeto[i]['state']['sequence'];
				var ativo = objeto[i]['active'];
				//console.log(atividade + "\t - "  + ativo);
				if (atividade == WKNumState && ativo == true) {
					item = objeto[i]['state']['stateName'];
					sequencia = objeto[i]['movementSequence'];
					teste.push(item); 
					teste.push(sequencia); 
				} 
				i++;
			}
		}, 
        error: function() {
			teste.push(["Alerta: Novo contrato"]);
		}
	}); //.responseText
	console.log(teste);
	return teste;
}
// var item = nomeDaAtividade(1626, 0, 34); 
// alert(item[0]);
// alert(item[1]);

$(document).ready(function() {

	// Função para prucarar aditivo 
	function procuraAditivo() {
		// Funções para buscar a solicitação que o aditivo do contrato
		var objetoRetorno = [];
		function buscaViaAPI( url, data, callback, detail ) { 
			try { 	
				$.ajax( { 
				//parent.WCMAPI.Read( { 
					type: 'POST', 
					url: url, 
					async: false, 
					data: data, 
					success: function(oDataRet) { 					
						objetoRetorno.push(oDataRet); // adicionas os itens ao objeto fora da função
					}, 
					error: function (oError) { 
						console.log(oError);
						callback(null, oError, detail);
					} 
				});
			} 
			catch (e) { 
				console.log(e);
				callback(null, e);
			}
		} 
	
		// Define os parâmetros para buscar no dataset
		oC1 = [];
		oC1.push({ 
				'_field':'sourceProcess', 
				'_initialValue': 1, 
				'_finalValue': 100000000, 
				'_type':0, 
				'_likeSearch':false
			});
	
		var data2 = { 
			name: 'workflowProcess', 
			fields: null, 
			constraints: oC1, 
			order: null
		};
	
		var url = '/api/public/ecm/dataset/datasets/';
	
		// Chama a função para sincronizar o dataset
		if ($("#numSolicitacao").val() != 0) {
		buscaViaAPI(url, data2, function(params){ return params;});
		}
		var esperado = objetoRetorno[0]['content']['values']; 

		if(FORM_MODE == "VIEW") {
			var numSolicitacaoPK = $("#numSolicitacao").text();
		} 

		if(FORM_MODE == "MOD") {
			var numSolicitacaoPK = $("#numSolicitacao").val();
		}

		for(i = 0; i < esperado.length; i++){
			console.log(esperado[i]['sourceProcess']);
			if(esperado[i]['sourceProcess'] == numSolicitacaoPK && numSolicitacaoPK != 0 && numSolicitacaoPK != null){
				console.log("Dia de tomar mé");
				var saida = esperado[i]['workflowProcessPK.processInstanceId'];
				var link = "/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=" + saida;
				var	codigoAditivo = "<div id='divSolPrincipalAditivo' class='row'>";
					codigoAditivo += "<div class='col-md-12 form-group alert alert-success' style='text-align: center;'>";
					codigoAditivo += "<p>Esta solicitação possuí um aditivo.<br/>Contrato número <b><a target='_blank' href='"+ link +"'>"+ saida +"</a></b></p>";
					codigoAditivo += "</div>"; 
					codigoAditivo += "</div>"; 
				$('#formContrato').append(codigoAditivo);
				$("#divSolPrincipalAditivo").insertBefore("#formContrato");
			}
		}	
	}

	//procuraAditivo();

	$('.cnpj').mask('00.000.000/0000-00');//atribui mascara de cnpj no campo de cnpj das partes
	
	//FUNÇÃO PARA CONTROLE DASELEÇÃO DE DATA IDENTERMINADA
    //CASO SELECIONADO DESABILITA O CAMPO dataTermino
	$("#indeterminado").on('click',function(){
		if($("#indeterminado").is(":checked")){
			$("#dataTermino").attr("disabled",true);
			$("#dataTermino").val("");
			} else {
			$("#dataTermino").attr("disabled",false);
		}
	});

	// Incrementa a reação de partes
	$("form").on("change", function() {
		saida = [];
		var razao = $("[id^='razaoSocial']"); 
		var cnpj = $("[id^='cnpjPapel']"); 
		var parte = $("[id^='tipoParte']"); 
		$.each([razao, cnpj, parte], function( key, value ) {
			var razaoSocial = $(razao);
			var cnpjSai = $(cnpj);
			var tipoParte = $(parte);
			var saida = [];  
			var i = 1;
			while (i < $(razaoSocial).length) {
				saida.push({
					"indice" : i,  
					"razaoSocial" :  $(razaoSocial[i]).val(), 
					"cnpj" :  $(cnpjSai[i]).val(),
					"parte" : $(tipoParte[i]).val(),
					"texto" : $(tipoParte[i]).find('option:selected').text()
				});				
				i++;
			}
			$("#relacaoDePartes").val(JSON.stringify(saida));
		});
	});

	//EXIBE NA TELA A DIV CONFORME O ITEM SELECIONADO NO SELECT
	/*
		APROVADO - SIM
        EXIBE DIV DE SELEÇÃO DE AREAS
        OCULTA DIV DE OBSERVAÇÕES
		CORRIGIR
        OCULTA DIV DE SELEÇÃO DE AREAS
        ECIBE DIV DE OBSERVAÇÕES  aprovJuridico  aprovSol --- Selecione um item ---
	*/
	
	// Habilita o campo de revisão Jurídico 
	if($("#idStatus").val() != 34) {
		$("select#aprovJuridico").val("--- Selecione um item ---");
		$("select#aprovJuridico").attr("required", "true");
		$("#aprovJuridico").on('change',function(){
			if($(this).val() == 'sim'){
				$("#divAreasAnalise").show();
				$("#divObsJuridico").show();
				} else {
				$("#divObsJuridico").show();
				$("#divAreasAnalise").hide();  
			}
		});
		
		if($("#idStatus").val() == 96 && $("#statusAnterior").val() == 34) {
			$("select#aprovSol").val("--- Selecione um item ---").attr("required", "true");
			$("#aprovSolObs").val("").attr("required", "true");
			$("#envioAreas .col-md-3").hide();
			$("#envioAreas .col-md-9").addClass("col-md-12").removeClass("col-md-9");
			$("#envioAreas legend").html("Contrato não aprovado pelo jurídico");
			$("#divObsJuridico label").html("Motivo");
			$("#divObsJuridico").show();
			$("#obsJuridico").attr("readonly", "true");
			$("select#aprovJuridico").attr("readonly", "true");	
			$("#envioAreas").show();
			$("#divAreasAnalise").hide();  
		}
	} 
	
	if ($("#idStatus").val() == 34) {	
		$("select#aprovJuridico").val("--- Selecione um item ---");
		$("select#aprovJuridico").attr("required", "true");		
		$("#aprovJuridico").on('change',function(){
			if($(this).val() == 'sim'){
				$("#divAreasAnalise").hide();  
				$("#divObsJuridico").hide();
				} else {
				$("#divObsJuridico").show();
				$("#divAreasAnalise").hide();  
			}
		});
	}
	//quando alterado o valor do campo dataTermino verifica se o valor é menor que a data de inicio informada
	$("#dataTermino").on("change",function(){
		var valorMes = $("#dataInicio").val();
		if($(this).val() < valorMes){
			$(this).closest("div").addClass("has-error");
			alert("Atenção, a data de vigência é menor que a data de inicio, por favor, revise os dados!")
			} else {
			$(this).closest("div").removeClass("has-error");
		}
	});
	
	//verifica se o formulário está no modo de visualização e escnde ou apresenta determinados campos
	if (FORM_MODE == 'VIEW') {
		
		$('.btnAddRevisaoContr').closest("a").hide();
		$('.btnAddRevisaoAnexo').closest("a").hide();
		$('.btnRemoveRevisao').hide();
		$('#tipoDoc').hide();
		$('#tipoDoc').closest("div").append("<span class='form-control'>"+$("#idTipoDoc").val()+"</span>");
		//$('btnDownloadRev').hide();
		$("span option").hide();
	}
	
    //VERIFICA SE O VALOR MENSAL NÃO É MAIOR QUE O VALOR INFOMRADO NO CAMPO VALOR TOTAL
	$("#valorTotal").on("blur",function(){
		var valorMes = $("#valorMensal").val();
		if(!valorMes.toString().trim() ){
			alert("Digite um valor no campo valor mensal antes de preencher o campo valor total.");
			$(this).val("");
		}
		var valorTotal = $(this).val();
		
		//verifica se o valor informado no campo valorTotal não é menor que o valor informado no campo valorMensal
		if(parseFloat(semPonto(valorMes).replace(',','.')) > parseFloat(semPonto(valorTotal).replace(',','.'))){
			$(this).closest("div").addClass("has-error");
			alert("O valor informado no campo valor mês é maior que o informado no campo valor total, por favor, revise as informações."); 
			} else {
			$(this).closest("div").removeClass("has-error");
		}
	});
	
	//FUNÇÃO PARA CONTROLE CASO SEJA SELECIONADO O CAMPO SEM ANALISE (DESABILITA OS CAMPOS CASO SELECIONADO E HABILITA CASO DESMARCADO)
	$("#semAnalise").change(function(){
		if($(this).is(':checked')){
			$("#divAreasAnalise").find("input[id^='area']").each(function(){
				$(this).prop('checked',false);
				$(this).attr("disabled",true);
			});
		}
		else {
			$("#divAreasAnalise").find("input[id^='area']").each(function(){
				$(this).attr("disabled",false);
			});
		}
	});
	
	//quando carregado o formulário atribui aos botões de download de contratos da tabela pai x filho o seu devido link
	$(".btnDownloadCont").each(function(){
		var url = $(this).closest("td").find("input[id^='hdnUrl']").val();
		$(this).attr("href",url);
	});
	
	//quando carregado o formulário atribui aos botões de download de anexos da tabela pai x filho o seu devido link
	$(".btnDownloadAnx").each(function(){
		var url = $(this).closest("td").find("input[id^='hdnUrl']").val();
		$(this).attr("href",url);
	});
	
	//quando trocado o valor do campo selectAprov nas atividades de analise das áreas
	$(".selectAprov").on('change',function(){
		if($(this).val() == 'sim'){
			$(this).closest('.row').find('.selectDestino').hide();  
			} else {
			$(this).closest('.row').find('.selectDestino').show();  
		}
	});

	
});
// fim do ready

//função para montar a tabela de revisões com mustache, atraves dos valores salvos 
function montaDocumentosAnx(){
	var fase = statusAtv($("#idStatus").val());
	var template = FORM_MODE == 'VIEW' ? $("#tmplRevisaoContratoVIEW").html() : $("#tmplRevisaoContrato").html();
	//caso o campo que armazena os valores das revisões do contratos em json possui não está em branco
	if($("#hdnJsonRevisao").val()){
		obj = JSON.parse($("#hdnJsonRevisao").val());
        for(var cont = 0;cont < obj.length;cont++){
			obj[cont].linkDownload = gerarLinkArquivo(obj[cont].idDoc);
			$(obj[cont].elementoPai).closest("td").find("table[id^='tbRevisao']>tbody>tr").append(Mustache.render(template, obj[cont]));
			if(FORM_MODE == 'VIEW'){
				$("#trDescRev"+obj[cont].tipoDoc+"___"+obj[cont].idFather+"_"+obj[cont].idSon).text(obj[cont].nomeDoc);
				} else {
				$("#trDescRev"+obj[cont].tipoDoc+"___"+obj[cont].idFather+"_"+obj[cont].idSon).val(obj[cont].nomeDoc);
			}
		}
	}  
	
	//caso o campo que armazena os valores das revisões dos anexos em json possui não está em branco
	if($("#hdnJsonRevisaoAnexo").val()){
		obj = JSON.parse($("#hdnJsonRevisaoAnexo").val());
        for(var cont = 0;cont < obj.length;cont++){
			obj[cont].linkDownload = gerarLinkArquivo(obj[cont].idDoc);
			$(obj[cont].elementoPai).closest("td").find("table[id^='tbRevisaoAnexo']>tbody>tr").append(Mustache.render(template, obj[cont]));
			if(FORM_MODE == 'VIEW'){
				$("#trDescRev"+obj[cont].tipoDoc+"___"+obj[cont].idFather+"_"+obj[cont].idSon).text(obj[cont].nomeDoc);
				} else {
				$("#trDescRev"+obj[cont].tipoDoc+"___"+obj[cont].idFather+"_"+obj[cont].idSon).val(obj[cont].nomeDoc);
			}
		}
	} 
}

function montaContratoConsol(){
	var template = $("#tmplContratoCons").html();
	
	if($("#hdnJsonRevisao").val()){
		obj = JSON.parse($("#hdnJsonRevisao").val());  
		var checkNull = true;
		for(var cont = 0;cont < obj.length;cont++){
			obj[cont].linkDownload = gerarLinkArquivo(obj[cont].idDoc);
			if(obj[cont].idAtividade == 30){
				$("#tbContratoConsol>tbody").append(Mustache.render(template, obj[cont]));
				checkNull = false;
			}
		}
		if(checkNull){
			var templateNull = $("#tmplAnxConsNull").html();
			$("#tbContratoConsol>tbody").append(Mustache.render(templateNull, obj[cont]));
		}
		} else {
		var lengthTabela = $("#tbTrContrato>tbody").children("tr").length;
		var obj = [];
		var item ="";
		$("#tbTrContrato>tbody").children("tr").each(function(index){
			var idRow = $(this).find(".trDescContrato").attr("id");
			if(isFinite(indexFromId(idRow))){
				var nomeDoc = $(this).find("input[id^='trDescContrato___']").val();
				var link = $(this).find("input[id^='hdnUrlContrato___']").val();
				
				item ={
					"nomeDoc": nomeDoc,
					"idFather":index,
					"linkDownload":link
				};
				obj.push(item);
				$("#tbContratoConsol>tbody").append(Mustache.render(template, obj[index-1]));
			}
		});      
	}
	
	if($("#hdnJsonRevisaoAnexo").val()){
		obj = JSON.parse($("#hdnJsonRevisaoAnexo").val());
		var checkNull = true;
		for(var cont = 0;cont < obj.length;cont++){
			obj[cont].linkDownload = gerarLinkArquivo(obj[cont].idDoc);
			if(obj[cont].idAtividade == 30){
				$("#tbAnexoConsol>tbody").append(Mustache.render(template, obj[cont]));
				checkNull = false;
			}
		}
		if(checkNull){
			var templateNull = $("#tmplAnxConsNull").html();
			$("#tbAnexoConsol>tbody").append(Mustache.render(templateNull, obj[cont]));
		} 
		} else {
		var lengthTabela = $("#tbTrAnexos>tbody").children("tr").length;
		var obj = [];
		var item ="";
		$("#tbTrAnexos>tbody").children("tr").each(function(index){
			var idRow = $(this).find(".trDescAnexo").attr("id");
			if(isFinite(indexFromId(idRow))){
				var nomeDoc = $(this).find("input[id^='trDescAnexo___']").val();
				var link = $(this).find("input[id^='hdnUrlAnexo___']").val();
				
				item ={
					"nomeDoc": nomeDoc,
					"idFather":index,
					"linkDownload":link
				};
				obj.push(item);
				$("#tbAnexoConsol>tbody").append(Mustache.render(template, obj[index-1]));
			}
		}); 
	}  
}

function montaContratoVigente(){
	var template = $("#tmplContratoCons").html();
	
	if($("#hdnJsonRevisao").val()){
		obj = JSON.parse($("#hdnJsonRevisao").val());  
		var checkNull = true;
		for(var cont = 0;cont < obj.length;cont++){
			obj[cont].linkDownload = gerarLinkArquivo(obj[cont].idDoc);
			if(obj[cont].idAtividade == 34){
				$("#tbContratoConsol>tbody").append(Mustache.render(template, obj[cont]));
				checkNull = false;
			}
		}
		if(checkNull){
			var templateNull = $("#tmplAnxConsNull").html();
			$("#tbContratoConsol>tbody").append(Mustache.render(templateNull, obj[cont]));
		}
		} else {
		var templateNull = $("#tmplAnxConsNull").html();
		$("#tbContratoConsol>tbody").append(Mustache.render(templateNull, obj[cont]));
	} 
	
	if($("#hdnJsonRevisaoAnexo").val()){
		obj = JSON.parse($("#hdnJsonRevisaoAnexo").val());
		var checkNull = true;
		for(var cont = 0;cont < obj.length;cont++){
			obj[cont].linkDownload = gerarLinkArquivo(obj[cont].idDoc);
			if(obj[cont].idAtividade == 34){
				$("#tbAnexoConsol>tbody").append(Mustache.render(template, obj[cont]));
				checkNull = false;
			}
		}
		if(checkNull){
			var templateNull = $("#tmplAnxConsNull").html();
			$("#tbAnexoConsol>tbody").append(Mustache.render(templateNull, obj[cont]));
		} 
		} else {
		var templateNull = $("#tmplAnxConsNull").html();
		$("#tbAnexoConsol>tbody").append(Mustache.render(templateNull, obj[cont]));
	} 
	
}

//BOTOES FUNC

//botão que abre interface de envio de anexo
function showCamera(nomeAnexo) {
	var retShowCam;
	if (nomeAnexo != undefined && nomeAnexo.trim() != "") {
		retShowCam = JSInterface.showCamera(nomeAnexo);
		} else {
		retShowCam = JSInterface.showCamera();    
	}
}

function validaHeader(){
	var camposHeader = new Array();
	camposHeader['areaSol'] = 'Área solicitante';
	camposHeader['parteContratada'] = 'Contratada';
	camposHeader['parteContratante'] = 'Contratante';
	camposHeader['objeto'] = 'Objeto';
	camposHeader['tipoContrato'] = 'Tipo de Contrato';
	camposHeader['dataInicio'] = 'Data Início';
	//camposHeader['dataTermino'] = 'Data Término';
	camposHeader['valorMensal'] = 'Valor Mensal';
	camposHeader['valorTotal'] = 'Valor Total';
	camposHeader['formaPagamento'] = 'Forma de Pagamento';
	camposHeader['tipoDocumento'] = 'Tipo de Documento';
	
  	var txtAlert = "Existem campos com erros ou que não foram preenchidos:\n";
    /* Limpa campos que estavam com erro da validacao anterior */
    var cErro = new Array();
	
    for (var key in camposHeader) {
		if (camposHeader.hasOwnProperty(key)) {
			var campo = key;
			var valOk = validaInput($('#'+campo));
			if(!valOk[0]){
				$('#'+campo).closest(".form-group").addClass("has-error");
				cErro.push(camposHeader[key]);
			}
		}
	}
	
    if(cErro.length > 0 ){
		throw txtAlert + cErro.join('\n');
	}
}

//função para validar aprovações simples
var validaAprovacao = function(obsName, obsLabel){
	if (obsName != undefined){
		var obs = $('#'+obsName).val();
		if(obs == undefined || obs.trim() == ''){
			throw "Na etapa de aprovação, todos os campos são obrigatórios.\nPor favor, preencha o campo \""+ obsLabel + "\"";
		}
	}
}

var validarSelArea = function(){
	var areaSelected = $('#envioAreas').find("input[type='checkbox']:checked");
	if(!areaSelected.length && $("#aprovJuridico").val() == 'sim'){
		throw "Por favor, selecione ao menos uma área para realizar a análise.";
	}
}

//----------------validacao------------------//
var validaInput = function(el){
    var ok = false;
    var nome = $(el).prop("name");
    var tipo = $(el).prop("type");
	
    if(tipo == "checkbox"){
		var checks = $("[name='"+ name + "']:checked");
		ok =  checks.length == 0 ? true : false;
		} else  if(tipo =="radio"){
		ok =  $(el).checked;
		} else {
		ok = ($(el).val() != undefined && $(el).val() != null && $(el).val().trim() == ""  );
	}
	
    var r = [!ok , nome ];
    return r;
	
}


//função para bloquear campos do formulario
function setDivReadOnly(ids) {
	$.each(ids, function (key, value) {
		$("#" + value).find("input[type='text'],input[type='date'],input[type='number']").attr("readonly", "readonly");
		$("#" + value).find("input[type='text'],input[type='date'],input[type='number']").addClass("ReadOnly");
		$("#" + value).find("textarea").attr("readonly", "readonly");
		// $("#"+value).find("input[type='button']").hide();
		$("#" + value).find("input[type='checkbox']").attr("disabled", "true");
		$("#" + value).find("button").hide();
		$("#" + value).find("img").hide();
		$("#" + value).find('.esconde').hide();
		$("#" + value).find('.desabilita').attr('disabled', true);
		$("#" + value).find('#adicionarLinha').hide();
		
		$("#" + value).find("select").each(function () {
			var val = $(this).find("option[selected]").text();
			$(this).parent().append($("<input class='ReadOnly form-control' readonly='readonly' value='" + val + "'/>"));
			$(this).hide();
		});
		
	});
}

function setDivEnabled(ids) {
	$.each(ids, function (key, value) {
		$("#" + value).find("input[type='text'],input[type='date'],input[type='number']").removeAttr("readonly");
		$("#" + value).find("input[type='text'],input[type='date'],input[type='number']").removeClass("ReadOnly");
		$("#" + value).find("textarea").removeAttr("readonly");
		// $("#"+value).find("input[type='button']").hide();
		$("#" + value).find("input[type='checkbox']").removeAttr("disabled");
		//$("#" + value).find("button").hide();
		//$("#" + value).find("img").hide();
		//$("#" + value).find('.esconde').hide();
		//$("#" + value).find('.desabilita').attr('disabled', true);
		//$("#" + value).find('#adicionarLinha').hide();
		
		$("#" + value).find("select").each(function () {
			var val = $(this).find("option[selected]").text();
			$(this).parent().find('input').each(function(){
				$(this).hide();
			});
			$(this).show();
		});
	});
}

//funcoes uteis
//retorna index do id paiiflho passado
var indexFromId = function (id) {
	return semCaractere(id.substring(id.length - 3), '_');
}
//remove toda ocorrencia do caractere passado
var semCaractere = function (valor, c) {
	while (valor.indexOf(c) >= 0) {
		valor = valor.replace(c, '');
	}
	return valor;
}

function selectTipoDoc(){
	var cons1 = DatasetFactory.createConstraint('status', '1', '1', ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset('dsTipoDocContratos', null, new Array(cons1), new Array('tipoDoc'));
	
	var row = [];
	
	for(var cont = 0;cont < dataset.values.length; cont++){
		row = dataset.values[cont];
		if($("#idTipoDoc").val() != null && $("#idTipoDoc").val() == row["tipoDoc"]){
			$("#tipoDoc").append("<option value='"+row["tipoDoc"]+"' selected>"+row["tipoDoc"]+"</option>");
			} else {
			$("#tipoDoc").append("<option value='"+row["tipoDoc"]+"'>"+row["tipoDoc"]+"</option>");
		}
	}
	
	$("#tipoDoc").on("change",function(){
		$("#idTipoDoc").val($('#tipoDoc option:selected').text());
	});
}

function nomeUsrCompleto(usuario){
	var cons1 = DatasetFactory.createConstraint('colleaguePK.colleagueId', usuario, usuario, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset('colleague', null, new Array(cons1), null);
	var row = [];
	
	for(var cont = 0;cont < dataset.values.length; cont++){
		row = dataset.values[cont];
	}
	return row["colleagueName"];
}

function botoesPaiFilho(){
	$("button[id^='btnRmvAnexo']").hide();
	$(".btnAtualizaAnexo").show();
	$("a[id^='btnBaixarAnexo']").show();
}

function statusAtv(atv){
	var status;
	switch(atv){
		case '0':
		status = {'id' : 4,
			'descricao' : "Solicitante",
			'obs' : "Solicitante",
			'abrv' : "Original"
		};
		break;
		case '4':
		status = {'id' : 4,
			'descricao' : "Solicitante",
			'obs' : "Solicitante",
			'abrv' : "Original"
		};
		break;
		case '61':
		status = {'id' : 61,
			'descricao' : "Gestor do Solicitante",
			'obs' : "Gestor do Solicitante",
			'abrv' : "aprov gestor"
		};
		break;
		case '68':
		// status = {'id' : 68,
		// 	'descricao' : "Correção (correção do formulário pelo solicitante)",
		// 	'obs' : "Correção (correção do formulário pelo solicitante)",
		// 	'abrv' : "corrigido"
		// };
		status = {'id' : 68,
			'descricao' : "Solicitante",
			'obs' : "Solicitante",
			'abrv' : "corrigido"
		};
		break;
		case '5':
		status = {'id' : 5,
			'descricao' : "Jurídico",
			'obs' : "Jurídico",
			'abrv' : "analisado jur"
		};
		break;
		case '13':
		status = {'id' : 13,
			'descricao' : "Customer Service",
			'obs' : "Customer Service",
			'abrv' : "analisado service"
		};
		break;
		case '15':
		status = {'id' : 15,
			'descricao' : "Logística",
			'obs' : "Logística",
			'abrv' : "analisado log"
		};
		break;
		case '11':
		status = {'id' : 11,
			'descricao' : "Financeiro",
			'obs' : "Financeiro",
			'abrv' : "analisado fin"
		};
		break;
		case '149':
		status = {'id' : 149,
			'descricao' : "Fiscal",
			'obs' : "Fiscal",
			'abrv' : "analisado fiscal"
		};
		break;
		case '184':
		status = {'id' : 184,
			'descricao' : "Atendimento E-Commerce",
			'obs' : "Atendimento E-Commerce",
			'abrv' : "analisado e-commerce"
		};
		break;
		case '30':
		status = {'id' : 30,  // Consolidação do contrato 
			'descricao' : "Jurídico",
			'obs' : "Jurídico",
			'abrv' : "consolidado"
		};
		break;
		case '32':
		status = {'id' : 32,
			'descricao' : "Validação do Fornecedor",
			'obs' : "Validação do Fornecedor",
			'abrv' : "Validado fornec"
		};
		break;
		case '87':
		status = {'id' : 87,
			'descricao' : "Aprovação das partes",
			'obs' : "Aprovação das outras partes participantes do contrato",
			'abrv' : "Aprovado partes"
		};
		break;
		case '34':
		status = {'id' : 34, //Coleta de assinaturas
			'descricao' : "Jurídico",
			'obs' : "Jurídico",
			'abrv' : "Contrato Vigente"
		};
		break;
		case '56':
		status = {'id' : 56, //Revisão Financeiro
			'descricao' : "Solicitante",
			'obs' : "Solicitante",
			'abrv' : "rev - fin"
		};
		break;
		case '151':
		status = {'id' : 151, //Revisão Jurídico - Financeiro
			'descricao' : "Jurídico",
			'obs' : "Jurídico",
			'abrv' : "rev jur - fin"
		};
		break;
		case '150':
		status = {'id' : 150, //Revisão Fiscal
			'descricao' : "Solicitante",
			'obs' : "Solicitante",
			'abrv' : "revisao - fiscal"
		};
		break;
		case '187':
		status = {'id' : 187, //Revisão E-commerce
			'descricao' : "Solicitante",
			'obs' : "Solicitante",
			'abrv' : "revisao - ecommerce"
		};
		break;
		case '160':
		status = {'id' : 160, //Revisão Jurídico - Fiscal
			'descricao' : "Jurídico",
			'obs' : "Jurídico",
			'abrv' : "rev jur - fiscal"
		};
		break;
		case '51':
		status = {'id' : 51, //Revisão Logística
			'descricao' : "Solicitante",
			'obs' : "Solicitante",
			'abrv' : "rev - log"
		};
		break;
		case '143':
		status = {'id' : 143, //Revisão Jurídico - Logística
			'descricao' : "Jurídico",
			'obs' : "Jurídico",
			'abrv' : "rev jur - log"
		};
		break;
		case '44':
		status = {'id' : 44, //Coleta de assinaturas
			'descricao' : "Jurídico",
			'obs' : "Jurídico",
			'abrv' : "Contrato Vigente"
		};
		break;
		case '96':
		status = {'id' : 96, //Validação do Solicitante
			'descricao' : "Solicitante",
			'obs' : "Validação do solicitante com o fornecedor",
			'abrv' : "Validado solicitante"
		};
		break;
		case '106':
		status = {'id' : 106, //Contrato Vigente
			'descricao' : "Jurídico",
			'obs' : "Contrato Vigente",
			'abrv' : "Contrato Vigente"
		};
		break;
		case '48':
		status = {'id' : 48, //Revisão Customer Service
			'descricao' : "Solicitante",
			'obs' : "Revisão Customer Service",
			'abrv' : "rev cost ser"
		};
		break;
		case '146':
		status = {'id' : 146, //Revisão Jurídico - Customer Service
			'descricao' : "Jurídico",
			'obs' : "Revisão Jurídico - Customer Service",
			'abrv' : "rev jur - cost serv"
		};
		break;
		case '188':
		status = {'id' : 188, //Revisão Jurídico - Ecommerce
			'descricao' : "Jurídico",
			'obs' : "Revisão Jurídico - Atendimento E-Commerce",
			'abrv' : "rev jur - ecommerce"
		};
		break;
		case '108':
		status = {'id' : 108, // Contrato Expirado
			'descricao' : "Jurídico",
			'obs' : "Contrato Expirado",
			'abrv' : ""
		};
		break;
		case '66':
		status = {'id' : 66,
			'descricao' : "Cancelado",
			'obs' : "Cancelado",
			'abrv' : ""
		};
		break;
		case '36':
		status = {'id' : 36,
			'descricao' : "Encerrado",
			'obs' : "Encerrado",
			'abrv' : ""
		};
		break;
		case '204':
		status = {'id' : 204,
			'descricao' : "Presidência",
			'obs' : "Presidência",
			'abrv' : ""
		};
		case '72':
		status = {'id' : 72,
			'descricao' : "Aditivo",
			'obs' : "Aditivo",
			'abrv' : ""
		};
		break;
		default:
		throw 'Atividade desconhecida';
	}
	return status;
}

//VERIFICA SE SE EXISTE DUPLICIDADE DE CNPJ NO CAMPO DE PAPEIS
function adicionaPapeis(){
	
	var campoVazio = false;
	$("input[id^='razaoSocial___']").each(function(){
		if(!$(this).val()){
			campoVazio = true;
			$(this).closest('td').addClass('has-error');
			$(this).on("blur",function(){
				$(this).closest('td').removeClass('has-error');
			});
		}
	});
    $("input[id^='cnpjPapel___']").each(function(){
		if(!$(this).val()){
			campoVazio = true;
			$(this).closest('td').addClass('has-error');
			$(this).on("blur",function(){
				$(this).closest('td').removeClass('has-error');
			});
		}
	});
    $("select[id^='tipoParte___']").each(function(){
		if(!$(this).val()){
			campoVazio = true;
			$(this).closest('td').addClass('has-error');
			$(this).on("blur",function(){
				$(this).closest('td').removeClass('has-error');
			});
		}
	});
	
	if(campoVazio){
		alert("Existem campos vazios no papel adicionado, preencha todas as informações antes de adicionar um novo papel!");
		} else {
		var lengthTb = $("#tbOutrasPartes>tbody").find("tr").length;
		var checkFirst = lengthTb == 1 ? true : false;
		
		var id = wdkAddChild('tbOutrasPartes');
		
		$("#cnpjPapel___"+id).on("blur",function(){
			var cnpjAtual = $(this).val();
			var check = false;
			
			$("input[id^='cnpjPapel___']").not(this).each(function(){
				var valor = $(this).val();
				if(valor == cnpjAtual && valor != null){
					check = true;
				}
			});
			
			if(check){
				$(this).closest("td").addClass("has-error");
				alert("CNPJ já informado");
				} else {
				$(this).closest("td").removeClass("has-error");
			}
		});
	} 
}

function verificaAprovador(user){
	var c1 = DatasetFactory.createConstraint('solicitante', user, user, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset('dsFormAprovadoresContrato', null, new Array(c1), null);
	var row = [];
	
	for(var cont = 0;cont < dataset.values.length; cont++){
		row = dataset.values[cont];
	}
	return row["aprovador"];
}

function dataAtualFormatada() {
    var data = new Date();
    var dia = data.getDate();
    if (dia.toString().length == 1)
	dia = '0' + dia;
    var mes = data.getMonth() + 1;
    if (mes.toString().length == 1)
	mes = '0' + mes;
    var ano = data.getFullYear();
    return dia + '/' + mes + '/' + ano;
}

var beforeSendValidate = function(numState) {
	var usuario = $('#usrSolicitante').val();
	$("#usrAprovador").val(verificaAprovador(usuario));
	$(".has-error").removeClass("has-error");
	
	validaHeader();
	
	if (numState == 5) {
		validarSelArea();
	}
	// aprovacao de validacao
	if (numState == 17) {
		validaAprovacao('aprovSolObs','Observações');
	}
	if (numState == 13) {
		validaAprovacao('aprovCSObs', 'Observações');
		histAnaliseAreas("CS","analise");
	}
	if (numState == 15) {
		validaAprovacao('aprovLogObs', 'Observações');
		histAnaliseAreas("Log","analise");
	}
	if (numState == 11) {
		validaAprovacao('aprovFinObs', 'Observações');
		histAnaliseAreas("Fin","analise");
	}
	if (numState == 149) {
		validaAprovacao('aprovFiscalObs', 'Observações');
		histAnaliseAreas("Fiscal","analise");
	}
	if (numState == 184) {
		validaAprovacao('aprovECommerceObs', 'Observações');
		histAnaliseAreas("ECommerce","analise");
	}
	if (numState == 48 || numState == 146) {
		validaAprovacao('observRevisaoCS', 'Observações');
		histAnaliseAreas("CS","revisao");
	}
	if (numState == 51 || numState == 143) {
		validaAprovacao('observRevisaoLog', 'Observações');
		histAnaliseAreas("Log","revisao");
	}
	if (numState == 61 || numState == 204) { 
		validaAprovacao('aprovSuperiorObs', 'Observações');
		histAnaliseAreas("Superior","analise");
	} 
	if (numState == 5) { 
		validaAprovacao('obsJuridico', 'Informe o motivo da correção');
		histAnaliseAreas("Jurídico","juridico");
	} 
	if (numState == 56 || numState == 151) {
		validaAprovacao('observRevisaoFin', 'Observações');
		histAnaliseAreas("Fin","revisao");
	}
	if (numState == 150 || numState == 160) {
		validaAprovacao('observRevisaoFiscal', 'Observações');
		histAnaliseAreas("Fiscal","revisao");
	}
	if (numState == 187 || numState == 188) {
		validaAprovacao('observRevisaoECommerce', 'Observações');
		histAnaliseAreas("ECommerce","revisao");
	}
	
	if(numState == 30){
		//validaAnexosConsol();
	}
	if(numState == 34){
		//validaAnexosVigente();
	}
	if(numState == 108){
		if($("#motivoExpirado").val() == ""){
			throw "Por favor, informe o motivo do encerramento do contrato";
		}
	}
}

function histAnaliseAreas(area,tarefa){
	area = (area == 'Jurídico') ? 'Juridico' : area;
	var historico = $("#hdnJsonHist"+area).val() ? JSON.parse($("#hdnJsonHist"+area).val()) : []; 
	var msg;
	if( tarefa == "analise"){
		msg =  $("#aprov"+area+"Obs").val();
	}
	else if(tarefa == "juridico"){
		msg = $("#obs"+area+"").val();
	}
	else{
		msg = $("#observRevisao"+area).val();
	}
	
	
	var obj = {"msg":msg,
		"autor":userAtual,
		"data":dataHora(),
		//"atividade":$("#status #descStatus").val(),
		//"atividade":$("#status h1").html(),
		//"atividade": nomeDaAtividade,
		"atividade": atividadeDescHist[0],
		"sequencia": atividadeDescHist[1],
		"area":area
	}
	//	console.log("Hitorico: " + obj);
	historico.push(obj);
	
	$("#hdnJsonHist"+area).val(JSON.stringify(historico));
}


// Histórico completo
function montaHistCompleto(){
	
	var template = $("#tmplCollapseHist").html();
	
	var fiscal =  $("#hdnJsonHistFiscal").val() ? JSON.parse($("#hdnJsonHistFiscal").val()) : "";
	var fin =  $("#hdnJsonHistFin").val() ? JSON.parse($("#hdnJsonHistFin").val()) : "";
	var cs =  $("#hdnJsonHistCS").val() ? JSON.parse($("#hdnJsonHistCS").val()) : "";
	var log =  $("#hdnJsonHistLog").val() ? JSON.parse($("#hdnJsonHistLog").val()) : "";
	var eCommerce  =  $("#hdnJsonHistECommerce").val() ? JSON.parse($("#hdnJsonHistECommerce").val()) : "";
	var superior =  $("#hdnJsonHistSuperior").val() ? JSON.parse($("#hdnJsonHistSuperior").val()) : "";
	var juridico =  $("#hdnJsonHistJuridico").val() ? JSON.parse($("#hdnJsonHistJuridico").val()) : "";
	
	if (fiscal == "") {fiscal = JSON.parse('{"sequencia":"Não utlizado","msg":"Não utlizado","autor":"Não utlizado","data":"Não utlizado","atividade":"Fiscal","area":"Não utlizado"}');}
	if (fiscal != "") {fiscal =  $("#hdnJsonHistFiscal").val() ? JSON.parse($("#hdnJsonHistFiscal").val()) : "";}
	
	if (cs == "") {cs = JSON.parse('{"sequencia":"Não utlizado","msg":"Não utlizado","autor":"Não utlizado","data":"Não utlizado","atividade":"Customer Service","area":"Não utlizado"}');}
	if (cs != "") {cs =  $("#hdnJsonHistCS").val() ? JSON.parse($("#hdnJsonHistCS").val()) : "";}
	
	if (fin == "") {fin = JSON.parse('{"sequencia":"Não utlizado","msg":"Não utlizado","autor":"Não utlizado","data":"Não utlizado","atividade":"Financeiro","area":"Não utlizado"}');}
	if (fin != "") {fin =  $("#hdnJsonHistFin").val() ? JSON.parse($("#hdnJsonHistFin").val()) : "";}
	
	if (log == "") {log = JSON.parse('{"sequencia":"Não utlizado","msg":"Não utlizado","autor":"Não utlizado","data":"Não utlizado","atividade":"Logística","area":"Não utlizado"}');}
	if (log != "") {log =  $("#hdnJsonHistLog").val() ? JSON.parse($("#hdnJsonHistLog").val()) : "";}
	
	if (eCommerce == "") {eCommerce = JSON.parse('{"sequencia":"Não utlizado","msg":"Não utlizado","autor":"Não utlizado","data":"Não utlizado","atividade":"E-commerce","area":"Não utlizado"}');}
	if (eCommerce != "") {eCommerce =  $("#hdnJsonHistECommerce").val() ? JSON.parse($("#hdnJsonHistECommerce").val()) : "";}
	
	if (superior == "") {superior = JSON.parse('{"sequencia":"Não utlizado","msg":"Não utlizado","autor":"Não utlizado","data":"Não utlizado","atividade":"Superior","area":"Não utlizado"}');}
	if (superior != "") {superior =  $("#hdnJsonHistSuperior").val() ? JSON.parse($("#hdnJsonHistSuperior").val()) : "";}
	
	if (juridico == "") {juridico = JSON.parse('{"sequencia":"Não utlizado","msg":"Não utlizado","autor":"Não utlizado","data":"Não utlizado","atividade":"Juridico","area":"Não utlizado"}');}
	if (juridico != "") {juridico =  $("#hdnJsonHistJuridico").val() ? JSON.parse($("#hdnJsonHistJuridico").val()) : "";}
	
	var historico = superior.concat(juridico, fin, cs, log, eCommerce, fiscal);
	
	console.log(historico); 
	
	for(var cont = 0; cont < historico.length;cont++){
		if(historico[cont] != "") {
			$("#conteudoHistFiscal").append(Mustache.render(template,historico[cont])); 
			$("#conteudoHistFin").append(Mustache.render(template,historico[cont])); 
			$("#conteudoHistLog").append(Mustache.render(template,historico[cont])); 
			$("#conteudoHistCS").append(Mustache.render(template,historico[cont])); 
			$("#conteudoHistECommerce").append(Mustache.render(template,historico[cont])); 
		}	
	}
} 

// Mota Histórico Original
function montaHistAreas(area){
	var template = $("#tmplCollapseHist").html();
	var historico = $("#hdnJsonHist"+area).val() ? JSON.parse($("#hdnJsonHist"+area).val()) : "";
	for(var cont = 0; cont < historico.length;cont++){
		$("#conteudoHist"+area).append(Mustache.render(template,historico[cont])); 
	}
}

$(function () {
	console.log("upload");
	$('.btnAddAnexo').fileupload({
		dataType: 'json',
		done: function (e, data) {
			console.log("upload done");
			if($("#tipoDoc").val()){
				var myLoading2 = FLUIGC.loading(window);
				myLoading2.show();
				
				var id = wdkAddChild('tbTrAnexos');
				if($("#idStatus").val() == 4 || $("#idStatus").val() == 0 || $("#idStatus").val() == 30){
					$(".btnAddRevisaoAnexo").closest("a").hide();
					$("#btnRmvAnexo___"+id).show();
				}
				var index = ($("#tbTrAnexos>tbody").children("tr").length)-1;
				var fase = statusAtv($("#idStatus").val());
				var nomCon = "Anexo - "+index+" - "+$("#tipoDoc").val()+" - "+fase.abrv;
				
				var folderId = $("#contractFolderId").val();
				
				if(!folderId){
					folderId = criarPastaECM();
				}
				
				$.each(data.result.files, function (index, file) {
					var nome = [];
					nomeUpload= file.name;
					nome = nomeUpload.split(".");
					nomCon = nomCon+"."+nome[1];
					
					$.ajax({
						async : true,
						type : "POST",
						contentType: "application/json",
						url : '/api/public/ecm/document/createDocument',
						
						data: JSON.stringify({
							
							"description": nomCon,
							"parentId": folderId,
							"attachments": [{
								"fileName": file.name
							}],
						}),
						error: function(e) {
							console.log(e);
							FLUIGC.toast({
								title: '',
								message: "Falha ao enviar",
								type: 'danger'
							});
							myLoading2.hide();
						},
						
						success: function(data) {
							FLUIGC.toast({
								title: '',
								message: "Documento publicado - " + nomCon,
								type: 'info'
							});
							
							$("#trDescAnexo___"+id).val(nomCon);
							$("#hdnIdAnexo___"+id).val(data.content.id);
							$("#hdnUrlAnexo___"+id).val(gerarLinkArquivo(data.content.id));
							$("#hdnUrlAnexo___"+id).closest("td").find(".btnDownloadAnx").attr("href",$("#hdnUrlAnexo___"+id).val());
							
							myLoading2.hide();
						},
					});
				});
				} else {
				alert("Selecione um tipo de contrato antes de anexar o arquivo!");
			}
		}
	});
});

$(function () { 
	$('.btnAddRevisaoAnexo').fileupload({
		dataType: 'json',
		done: function (e, data) {
			var myLoading2 = FLUIGC.loading(window);
			myLoading2.show();
			
			var idButton = $(this).closest(".row").find("input[id^='trDescAnexo___']").attr("id");
			var id = parseInt(idButton.replace(/[^0-9]/g,''));
			
			var trTabRevisao = $(this).closest("td").find("table[id^='tbRevisao']>tbody>tr");
			var linhaRevisao = ($(trTabRevisao).find('div[id^="arqv"]').length)+1;
			
			var obj = {
				"idSon":linhaRevisao,
				"idFather":id,
				"tipoDoc":'Anexo'
			}
			
			var fase = statusAtv($("#idStatus").val());
			var nomCon = "Anexo - "+id+" - "+$("#tipoDoc").val()+" - "+fase.abrv;
			
			var folderId = $("#contractFolderId").val();
			
			$.each(data.result.files, function (index, file) {
				var nome = [];
				nomeUpload= file.name;
				nome = nomeUpload.split(".");
				nomCon = nomCon+"."+nome[1];
				
				$.ajax({
					async : true,
					type : "POST",
					contentType: "application/json",
					url : '/api/public/ecm/document/createDocument',
					
					data: JSON.stringify({
						
						"description": nomCon,
						"parentId": folderId,
						"attachments": [{
							"fileName": file.name
						}],
					}),
					error: function(e) {
						console.log(e);
						FLUIGC.toast({
							title: '',
							message: "Falha ao enviar",
							type: 'danger'
						});
						myLoading2.hide();
					},
					
					success: function(data) {
						FLUIGC.toast({
							title: '',
							message: "Documento publicado - " + nomCon,
							type: 'info'
						});
						
						
						var objArq = new Object(); ;
						var json = $("#hdnJsonRevisaoAnexo").val() != "" ? JSON.parse($("#hdnJsonRevisaoAnexo").val()) : [];
						objArq.revisao = {
							"nomeDoc":nomCon,
							"elementoPai":"#trDescAnexo___"+id,
							"idSon":linhaRevisao,
							"idFather":id,
							"tipoDoc":'Anexo',
							"idDoc":data.content.id,
							"idAtividade":fase.id,
							"linkDownload":gerarLinkArquivo(data.content.id),
							"userRev":userAtual,
							"dataRev":dataHora()
						};
						
						var template = $("#tmplRevisaoContrato").html();
						var index = ($("#tbTrAnexos>tbody").children("tr").length)-1;
						$(trTabRevisao).append(Mustache.render(template, objArq.revisao));
						
						$("#trDescRevAnexo___"+id+"_"+linhaRevisao).val(nomCon);
						$("#trUserRevAnexo___"+id+"_"+linhaRevisao).val(userAtual);
						$("#trDataRevAnexo___"+id+"_"+linhaRevisao).val(dataHora());
						objArq.revisao.linkDownload  = "";
						json.push(objArq.revisao);
						
						$("#hdnJsonRevisaoAnexo").val(JSON.stringify(json));
						
						myLoading2.hide();
					},
				});
			});
		}
	});
});

$(function () { 
	console.log("Add contrato");
	$('.btnAddContrato').fileupload({
		dataType: 'json',
		done: function (e, data) {
			if($("#tipoDoc").val()){
				var myLoading2 = FLUIGC.loading(window);
				myLoading2.show();
				
				var id = wdkAddChild('tbTrContrato');
				if($("#idStatus").val() == 4 || $("#idStatus").val() == 0 ||  $("#idStatus").val() == 30){
					$(".btnAddRevisaoContr").closest("a").hide();
					$("#btnRmvContrato___"+id).show();
				}
				$("#hdnContratoAtv").val($("#idStatus").val());
				var index = ($("#tbTrAnexos>tbody").children("tr").length);
				var fase = statusAtv($("#idStatus").val());
				var nomCon = "Contrato - "+index+" - "+$("#tipoDoc").val()+" - "+fase.abrv;
				
				var folderId = $("#contractFolderId").val();
				
				if(!folderId){
					folderId = criarPastaECM();
				}
				
				$.each(data.result.files, function (index, file) {
					var nome = [];
					nomeUpload= file.name;
					nome = nomeUpload.split(".");
					nomCon = nomCon+"."+nome[1];
					
					$.ajax({
						async : true,
						type : "POST",
						contentType: "application/json",
						url : '/api/public/ecm/document/createDocument',
						
						data: JSON.stringify({
							
							"description": nomCon,
							"parentId": folderId,
							"attachments": [{
								"fileName": file.name
							}],
						}),
						error: function(e) {
							console.log(e);
							FLUIGC.toast({
								title: '',
								message: "Falha ao enviar",
								type: 'danger'
							});
							myLoading2.hide();
						},
						
						success: function(data) {
							FLUIGC.toast({
								title: '',
								message: "Documento publicado - " + nomCon,
								type: 'info'
							});
							
							$("#trDescContrato___"+id).val(nomCon);
							$("#hdnIdContrato___"+id).val(data.content.id);
							$("#hdnUrlContrato___"+id).val(gerarLinkArquivo(data.content.id));
							$("#hdnUrlContrato___"+id).closest("td").find(".btnDownloadCont").attr("href",$("#hdnUrlContrato___"+id).val());
							$("#contractFolderId").val(folderId);
							myLoading2.hide();
						},
					});
				});
				} else {
				alert("Selecione um tipo de contrato antes de anexar o arquivo!");
			}
		}
	});
});

$(function () { 
	$('.btnAddRevisaoContr').fileupload({
		dataType: 'json',
		done: function (e, data) {
			var myLoading2 = FLUIGC.loading(window);
			myLoading2.show();
			
			var idButton = $(this).closest(".row").find("input[id^='trDescContrato']").attr("id");
			var id = parseInt(idButton.replace(/[^0-9]/g,''));
			
			var trTabRevisao = $(this).closest("td").find("table[id^='tbRevisao']>tbody>tr");
			var linhaRevisao = ($(trTabRevisao).find('div[id^="arqv"]').length)+1;
			
			var obj = {
				"idSon":linhaRevisao,
				"idFather":id,
				"tipoDoc":'Contrato'
			}
			
			var fase = statusAtv($("#idStatus").val());
			var nomCon = "Contrato - "+id+" - "+$("#tipoDoc").val()+" - "+fase.abrv;
			
			var folderId = $("#contractFolderId").val();
			
			$.each(data.result.files, function (index, file) {
				var nome = [];
				nomeUpload= file.name;
				nome = nomeUpload.split(".");
				nomCon = nomCon+"."+nome[1];
				
				$.ajax({
					async : true,
					type : "POST",
					contentType: "application/json",
					url : '/api/public/ecm/document/createDocument',
					
					data: JSON.stringify({
						
						"description": nomCon,
						"parentId": folderId,
						"attachments": [{
							"fileName": file.name
						}],
					}),
					error: function(e) {
						console.log(e);
						FLUIGC.toast({
							title: '',
							message: "Falha ao enviar",
							type: 'danger'
						});
						myLoading2.hide();
					},
					
					success: function(data) {
						FLUIGC.toast({
							title: '',
							message: "Documento publicado - " + nomCon,
							type: 'info'
						});
						
						
						var objArq = new Object(); ;
						var json = $("#hdnJsonRevisao").val() != "" ? JSON.parse($("#hdnJsonRevisao").val()) : [];
						objArq.revisao = {
							"nomeDoc":nomCon,
							"elementoPai":"#trDescContrato___"+id,
							"idSon":linhaRevisao,
							"idFather":id,
							"tipoDoc":'Contrato',
							"idDoc":data.content.id,
							"idAtividade":fase.id,
							"linkDownload":gerarLinkArquivo(data.content.id),
							"userRev":userAtual,
							"dataRev":dataHora()
						};
						
						var template = $("#tmplRevisaoContrato").html();
						var index = ($("#tbTrContrato>tbody").children("tr").length)-1;
						$(trTabRevisao).append(Mustache.render(template, objArq.revisao));
						$("#trDescRevContrato___"+id+"_"+linhaRevisao).val(nomCon);
						$("#trUserRevContrato___"+id+"_"+linhaRevisao).val(userAtual);
						$("#trDataRevContrato___"+id+"_"+linhaRevisao).val(dataHora());
						objArq.revisao.linkDownload = "";
						json.push(objArq.revisao);
						$("#contractFolderId").val(folderId);

						$("#hdnJsonRevisao").val(JSON.stringify(json));
						
						myLoading2.hide();
					},
				});
			});
		}
	});
});

$(function () { 
	$('.btnAddDocEncerrado').fileupload({
		dataType: 'json',
		done: function (e, data) {
			var myLoading2 = FLUIGC.loading(window);
			myLoading2.show();
			
			var id = wdkAddChild('tbDocEncerrado');
			
			var folderId = $("#contractFolderId").val();
			
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
					error: function(e) {
						console.log(e);
						FLUIGC.toast({
							title: '',
							message: "Falha ao enviar",
							type: 'danger'
						});
						myLoading2.hide();
					},
					
					success: function(data) {
						FLUIGC.toast({
							title: '',
							message: "Documento publicado - " + file.name,
							type: 'info'
						});
						
						$("#trDescDocEncerrado___"+id).val(file.name);
						$("#hdnIdDocEncerrado___"+id).val(data.content.id);
						$("#hdnUrlDocEncerrado___"+id).val(gerarLinkArquivo(data.content.id));
						$("#hdnUrlDocEncerrado___"+id).closest("td").find(".btnDownDocEncerrado").attr("href",$("#hdnUrlDocEncerrado___"+id).val());
						
						myLoading2.hide();
					},
				});
			});
		}
	});
});

function trDeleteAnexo(elem){ 
    
    FLUIGC.message.confirm({
		message: 'Deseja remover o documento selecionado?',
		title: 'Remover documento',
		labelYes: 'Remover',
		labelNo: 'Cancelar'
		}, function(result, el, ev) {
		
		if(result){
			var idDoc = $(elem).closest("td").find("input[id^='hdnId']").val();
			
			$.ajax({
				async : true,
				type : "POST",
				contentType: "application/json",
				url : '/api/public/ecm/document/remove',
				
				data: JSON.stringify({
					"id": idDoc
				}),
				error: function(e) {
					FLUIGC.toast({
						title: '',
						message: "Falha ao remover o arquivo",
						type: 'danger'
					});
					
				},
				
				success: function(data) {
					FLUIGC.toast({
						title: '',
						message: "Contrato removido",
						type: 'info'
					});
					
					fnWdkRemoveChild(elem);
				},
			});
		}
	});
}

function removeAnxRevisao(elem){
	FLUIGC.message.confirm({
		message: 'Desej remover a revisão selecionada?',
		title: 'Remover revisão',
		labelYes: 'Remover',
		labelNo: 'Cancelar'
		}, function(result, el, ev) {
		
		if(result){
			var divArqv = $(elem).closest("div[id^='arqv']");
			var idDoc = $(divArqv).find("input[id^='trIdRev']").val();
			var nomeArquivo = $(divArqv).find("input[id^='trDescRev']").val();
			var campoJson;
			
			$.ajax({
				async : true,
				type : "POST",
				contentType: "application/json",
				url : '/api/public/ecm/document/remove',
				
				data: JSON.stringify({
					"id": idDoc
				}),
				error: function(e) {
					FLUIGC.toast({
						title: '',
						message: "Falha ao remover o arquivo",
						type: 'danger'
					});
					
				},
				
				success: function(data) {
					FLUIGC.toast({
						title: '',
						message: "Contrato removido",
						type: 'info'
					});
					
					campoJson = nomeArquivo.indexOf('Contrato') >= 0 ? $("#hdnJsonRevisao") : campoJson;
					campoJson = nomeArquivo.indexOf('Anexo') >= 0 ? $("#hdnJsonRevisaoAnexo") : campoJson;
					
					var json = JSON.parse($(campoJson).val());
					
					var obj = [];
					$.each(json, function(index, value){
						if(json[index].idDoc != idDoc)
						{
							obj.push(json[index]);
						}  
					});
					$(campoJson).val(JSON.stringify(obj));
					$(divArqv).remove();
					
				},
			});
		}
	});
}

function criarPastaECM(){
	var folderId;
	$.ajax({
		async : false,
		type : "POST",
		contentType: "application/json",
		url : '/api/public/ecm/document/createFolder',
		
		data: JSON.stringify({
			"description": "tmp",
			"parentId": codPastaContrato,
		}),
		
		success: function(data) {
			folderId = data.content.id;
			$("#contractFolderId").val(folderId);    
		},
	}); 
	return folderId;
}

function alterarPastaECM(){
	var numSol = Number($("#numSolicitacao").val()) == 0 ? Number($("#numSolicitacao").text()) : Number($("#numSolicitacao").val());
	var folderId = $("#contractFolderId").val();
	console.log("Numero ECM " + numSol);
	
	$.ajax({
		async : false,
		type : "POST",
		contentType: "application/json",
		url : '/api/public/ecm/document/updateDescription',
		
		data: JSON.stringify({
			"id": folderId,
			"description": numSol
		}),
		
		success: function(data) {    
		},
	});
}

function gerarLinkArquivo(idDoc){
    var link;
    var url = '/api/public/2.0/documents/getDownloadURL/'+idDoc;
    var obj = {};
    var params = JSON.stringify(obj);
	
    $.ajax(url,{
		async : false,
		method:'GET',
		dataType:'json',
		contentType:'application/json',
		data: params,
		success: function(data) {
			link = data.content;    
			},error: function(e) {
            console.log(e);  
		},
	});
	
    return link;
}

$(".btnDownloadCont").on("load",function(){
	var idDoc = $(this).closest("td").find("input[id^='hdnUrlContrato']").val();
	var url = gerarLinkArquivo(idDoc);
	$(this).val(url);
});

function horaAtualFormatada() {
    var data = new Date();
    var hora = addZero(data.getHours());
    var minuto = addZero(data.getMinutes());
    var segundo = addZero(data.getSeconds());
	
    return hora + ':' + minuto + ':' + segundo;
}

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
	}
    return i;
}

function dataHora() {
    return dataAtualFormatada() + ' ' + horaAtualFormatada();
}

var semPonto =  function(valor){
	while(valor.indexOf('.') >= 0){
		valor = valor.replace('.','');
	}
	return valor;
}

var indexFromId= function(id){
	return semCaractere(id.substring(id.length - 3),'_');
}

var semCaractere =  function(valor, c){
	while(valor.indexOf(c) >= 0){
		valor = valor.replace(c,'');
	}
	return valor;
}

function validaAnexosConsol(){
	var docsContrato = $("#hdnJsonRevisao").val() ? JSON.parse($("#hdnJsonRevisao").val()) : "";
	var docsAnexo = $("#hdnJsonRevisaoAnexo").val() ? JSON.parse($("#hdnJsonRevisaoAnexo").val()) : "" ;
	
	var checkContrato = false;
	if(docsContrato){
		for(var cont = 0; cont < docsContrato.length; cont++){
			checkContrato = docsContrato[cont].idAtividade == 30 ? true : false;
		}
		} else {
		$("#tbTrContrato>tbody").children("tr").each(function(index){
			var idRow = $(this).find(".trDescContrato").attr("id");
			if(isFinite(indexFromId(idRow))){
				var nomeDoc = $(this).find("input[id^='trDescContrato___']").val();
				if(nomeDoc.indexOf("consolidado") > 0){
					checkContrato = true;
				}
			}
		}); 
	}
	
	if(docsAnexo){
		var checkAnexo = false;
		for(var cont = 0; cont < docsAnexo.length; cont++){
			checkAnexo = docsAnexo[cont].idAtividade == 30 ? true : false;
		}
		} else {
		$("#tbTrAnexos>tbody").children("tr").each(function(index){
			var idRow = $(this).find(".trDescAnexo").attr("id");
			if(isFinite(indexFromId(idRow))){
				var nomeDoc = $(this).find("input[id^='trDescAnexo___']").val();
				if(nomeDoc.indexOf("consolidado")  > 0){
					checkAnexo = true;
				}
			}
		});
	}
	
	if(!checkContrato || !checkAnexo){
		throw "Não foram anexados os contratos consolidados, é obrigatorio o anexo dos contratos pois serão os documento a serem exibidos ao usuário.";
	}
}

function validaAnexosVigente(){
	var docsContrato = $("#hdnJsonRevisao").val() ? JSON.parse($("#hdnJsonRevisao").val()) : "";
	var docsAnexo = $("#hdnJsonRevisaoAnexo").val() ? JSON.parse($("#hdnJsonRevisaoAnexo").val()) : "" ;
	
	var checkContrato = false;
	if(docsContrato){
		for(var cont = 0; cont < docsContrato.length; cont++){
			checkContrato = docsContrato[cont].idAtividade == 34 ? true : false;
		}
	}
	
	if(docsAnexo){
		var checkAnexo = false;
		for(var cont = 0; cont < docsAnexo.length; cont++){
			checkAnexo = docsAnexo[cont].idAtividade == 34 ? true : false;
		}
	}
	
	if(!checkContrato || !checkAnexo){
		throw "Não foram anexados os contratos vigentes, é obrigatorio o anexo dos contratos pois serão os documento a serem exibidos ao usuário.";
	}
}

function carregaCamposSelect(nomeDoCampo, idValue, datasetProcura, descricaoNoDataset,  selectAtivo) {
	console.log("Procurando por: " + datasetProcura);
	var consts = new Array();
	var cons1 = DatasetFactory.createConstraint('status', 'Ativo', 'Ativo', ConstraintType.MUST);
	if (selectAtivo) {
		// var cons2 = DatasetFactory.createConstraint(idValue, selectAtivo, selectAtivo, ConstraintType.MUST);
		// consts.push(cons2);
	}
	consts.push(cons1);
	console.log(consts);
	var dataset = DatasetFactory.getDataset(datasetProcura, null, consts, new Array(idValue));
	var row = dataset.values;
	console.log(row);
	for (var cont = 0;cont < row.length; cont++) {
		if(selectAtivo != null && selectAtivo == row[cont][idValue]){
			$("#" + nomeDoCampo).append("<option value='"+row[cont][idValue]+"' selected>"+row[cont][descricaoNoDataset]+"</option>");
			} else {
			$("#" + nomeDoCampo).append("<option value='"+row[cont][idValue]+"'>"+row[cont][descricaoNoDataset]+"</option>");
		}
	};
}

function alteraTexto () {
	return null;
}