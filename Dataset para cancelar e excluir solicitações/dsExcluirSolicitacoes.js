function defineStructure() {
	addColumn("processInstanceId");
	addColumn("processId");
	addColumn("cancelado");
	addColumn("excluido");
	addColumn("doc_excluido");
	setKey(["processInstanceId"]);
	addIndex(["processInstanceId"]);
}

function onSync(lastSyncDate) {
	/*function createDataset(fields, constraints, sortFields) {*/
	var dataset = DatasetBuilder.newDataset();
	/*	dataset.addColumn("processInstanceId");
		dataset.addColumn("processId");
		dataset.addColumn("retorno");*/
	try {
		var datasetWorkflowProcess = DatasetFactory.getDataset('workflowProcess', [
			"workflowProcessPK.processInstanceId",
			"processId",
			"cardDocumentId",
			"status"
		], [
			DatasetFactory.createConstraint('sqlLimit', '1000', '1000', ConstraintType.MUST)
			/*			DatasetFactory.createConstraint('status', '1', '2', ConstraintType.MUST),
						DatasetFactory.createConstraint('cardDocumentId', '', '', ConstraintType.MUST_NOT),*/
			//DatasetFactory.createConstraint('requesterId', 'admin', 'admin', ConstraintType.MUST)
		], ["workflowProcessPK.processInstanceId;asc"]);

		for (var index = 0; index < datasetWorkflowProcess.rowsCount; index++) {
			var processInstanceId = datasetWorkflowProcess.getValue(index, "workflowProcessPK.processInstanceId");
			var processId = datasetWorkflowProcess.getValue(index, "processId");
			var status = String(datasetWorkflowProcess.getValue(index, "status"));
			var cardDocumentId = datasetWorkflowProcess.getValue(index, "cardDocumentId");
			var total = datasetWorkflowProcess.rowsCount;
			var cancelado = null;
			var excluiuDocumento = null;
			var excluirLixeira = null;
			if (status != "1" && status != "2") {
				cancelado = cancelar(1, "admin", "admin", parseInt(processInstanceId));
			}
			var excluiuSolicitacao = excluirSolicitacao(parseInt(processInstanceId).toFixed(0));
			if (cardDocumentId != undefined && cardDocumentId != null && cardDocumentId != "") {
				excluiuDocumento = excluirDocumento(String(1), "admin", "admin", "delete", cardDocumentId);
				excluiuDocumento = String(excluiuDocumento) + " - " + String(cardDocumentId);
			}

			log.info(String(index) + ' de ' + total
				+ "\nCancelando: " + processId + ' - ' + String(processInstanceId)
				+ "\ncancelado: " + cancelado
				+ "\nexcluiuSolicitacao: " + excluiuSolicitacao
				+ "\ncardDocumentId: " + cardDocumentId
				+ "\nexcluiuDocumento: " + excluiuDocumento
				+ "\nexcluirLixeira: " + excluirLixeira
				+ "\nstatus: " + status);

			dataset.addOrUpdateRow([String(processInstanceId), processId, cancelado, excluiuSolicitacao, excluiuDocumento]);
		}
	} catch (e) {
		dataset = DatasetBuilder.newDataset();
		dataset.addOrUpdateRow([e.message, e.lineNumber]);
		//dataset.addRow([e.message, e.lineNumber]);
	}
	logout();
	return dataset;
}

function cancelar(company, user, password, processInstanceId) {

	// Inicia o serviço
	var wep = ServiceManager.getServiceInstance("ECMWorkflowEngineService");
	var wel = wep.instantiate("com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService");
	var wes = wel.getWorkflowEngineServicePort();

	try {
		resultado = wes.cancelInstance(user, password, parseInt(company), parseInt(processInstanceId), user, "Cancelado via dataset");
		return resultado;
	}
	catch (e) {
		log.error("ERRO: " + e.message + " - Linha: " + e.lineNumber);
		return "ERRO: " + e.message + " - Linha: " + e.lineNumber;
	}
}

