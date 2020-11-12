function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetFactory.newDataset();
    var groupId = String();
    var listaDeUsuario = new Array() // new java.util.ArrayList();
    var usuariosString = String();

    if (constraints == null || constraints[0].fieldName == "sqlLimit") {
        dataset.addColumn("groupId");
        dataset.addRow(new Array("Informe um grupo"));
    }

    if (constraints[0].fieldName != "sqlLimit" && constraints.length > 0) {
        for (var i = 0; i < constraints.length; i++) {
            if (constraints[i].fieldName == "groupId") {
                groupId = String(constraints[i].initialValue);
            }
        }
    }

    try {
        var constraintDs_lista_grupo1 = DatasetFactory.createConstraint('groupId', groupId, groupId, ConstraintType.MUST);
        var datasetDs_lista_grupo = DatasetFactory.getDataset('ds_lista_grupo', null, new Array(constraintDs_lista_grupo1), null);

        for (var index = 0; index < datasetDs_lista_grupo.rowsCount; index++) {
            if (datasetDs_lista_grupo.getValue(index, "participante") == "N") {
                var usuario = datasetDs_lista_grupo.getValue(index, "login");
                listaDeUsuario.push(String(usuario));
            }
        }

        usuariosString = JSON.stringify(listaDeUsuario);

        var clientService = fluigAPI.getAuthorizeClientService();
        var dataSend = {
            companyId: String(getValue("WKCompany")),
            serviceCode: 'fluigAPI', // Precisa cadastrar previamente um serviço no Fluig que chame a API
            endpoint: '/api/public/2.0/groups/addUsers/' + groupId, //{groupCode}
            method: 'POST',
            strParams: usuariosString,
            headers: {
                "Content-Type": "application/json",
            }
        }
        var vo = clientService.invoke(JSON.stringify(dataSend));
        dataset.addColumn("groupId");
        dataset.addColumn("mensagem");
        if (vo.getHttpStatusResult() == 200) {
            if (vo.getResult() == null || vo.getResult().isEmpty()) {
                dataset.addRow(["vazio"]);
            } else {
                var json = JSON.parse(vo.getResult());
                if (json.content != "ERROR") {
                    dataset.addRow([usuariosString, json.message.detail]);
                }
            }
        } else {
            dataset.addRow([groupId, String(json.message.detail + " - " + vo.getHttpStatusResult())]);
        }

    } catch (error) {
        dataset.addColumn("ERRO");
        dataset.addColumn("LINHA");
        dataset.addRow(new Array(String(error, error.lineNumber)));
    }
    return dataset;
}