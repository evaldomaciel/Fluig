function createDataset(fields, constraints, sortFields) {
    var novoDataset = DatasetBuilder.newDataset();
    novoDataset.addColumn("processId");

    var processId = "nocode";

    var constraintWorkflowProcess = new Array();

    if (constraints.length > 0) {
        for (var z = 0; z < constraints.length; z++) {
            if (constraints[z].fieldName == "processId") {
                processId = constraints[z].initialValue;
                constraintWorkflowProcess.push(DatasetFactory.createConstraint('processId', processId, processId, ConstraintType.MUST))
            }
            if (constraints[z].fieldName == "sqlLimit") {
                var sqlLimitf = constraints[z].finalValue;
                var sqlLimiti = constraints[z].initialValue;
                constraintWorkflowProcess.push(DatasetFactory.createConstraint('sqlLimit', sqlLimiti, sqlLimitf, ConstraintType.MUST))
            }
        }
    }

    try {
        var datasetWorkflowProcess = DatasetFactory.getDataset('workflowProcess', null, constraintWorkflowProcess, null);

        if (datasetWorkflowProcess.rowsCount) {
            novoDataset.addColumn("processInstanceId");
            novoDataset.addColumn("choosedSequence");
            novoDataset.addColumn("descricao");

            for (var index = 0; index < datasetWorkflowProcess.rowsCount; index++) {
                var processInstanceId = datasetWorkflowProcess.getValue(index, "workflowProcessPK.processInstanceId");
                var versao = datasetWorkflowProcess.getValue(index, "version");
                processId = datasetWorkflowProcess.getValue(index, "processId");
                var buscaInstancia = buscaInstanciaFim(processInstanceId);
                var tarefaFim = buscaTarefaVersao(processId, versao, buscaInstancia);

                novoDataset.addRow([
                    processId,
                    processInstanceId,
                    buscaInstancia,
                    tarefaFim
                ]);

            }
        } else {
            throw "Dataset sem retorno";
        }

    } catch (error) {
        novoDataset.addColumn("message");
        novoDataset.addColumn("lineNumber");
        novoDataset.addRow([
            processId,
            error.message,
            error.lineNumber
        ])
    }

    return novoDataset;
}

function buscaInstanciaFim(params) {
    var tarefa = constraintProcessTask1 = DatasetFactory.createConstraint('sqlLimit', '1', '1', ConstraintType.MUST);
    var constraintProcessTask2 = DatasetFactory.createConstraint('processTaskPK.processInstanceId', params, params, ConstraintType.MUST);
    var datasetProcessTask = DatasetFactory.getDataset('processTask', null, new Array(constraintProcessTask1, constraintProcessTask2), ['processTaskPK.movementSequence;desc']);
    return datasetProcessTask.getValue(0, "choosedSequence");
}

function buscaTarefaVersao(processo, versao, sequence) {
    var constraintProcessState1 = DatasetFactory.createConstraint('sqlLimit', '1', '1', ConstraintType.MUST);
    var constraintProcessState2 = DatasetFactory.createConstraint('processStatePK.processId', processo, processo, ConstraintType.MUST);
    var constraintProcessState3 = DatasetFactory.createConstraint('processStatePK.sequence', sequence, sequence, ConstraintType.MUST);
    var constraintProcessState4 = DatasetFactory.createConstraint('processStatePK.version', versao, versao, ConstraintType.MUST);
    var datasetProcessState = DatasetFactory.getDataset('processState', null, new Array(constraintProcessState1, constraintProcessState2, constraintProcessState3, constraintProcessState4), null);

    var stateName = String();

    if (datasetProcessState.rowsCount > 0) {
        stateName = datasetProcessState.getValue(0, "stateName")
    } else {
        stateName = "Não definido";
    }
    return stateName;
}