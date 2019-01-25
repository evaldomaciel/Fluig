function resolve(process, colleague) {
	
	/*	Tarefas deste mecanismo de atribuição: 
		1. Verificar se o usuário é vendeder, ser for atribuir ele mesmo a tarefa. 
		2. Senão for um vendendor,  vai para fila... 
		3. Verificar próximo collegueId da fila.    
	*/

	var isTransfer = getValue("WKIsTransfer");
	var userList = new java.util.ArrayList();
	
	var usuarioAbertura = hAPI.getCardValue("comFila_nome");
	var papel = "comercialVendas";
	
	var constraintWorkflowColleagueRole1 = DatasetFactory.createConstraint('sqlLimit', '100', '100', ConstraintType.MUST);
	var constraintWorkflowColleagueRole2 = DatasetFactory.createConstraint('workflowColleagueRolePK.roleId', papel, papel, ConstraintType.MUST);
	var constraintWorkflowColleagueRole3 = DatasetFactory.createConstraint('workflowColleagueRolePK.colleagueId', usuarioAbertura, usuarioAbertura, ConstraintType.MUST);
	var colunasWorkflowColleagueRole = new Array('workflowColleagueRolePK.colleagueId', 'workflowColleagueRolePK.companyId', 'workflowColleagueRolePK.roleId');
	var filaPapeis = DatasetFactory.getDataset('workflowColleagueRole', colunasWorkflowColleagueRole, new Array(constraintWorkflowColleagueRole1, constraintWorkflowColleagueRole2, constraintWorkflowColleagueRole3), null);
	
	// Se for o próprio vendendor a abrir a solcitação, a tarefa é atribuída automáticamente para ele. 
	if (filaPapeis.values.length > 0) {
		userList.add(usuarioAbertura);
	}
	
	// Senão for o vendedor, vai para a fila. 
	else if (filaPapeis.values.length == 0) {
		var constraintComercialFila1 = DatasetFactory.createConstraint('sqlLimit', '100', '100', ConstraintType.MUST);
		var datasetComercialFila = DatasetFactory.getDataset('comercialFila', null, new Array(constraintComercialFila1), null);
		
		var proximo = datasetComercialFila.getValue(0, "proximaAtribuicao");

		userList.add(proximo);	
	}
	else {
	userList.add("bruno");
	}
	
	return userList;
	
	}	