function excluirSolicitacao(nroSolicitacao) {
	//	https://lab.fluig.com/ecm/api/rest/ecm/processdelete/getInstancesToDelete
	//	http://10.82.100.75:8080/ecm/api/rest/ecm/processdelete/deleteInstances
	try {

		var clientService = fluigAPI.getAuthorizeClientService();
		var data_excluirSolicitacao = {
			companyId: "1",
			serviceCode: "fluig",
			endpoint: "http://10.82.100.75:8080/ecm/api/rest/ecm/processdelete/deleteInstances",
			method: "POST",
			// Conteúdo do JSON que será enviado no POST
			params: { "selectedRows": [String(nroSolicitacao)] },
			// Aqui você pode incluir algum Header se necessário
			options: {
				encoding: "UTF-8",
				mediaType: "application/json",
				useSSL: false
			},
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			}
		}

		log.dir("data_excluirSolicitacao");
		log.dir(data_excluirSolicitacao);
		var chamadaJson = JSON.stringify(data_excluirSolicitacao);
		log.dir(chamadaJson);
		var vo = clientService.invoke(chamadaJson);
		log.dir("Linha 114");
		log.dir(vo);
		var objeto2 = JSON.parse(vo.getResult())

		return objeto2.content;
	}
	catch (e) {
		log.error("ERRO: " + e.message + " - Linha: " + e.lineNumber);
		return "ERRO: " + e.message + " - Linha: " + e.lineNumber;
	}
}

function excluirDocumentoLixeira(nroDocumento) {
	//	https://lab.fluig.com/ecm/api/rest/ecm/processdelete/getInstancesToDelete
	try {
		var params = { "docsToDelete": [parseInt(nroDocumento).toFixed(0)], "colleagueIds": [] };

		var clientService = fluigAPI.getAuthorizeClientService();
		var data_ExcluirDoc = {
			companyId: "1",
			serviceCode: 'fluig',
			endpoint: '/ecm/api/rest/ecm/recycleBin/removeDocument/',
			method: 'POST',
			// Conteúdo do JSON que será enviado no POST
			params: params,
			// Aqui você pode incluir algum Header se necessário
			options: {
				encoding: 'UTF-8',
				mediaType: 'application/json',
				useSSL: false
			},
			headers: {
				"Content-Type": 'application/json;charset=UTF-8'
			}
		}

		var vo = clientService.invoke(JSON.stringify(data_ExcluirDoc));
		log.dir("Linha 131");
		log.dir(vo);
		var objeto2 = JSON.parse(vo.getResult())

		return objeto2.content;
	}
	catch (e) {
		log.error("ERRO: " + e.message + " - Linha: " + e.lineNumber);
		return "ERRO: " + e.message + " - Linha: " + e.lineNumber;
	}
}

function excluirDocumento(company, user, password, action, cardId) {
	try {
		var properties = {};
		var result = null;
		properties["disable.chunking"] = "true";
		properties["log.soap.messages"] = "true";

		/* Create */
		var serviceManager = ServiceManager.getService("ECMCardService");
		var serviceInstance = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.ECMCardServiceService");
		var service = serviceInstance.getCardServicePort();
		var customClient = serviceManager.getCustomClient(service, "com.totvs.technology.ecm.dm.ws.CardService", properties);

		if (action == "delete") {
			result = customClient.deleteCard(parseInt(company), String(user), String(password), parseInt(cardId));
		}
		if (result.getItem().get(0).getWebServiceMessage().equals("ok")) {
			return String(result.getItem().get(0).getWebServiceMessage());
		}
		else {
			log.error("Não foi: " + result.getItem().get(0).getWebServiceMessage());
			return "Não foi: " + result.getItem().get(0).getWebServiceMessage();
		}
	}
	catch (e) {
		log.error("ERRO: " + e.message + " - Linha: " + e.lineNumber);
		return "ERRO: " + e.message + " - Linha: " + e.lineNumber;
	}
}



function logout() {
	try {
		var params = {};

		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: String(1),
			serviceCode: 'fluig',
			//endpoint: '/portal/p/api/servlet/logout.do',
			//endpoint: '/api/public/wcm/logout',
			endpoint: '/api/public/wcm/theme ',
			method: 'GET',
			// Conteúdo do JSON que será enviado no POST
			params: params,
			// Aqui você pode incluir algum Header se necessário
			options: {
				encoding: 'UTF-8',
				mediaType: 'application/json',
				useSSL: false
			},
			headers: {
				"Content-Type": 'application/json;charset=UTF-8'
			}
		}

		var vo = clientService.invoke(JSON.stringify(data));
		//var objeto2 = JSON.parse(vo.getResult())
		log.info("Fazendo logout");
		return String("Fazendo logout");
	}
	catch (e) {
		log.error("ERRO: " + e.message + " - Linha: " + e.lineNumber);
		return "ERRO: " + e.message + " - Linha: " + e.lineNumber;
	}
}
