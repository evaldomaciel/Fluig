function createDataset(fields, constraints, sortFields) {
	/*
	Esse dataset é o rasponsável por definir de forma dinâmica quem sará o proximo responsável. 
	Ele busca no dataset "comercialInstancias" qual foi a última solicitição que teve uma atribuação automática
	e quem foi o resposável, por fim, retorna o collegueId do último e do próximo reponsável.  
 	*/
	var dataset = DatasetBuilder.newDataset();
		
	dataset.addColumn("ultimaAtribuicao");
	dataset.addColumn("proximaAtribuicao");
	dataset.addColumn("processInstanceId");

	var posicao				= DatasetBuilder.getDataset("comercialInstancias", null, null, null);  
	var ultimoItem			= (posicao.rowsCount - 1); 
	var ultimaAtribuicao	= posicao.getValue(ultimoItem, "choosedColleagueId"); 
	var processInstanceId	= posicao.getValue(ultimoItem, "processInstanceId"); 
	var fila				= DatasetBuilder.getDataset("comercialFilaVendedores", null, null, null)
	
	for (var i = 0; i < fila.rowsCount; i++) {

		var atualNaFila 		= fila.getValue(i, "colleagueId");
		var atualNaFilaOrdem	= fila.getValue(i, "ordem") 

		if (atualNaFila == ultimaAtribuicao) { 
				if (atualNaFilaOrdem == (fila.rowsCount - 1)) {
				var proximaAtribuicao = fila.getValue(0, "colleagueId")
				dataset.addRow(new Array(ultimaAtribuicao, proximaAtribuicao, processInstanceId)); 	
				} else {
				var proximaAtribuicao = fila.getValue(i + 1, "colleagueId")
				dataset.addRow(new Array(ultimaAtribuicao, proximaAtribuicao, processInstanceId)); 
			}
		}
	}
	return dataset;
}