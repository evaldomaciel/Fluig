function createDataset(fields, constraints, sortFields) {
	// comercialInstancias
    // Criação das colunas de retorno deste dataset
    var datasetRetorno = DatasetBuilder.newDataset();
//    datasetRetorno.addColumn("id");
//    datasetRetorno.addColumn("ordemDesc");
//    datasetRetorno.addColumn("processTaskPK.id");
    datasetRetorno.addColumn("processId");
    datasetRetorno.addColumn("processInstanceId");
    datasetRetorno.addColumn("colleagueId");
    datasetRetorno.addColumn("choosedColleagueId");
    datasetRetorno.addColumn("choosedSequence");

    // Buscando comercialProcessos (A ideia do primeiro dataset é ganhar em desempenho)
    var dataset1 = DatasetFactory.getDataset("comercialProcessos", null, null, null);

    // A partir do dataset 1 busca todos relacionados no dataset 2
    for (var i = 0; i < dataset1.rowsCount; i++) {            
        var processId           = dataset1.getValue(i, "processId");
        var valorInicialFinal   = dataset1.getValue(i, "processInstanceId");
        var colleagueId         = dataset1.getValue(i, "colleagueId");

        var campos              = new Array ("processTaskPK.processInstanceId", "choosedSequence", "choosedColleagueId");
        var c1                  = DatasetFactory.createConstraint("choosedSequence", 5, 5, ConstraintType.MUST)
        var c2                  = DatasetFactory.createConstraint("processTaskPK.processInstanceId", valorInicialFinal, valorInicialFinal, ConstraintType.MUST)
        var constraints2        = new Array(c1, c2); 
        //var constraints2        = new Array(c2); 
        var dataset2            = DatasetFactory.getDataset("processTask", campos, constraints2, null)     

        var decremento = dataset1.rowsCount - i; 

        for (var j = 0; j < dataset2.rowsCount; j++) {
            var processInstanceId           = dataset2.getValue(j, "processTaskPK.processInstanceId"); 
            var choosedSequence             = dataset2.getValue(j, "choosedSequence"); 
            var choosedColleagueId          = dataset2.getValue(j, "choosedColleagueId"); 

//        	datasetRetorno.addRow(new Array(i, decremento, j, processId, processInstanceId, colleagueId, choosedColleagueId, choosedSequence));
        	datasetRetorno.addRow(new Array(processId, processInstanceId, colleagueId, choosedColleagueId, choosedSequence));
        }
    }

    // Retorna o dataset
    return datasetRetorno;    
}