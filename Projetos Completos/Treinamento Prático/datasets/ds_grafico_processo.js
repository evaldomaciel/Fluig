function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetBuilder.newDataset();
    
    //Cria as colunas
    dataset.addColumn("value");
    dataset.addColumn("color");
    dataset.addColumn("highlight");
    dataset.addColumn("label");
    
    var datasetWorkflowProcess = DatasetFactory.getDataset('workflowProcess', ["status"], null, null);

    /**
     * 0 - aberto
     * 1 - cancelado
     * 2 - finalizado
     */
    
    var aberto = 0;
    var cancelado = 0;
    var finalizado = 0;
   
    for (var i = 0; i < datasetWorkflowProcess.rowsCount; i++) {
    	aberto = parseInt(datasetWorkflowProcess.getValue(i, "status")) == 0 ? aberto + 1:  aberto;
    	cancelado = parseInt(datasetWorkflowProcess.getValue(i, "status")) == 1 ? cancelado + 1:  cancelado;
    	finalizado = parseInt(datasetWorkflowProcess.getValue(i, "status")) == 2 ? finalizado + 1:  finalizado;
	}
    
    dataset.addRow([aberto, "green", "black", "Aberto"]);
    dataset.addRow([cancelado, "red", "black", "Cancelado"]);
    dataset.addRow([finalizado, "blue", "black", "Finalizado"]);
    
    return dataset;
 
}