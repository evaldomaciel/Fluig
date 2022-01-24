function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetFactory.newDataset();
    var groupId = String();

    try {
        if (constraints == null || constraints[0].fieldName == "sqlLimit") {
            dataset.addColumn("groupId");
            dataset.addRow(new Array("Informe um grupo"));
        }

        if (constraints[0].fieldName != "sqlLimit") {
            dataset.addColumn("groupId");
            dataset.addColumn("colleagueId");
            dataset.addColumn("login");
            dataset.addColumn("colleagueName");
            dataset.addColumn("participante");

            for (var i = 0; i < constraints.length; i++) {
                if (constraints[i].fieldName == "groupId") {
                    groupId = constraints[i].initialValue;
                }
            }
            var colleague = DatasetFactory.getDataset('colleague', null, null, null);
            var constraintColleagueGroup1 = DatasetFactory.createConstraint('colleagueGroupPK.groupId', String(groupId), String(groupId), ConstraintType.MUST);

            for (var index = 0; index < colleague.rowsCount; index++) {

                var usuario = colleague.getValue(index, "colleaguePK.colleagueId");
                var login = colleague.getValue(index, "login");
                var colleagueName = colleague.getValue(index, "colleagueName");

                var constraintColleagueGroup2 = DatasetFactory.createConstraint('colleagueGroupPK.colleagueId', usuario, usuario, ConstraintType.MUST);
                var datasetColleagueGroup = DatasetFactory.getDataset('colleagueGroup', null, new Array(constraintColleagueGroup1, constraintColleagueGroup2), null);

                if (datasetColleagueGroup.rowsCount > 0) {
                    dataset.addRow(new Array(groupId, usuario, login, colleagueName, "S"));
                }
                else {
                    dataset.addRow(new Array(groupId, usuario, login, colleagueName, "N"));
                }

            }
        }
    } catch (error) {
        dataset.addColumn("ERRO");
        dataset.addColumn("LINHA");
        dataset.addRow(new Array(String(error, error.lineNumber)));
    }
    return dataset;
}