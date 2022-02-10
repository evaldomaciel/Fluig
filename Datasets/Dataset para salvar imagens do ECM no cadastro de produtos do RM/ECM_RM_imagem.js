/*
|-----------------------------------------------|
| Realização de teste no backend do Fluig       |
|-----------------------------------------------|
| Desenvolvimento: Evaldo Maciel	            |
| Nickname:        @evaldomaciel                |
| Data:            10/02/2022                   |
|-----------------------------------------------|____________________________________
|~~ SE TIVER ACESSO A ESTE FONTE FAÇA UM BOM USO E COMPARTILHE COM SUA EQUIPE ;D ~~ |
|-----------------------------------------------------------------------------------|
*/

function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("IDIMAGEMFLUIG");
	dataset.addColumn("CODCOLIGADA");
	dataset.addColumn("IDPRD");
	dataset.addColumn("RETORNO_RM");

	var id_coligada;
	var id_produto;
	var id_imagem;

	var usuarioFluig = "evaldo"; // String(getValue("WKUser"));
	var senhaFluig = "c88271204*";
	var companyId = String(getValue("WKCompany"));

	var usuarioRM = "mestre";
	var senhaRM = "totvs";

	if (constraints != null && constraints.length && constraints[0].fieldName != "sqlLimit") { //se tiver constraint filtra
		for (var a = 0; a < constraints.length; a++) {
			id_coligada = constraints[a].fieldName.toUpperCase() == "CODCOLIGADA" ? constraints[a].initialValue : id_coligada;
			id_produto = constraints[a].fieldName.toUpperCase() == "IDPRD" ? constraints[a].initialValue : id_produto;
			id_imagem = constraints[a].fieldName.toUpperCase() == "IDIMAGEMFLUIG" ? constraints[a].initialValue : id_imagem;
		}
		if (id_coligada == undefined || id_produto == undefined || id_imagem == undefined) {
			dataset.addRow(new Array(id_coligada, id_produto, id_imagem, "ERRO"));
			return dataset;
		}
	} else { // se não tiver todas as constraints 
		dataset.addRow(new Array("ERRO", "ERRO", "ERRO", "ERRO"));
		return dataset;
	}

	try {
		var docAtual = obtemDadosDocAtual(usuarioFluig, senhaFluig, companyId, id_imagem, usuarioFluig);
		docAtual = docAtual.getItem();
		var imagemDoECM = obtemImagemDoECM(usuarioFluig, senhaFluig, companyId, id_imagem, usuarioFluig, docAtual.get(0).getVersion(), docAtual.get(0).getDocumentDescription());
		var imagemString = java.util.Base64.getEncoder().encodeToString(imagemDoECM);
		var atualizarImagemNoRM = publicaImagem(id_coligada, id_produto, usuarioRM, senhaRM, imagemString);
		atualizarImagemNoRM += " - Imagem " + docAtual.get(0).getDocumentDescription() + " foi atribuída ao produto "
		dataset.addRow([id_imagem, id_coligada, id_produto, atualizarImagemNoRM]);
	} catch (e) {
		dataset = DatasetBuilder.newDataset();
		dataset.addColumn("linha");
		dataset.addColumn("erro");
		dataset.addRow([e.lineNumber, e.message]);
	}
	return dataset;
}

function obtemDadosDocAtual(usuarioFluig, senhaFluig, companyId, nrDocumentId, colleagueId) {
	try {
		var serviceHelper = ServiceManager.getService("ECMDocumentService");
		var serviceLocator = serviceHelper.instantiate("com.totvs.technology.ecm.dm.ws.ECMDocumentServiceService");
		var service = serviceLocator.getDocumentServicePort();
		var response = service.getActiveDocument(usuarioFluig, senhaFluig, companyId, nrDocumentId, colleagueId);
		return response;
	} catch (error) {
		throw error;
	}
}

function obtemImagemDoECM(usuarioFluig, senhaFluig, companyId, nrDocumentId, colleagueId, documentVersao, nomeArquivo) {
	var documentProvider = ServiceManager.getServiceInstance("ECMDocumentService");
	var serviceLocator = documentProvider.instantiate("com.totvs.technology.ecm.dm.ws.ECMDocumentServiceService");
	var documentService = serviceLocator.getDocumentServicePort();
	var result = documentService.getDocumentContent(usuarioFluig, senhaFluig, companyId, nrDocumentId, colleagueId, documentVersao, nomeArquivo);
	return result;
}

