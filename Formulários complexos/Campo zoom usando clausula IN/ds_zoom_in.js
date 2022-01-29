function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	try {
		dataset.addColumn("colleagueName");

		var usuarios = [];
		var constraintsPesquisa = [];

		if (constraints != null) {
			if (constraints.length > 0) {
				for (var i = 0; i < constraints.length; i++) {
					if (constraints[i].fieldName == "colleagueName") {
						usuarios = String(constraints[i].initialValue).split("&");
						if (usuarios.length > 0 && typeof usuarios == "object"); {
							for (var index = 0; index < usuarios.length; index++) {
								var constraint = DatasetFactory.createConstraint('colleagueName', usuarios[index], usuarios[index], ConstraintType.SHOULD);
								constraint.setLikeSearch(true);
								constraintsPesquisa.push(constraint);
								//dataset.addRow([usuarios[index]]); // apenas para validação
							}
						}
					}
				}
			}
		} if (usuarios.length == 0) {
			dataset.addRow(["informe os usuários"]);
		}

		if (usuarios.length > 0) {
			var datasetColleague = DatasetFactory.getDataset('colleague', null, constraintsPesquisa, null);
			log.dir(constraintsPesquisa);
			if (datasetColleague.rowsCount > 0) {
				dataset = datasetColleague;
			}
		}

	} catch (e) {
		dataset = DatasetBuilder.newDataset();
		dataset.addColumn("mensagem");
		dataset.addColumn("linha");
		dataset.addRow([e.message, e.lineNumber]);
	}
	return dataset;
}