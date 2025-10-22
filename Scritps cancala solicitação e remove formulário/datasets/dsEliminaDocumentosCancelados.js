function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	try {
		dataset.addColumn("SOL")
		dataset.addColumn("RETORNO")

		var vamosCancelar = DatasetFactory.getDataset('dsDocumentoDeProcessosExcluidos', null, null, null);
		log.dir("vamosCancelar")
		log.dir(vamosCancelar)
		for (var index = 0; index < vamosCancelar.rowsCount; index++) {
			var element = vamosCancelar.getValue(index, 'workflowProcessPK.processInstanceId');
			var cancelad0 = eliminar(element)
			dataset.addRow([element, cancelad0]);
		}
		return dataset;
	} catch (e) {
		dataset = DatasetBuilder.newDataset();
		dataset.addColumn("message")
		dataset.addColumn("lineNumber")
		dataset.addRow([e.message, e.lineNumber]);
		return dataset;
	}
}

function eliminar(docId) {
	try {
		var clientService = fluigAPI.getAuthorizeClientService();

		var deleteDocs = {
			"docsToDelete": [
				{
					"docId": docId,
					"isLink": false,
					"parentId": 186
				}
			],
			"metadataFormsToDelete": []
		}

		var data = {
			companyId: String(getValue("WKCompany")),
			serviceCode: 'FluigAPI',
			endpoint: '/ecm/api/rest/ecm/navigation/removeDoc/',
			method: 'DELETE',
			timeoutService: '120', // segundos
			params: deleteDocs,
			body: deleteDocs
		}
		log.dir("JSONUtil.toJSON(data)");
		log.dir(JSONUtil.toJSON(data));
		var vo = clientService.invoke(JSONUtil.toJSON(data));

		if (vo.getResult() == null || vo.getResult().isEmpty()) {
			return String(docId + ": vazio");
		} else {
			return String(JSONUtil.toJSON(vo.getResult()));
		}
	} catch (error) {
		throw error;
	}
}