function publicaImagem(idProduto, CODCOLIGADA, rm_usuario, rm_senha, imagem) {
	try {
		var carregouDocDoServidor = false;
		var NOME_DATASERVER = "EstPrdDataBR";
		var primaryKey = String(CODCOLIGADA) + ";" + String(idProduto);
		var context = "CODSISTEMA=G;CODCOLIGADA=" + CODCOLIGADA + ";CODUSUARIO=" + rm_usuario
		var text = "";

		text = new String(dcReadRecord(NOME_DATASERVER, context, rm_usuario, rm_senha, primaryKey));

		if (ChekExist(text)) {
			carregouDocDoServidor = true;
		}

		if (!ChekExist(text)) {
			return "Produto não cadastrado no RM";
		}

		if (carregouDocDoServidor == true) {
			if (!text.indexOf("<IMAGEM>") >= 0) var XMLParaIntegrar = text.replace("<TPRODUTO>", "<TPRODUTO><IMAGEM>" + imagem + "</IMAGEM>");
			if (text.indexOf("<IMAGEM>") >= 0) var XMLParaIntegrar = replaceValue(text, "IMAGEM", imagem);
			var result = new String(dcSaveRecord(NOME_DATASERVER, context, rm_usuario, rm_senha, XMLParaIntegrar));
			return String(result);
		}
	}
	catch (e) {
		if (e == null) e = "Erro desconhecido!";
		var mensagemErro = "Ocorreu um erro ao salvar dados no RM: " + String(e);
		throw mensagemErro;
	}
}

/**
 * @param {String} rm_webservice nome do serviço cadastro no painel de controle;
 */

var rm_webservice = "wsDataServer";

/**'
* A API de autenticação da Totvs baseia no "Basic access authentication" do HTTP.
 * Código Java para autenticação 
 * Programa responsável por integrar com os Webservices do RM 
 *  Exemplo dev valores para os parâmetros 
 *	@param string Usuario Usuário do RM;
 *	@param string Senha Senha do RM;
*/

function getWebService(Usuario, Senha) {

	var Nome_Servico = rm_webservice;
	var Caminho_Servico = "com.totvs.WsDataServer";

	var dataServerService = ServiceManager.getServiceInstance(Nome_Servico);
	if (dataServerService == null) {
		throw "Servico nao encontrado: " + Nome_Servico;
	}

	var serviceLocator = dataServerService.instantiate(Caminho_Servico);
	if (serviceLocator == null) {
		throw "Instancia do servico nao encontrada: " + Nome_Servico + " - " + Caminho_Servico;
	}

	var service = serviceLocator.getRMIwsDataServer();
	if (service == null) {
		throw "Instancia do dataserver do invalida: " + Nome_Servico + " - " + Caminho_Servico;
	}

	var serviceHelper = dataServerService.getBean();
	if (serviceHelper == null) {
		throw "Instancia do service helper invalida: " + Nome_Servico + " - " + Caminho_Servico;
	}

	var authService = serviceHelper.getBasicAuthenticatedClient(service, "com.totvs.IwsDataServer", Usuario, Senha);
	if (serviceHelper == null) {
		throw "Instancia do auth service invalida: " + Nome_Servico + " - " + Caminho_Servico;
	}

	return authService;
}

function dcReadView(dataservername, context, usuario, senha, filtro) {
	// carrega o webservice...
	var authService = getWebService(usuario, senha);

	// lê os dados da visão respeitando o filtro passado
	var viewData = new String(authService.readView(dataservername, filtro, context));

	return viewData;
}

function dcReadRecord(dataservername, context, usuario, senha, primaryKey) {
	// carrega o webservice...
	var authService = getWebService(usuario, senha);

	// lê os dados do registro respeitando a pk passada
	try {
		var recordData = new String(authService.readRecord(dataservername, primaryKey, context));
	}
	catch (e) {
		var recordData = new String(authService.getSchema(dataservername, context));
	}

	return recordData;
}

function dcSaveRecord(dataservername, context, usuario, senha, xml) {
	// carrega o webservice...
	var authService = getWebService(usuario, senha);

	// salva o registro de acordo com o xml passado
	var pk = new String(authService.saveRecord(dataservername, xml, context));

	return pk;
}

