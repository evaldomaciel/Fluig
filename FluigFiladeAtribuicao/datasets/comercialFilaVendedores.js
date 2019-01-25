function createDataset(fields, constraints, sortFields) {
    /*
    Este dataset é cria a fila de atribuição com base em um papel. Caso aqui é o releId (papel) "comercialVendas". 
    */
    var dataset = DatasetBuilder.newDataset();
    
    dataset.addColumn("ordem");
    dataset.addColumn("colleagueId");
    dataset.addColumn("companyId");
    dataset.addColumn("roleId");

	var constraintWorkflowColleagueRole1 = DatasetFactory.createConstraint('sqlLimit', '100', '100', ConstraintType.MUST);
	var constraintWorkflowColleagueRole2 = DatasetFactory.createConstraint('workflowColleagueRolePK.roleId', 'comercialVendas', 'comercialVendas', ConstraintType.MUST);
	var colunasWorkflowColleagueRole = new Array('workflowColleagueRolePK.colleagueId', 'workflowColleagueRolePK.companyId', 'workflowColleagueRolePK.roleId');
	var datasetWorkflowColleagueRole = DatasetFactory.getDataset('workflowColleagueRole', colunasWorkflowColleagueRole, new Array(constraintWorkflowColleagueRole1, constraintWorkflowColleagueRole2), null);

    for (var i = 0; i < datasetWorkflowColleagueRole.rowsCount; i++) {
        
        colleagueId     = datasetWorkflowColleagueRole.getValue(i, 'workflowColleagueRolePK.colleagueId');
        companyId       = datasetWorkflowColleagueRole.getValue(i, 'workflowColleagueRolePK.companyId');
        roleId          = datasetWorkflowColleagueRole.getValue(i, 'workflowColleagueRolePK.roleId');

        dataset.addRow(new Array (i, colleagueId, companyId, roleId));
    }
    
    return dataset;
}