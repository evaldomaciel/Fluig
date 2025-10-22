function defineStructure() {
	addColumn("vl_num_solicitacao", DatasetFieldType.STRING)
	addColumn("cancelamento", DatasetFieldType.STRING)
	setKey(["vl_num_solicitacao"]);
	addIndex(["vl_num_solicitacao", "cancelamento"]);
}
function onSync(lastSyncDate) {
	return geraDataset(true);
}
function createDataset(fields, constraints, sortFields) {
	return geraDataset(false);
}
function geraDataset(sync) {
	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn("vl_num_solicitacao");
	newDataset.addColumn("cancelamento");
	try {
		var processos = obtemProcessos();
		for (var index = 0; index < processos.rowsCount; index++) {
			var vl_num_solicitacao = processos.getValue(index, 'workflowProcessPK.processInstanceId');
			var cancelamento = cancelarSol(vl_num_solicitacao);
			var row = [vl_num_solicitacao, cancelamento]
			if (sync) newDataset.addOrUpdateRow(row);
			else newDataset.addRow(row);
		}
	} catch (e) {
		newDataset = DatasetBuilder.newDataset();
		newDataset.addColumn('QUERY');
		newDataset.addColumn('ERROR');
		if (sync) newDataset.addOrUpdateRow([e.message, e.lineNumber]);
		else newDataset.addRow([e.message, e.lineNumber]);
	}
	return newDataset;
}
function obtemProcessos() {
	var colunasWorkflowProcess = new Array('workflowProcessPK.processInstanceId');
	var constraintWorkflowProcess1 = DatasetFactory.createConstraint('status', '0', '0', ConstraintType.MUST);
	var datasetWorkflowProcess = DatasetFactory.getDataset('workflowProcess', colunasWorkflowProcess, new Array(constraintWorkflowProcess1), null);
	if (datasetWorkflowProcess && datasetWorkflowProcess.rowsCount > 0) {
		return datasetWorkflowProcess;
	} else {
		return false;
	}
}
function cancelarSol(processInstanceId) {
	var retornoDataset = DatasetFactory.getDataset('dsCancelaSolicitacoes', null, new Array(DatasetFactory.createConstraint('processInstanceId', processInstanceId, processInstanceId, ConstraintType.MUST)), null);
	if (retornoDataset && retornoDataset.rowsCount > 0) return retornoDataset.getValue(0, 'response');
	else "Erro ao excluir a solicitação " + String(processInstanceId);
}