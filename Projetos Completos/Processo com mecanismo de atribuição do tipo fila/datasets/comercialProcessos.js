function createDataset(fields, constraints, sortFields) {

    /*
    Filtra no dataset *workflowProcess* o processId *comercial_fila*
    A ídeia aqui é conseguir desempenho, pois ao tentar relacionar diretamente os datasets workflowProcess
    e processTask a consulta de instâncias excidia o tempo limite de execução. 
    */

    var datasetRetorno = DatasetBuilder.newDataset();
    datasetRetorno.addColumn("id");
    datasetRetorno.addColumn("processId");
    datasetRetorno.addColumn("processInstanceId");
    datasetRetorno.addColumn("colleagueId");
    datasetRetorno.addColumn("choosedColleagueId");

    var filtroProcesso = DatasetFactory.createConstraint("processId", "comercial_fila", "comercial_fila", ConstraintType.MUST);
    var filtro = new Array(filtroProcesso);
    var dataset1 = DatasetFactory.getDataset("workflowProcess", null, filtro, null);

    for (var i = 0; i < dataset1.rowsCount; i++) {
        var processInstanceIdFiltro = dataset1.getValue(i, "workflowProcessPK.processInstanceId");
        var returnFields = new Array("processTaskPK.processInstanceId", "choosedColleagueId", "processTaskPK.colleagueId");
        var c1 = DatasetFactory.createConstraint("processTaskPK.processInstanceId", processInstanceIdFiltro, processInstanceIdFiltro, ConstraintType.MUST);
        var colConstraints = new Array(c1);
        var dataset2 = DatasetFactory.getDataset("processTask", returnFields, colConstraints, null);
        var processId = dataset1.getValue(i, "processId");
        var choosedColleagueId = dataset2.getValue(0, "choosedColleagueId");
        var colleagueId = dataset2.getValue(0, "processTaskPK.colleagueId");
        var processInstanceId = dataset2.getValue(0, "processTaskPK.processInstanceId");
        datasetRetorno.addRow(new Array(i, processId, processInstanceId, colleagueId, choosedColleagueId));
    }
    return datasetRetorno;
}