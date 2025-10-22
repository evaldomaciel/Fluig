function createDataset(fields, constraints, sortFields) {


	var dataset = DatasetBuilder.newDataset();
	try {
		var pasta = "/app/fluig/appserver/domain/servers/";
		var diretorio = new java.io.File(pasta);
		var arquivos = diretorio.listFiles();
		var linhaDeComando2 = String(arquivos[0]);
		var pasta = new java.nio.file.Path.of(String(linhaDeComando2 + "/log/server.log"));
		var retorno4 = new java.nio.file.Files.writeString(pasta, "");
		dataset.addColumn("SOL")
		dataset.addColumn("RETORNO")

		var vamosCancelar = DatasetFactory.getDataset('workflowProcess', null, [
			DatasetFactory.createConstraint('status', '1', '1', ConstraintType.MUST),
			DatasetFactory.createConstraint('sqllimit', '1000', '1000', ConstraintType.MUST),
		], null)

		for (let index = 0; index < vamosCancelar.rowsCount; index++) {
			let element = vamosCancelar.getValue(index, 'workflowProcessPK.processInstanceId');
			let cancelad0 = eliminar(element)
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

function eliminar(params) {
	try {
		var clientService = fluigAPI.getAuthorizeClientService();

		var data = {
			companyId: String(getValue("WKCompany")),
			serviceCode: 'FluigAPI',
			endpoint: '/ecm/api/rest/ecm/processdelete/deleteInstances',
			method: 'POST',
			timeoutService: '120', // segundos
			params: { "selectedRows": [String(params)] },
			body: { "selectedRows": [String(params)] }
		}
		var vo = clientService.invoke(JSONUtil.toJSON(data));

		if (vo.getResult() == null || vo.getResult().isEmpty()) {
			return String(params + ": vazio");
		} else {
			return String(JSONUtil.toJSON(vo.getResult()));
		}
	} catch (error) {
		throw error;
	}
}