//Transforma o conceito de constraints do Fluig para o Filtro do TBC.
function parseConstraints(constraints, filterRequired) {
	// inicializa o resultado...
	var result = [];
	result.context = "";

	// inicializa o filtro...
	var filter = "";

	// varre as contraints...
	for (con in constraints) {
		var fieldName = con.getFieldName().toUpperCase();
		if (fieldName == "RMSCONTEXT") {
			result.context = con.getInitialValue();
			continue;
		}

		filter += "(";

		if (fieldName == "RMSFILTER") {
			filter += con.getInitialValue();
		}
		else {
			if (con.getInitialValue() == con.getFinalValue() || isEmpty(con.getFinalValue())) {
				filter += con.getFieldName();
				var isLike = false;
				switch (con.getConstraintType()) {
					case ConstraintType.MUST:
						filter += " = ";
						break;
					case ConstraintType.MUST_NOT:
						filter += " = ";
						break;
					case ConstraintType.SHOULD:
						filter += " LIKE ";
						isLike = true;
						break;
					case ConstraintType.SHOULD_NOT:
						filter += " NOT LIKE ";
						isLike = true;
						break;
				}
				filter += getFormattedValue(con.getInitialValue(), isLike);
			}
			else {
				filter += con.getFieldName();
				filter += " BETWEEN ";
				filter += getFormattedValue(con.getInitialValue(), false);
				filter += " AND ";
				filter += getFormattedValue(con.getFinalValue(), false);
			}
		}

		filter += ") AND ";
	}

	if (filter.length == 0) {
		if (filterRequired) {
			filter = "1=1";
		}
		else {
			filter = "1=1";
		}
	}
	else
		filter = filter.substring(0, filter.length - 5);

	// guarda o filtro...
	result.filter = filter;

	// retorna o resultado...
	return result;
}

function getFormattedValue(value, isLike) {
	if (isLike) {
		return "'%" + value + "%'";
	}
	else {
		return "'" + value + "'";
	}
}

function getXMLFromString(xmlString) {
	var factory = javax.xml.parsers.DocumentBuilderFactory.newInstance();
	var parser = factory.newDocumentBuilder();
	var is = new org.xml.sax.InputSource();
	is.setCharacterStream(new java.io.StringReader(xmlString));
	return parser.parse(is);
}

function checkIsPK(result, qtd) {
	var lines = result.split('\r');

	if (lines.length == 1) {
		var pk = result.split(';');
		if (pk.length == qtd)
			return;
	}

	throw result;
}

function ChekExist(result) {
	var lines = result.split('\r');
	if (lines.length > 1)
		return true
	else
		return false;
}

function trataStringXML(params) {
	var regexLinhaR = new RegExp("\r", "g");
	var regexLinha = new RegExp("\n", "g");
	var regexTab = new RegExp("\t", "g");
	var regexDspace = new RegExp("  ", "g");
	var texto = params.replace(regexLinha, " ");
	texto = texto.replace(regexLinhaR, " ");
	texto = texto.replace(regexTab, " ");
	texto = texto.replace(regexDspace, " ");
	return texto = texto.trim();
}

function removeValue(text, columnName) {
	var regex = new RegExp("<" + columnName + ">(.*?)<\\/" + columnName + ">", "g");
	var textoSaida = text.replace(regex, "");
	return textoSaida;
}

function replaceValue(text, columnName, newValue) {
	if ((newValue != null) && (String(newValue).trim() != "")) {
		var regex = new RegExp("<" + columnName + ">(.*?)<\\/" + columnName + ">", "g");
		var replaceText = "<" + columnName + ">" + newValue + "</" + columnName + ">";
		return text.replace(regex, replaceText);
	}
	else
		return text;
}

function isEmpty(str) {
	return (!str || 0 === str.length);
}

/**
 * Faz consulta simples em um dataset com retorno único
 * @param {String} dataset id do Dataset a ser consultado
 * @param {String} field campo do dataset a ser consultado e retornado
 * @param {String} paramento parametro de consulta
 * @param {String} fieldRetorno o campo que será retornado
 * @returns retonar um item único, o primeiro do dataset
 */
function getParamentro(dataset, field, paramento, fieldRetorno) {
	try {
		var datasetDs_parametros = DatasetFactory.getDataset(dataset, null, new Array(
			DatasetFactory.createConstraint(field, paramento, paramento, ConstraintType.MUST)
		), null);
		return String(datasetDs_parametros.getValue(0, fieldRetorno));
	} catch (error) {
		throw error;
	}
}

function getData() {
	var data = new Date();
	var dia = data.getDate();
	var mes = data.getMonth() + 1;
	var ano = data.getFullYear();
	dia = (dia <= 9 ? "0" + dia : dia);
	mes = (mes <= 9 ? "0" + mes : mes);
	var novaData = ano + "-" + mes + "-" + dia + "T00: 00:00";
	return novaData;
}