function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("id");
	dataset.addColumn("link");

	var initialDate = 0;
	var finalDate = 0;
	var finalLanco = 0;

	if (constraints != null) {
		for (var i = 0; i < constraints.length; i++) {
			if (constraints[i].fieldName == "documento") {
				initialDate = parseInt(constraints[i].initialValue);
				finalDate = parseInt(constraints[i].finalValue);
			}
		}
	} else {
		initialDate = 16;
		finalDate = 16;
	}

	finalLanco = parseInt(finalDate + 1);
	for (var index = initialDate; index < finalLanco; index++) {
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: getValue("WKCompany") + '',
			serviceCode: 'fluigAPI',
			endpoint: '/api/public/ecm/document/downloadURL/' + index,
			method: 'get',
		}
		var vo = clientService.invoke(JSON.stringify(data));

		if (vo.getHttpStatusResult() == 200) {
			if (vo.getResult() == null || vo.getResult().isEmpty()) {
				dataset.addRow(["vazio"]);
			} else {
				var json = JSON.parse(vo.getResult());
				if (json.content != "ERROR") {
					dataset.addRow([index, json.content]);
				}
			}
		}
	}
	return dataset;
}