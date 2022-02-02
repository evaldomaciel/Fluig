/*
|-----------------------------------------------|
| Realização de teste no backend do Fluig       |
|-----------------------------------------------|
| Desenvolvimento: Evaldo Maciel	            |
| Nickname:        @evaldomaciel                |
| Empresa:         INVENTIVO DIGITAL            |
| Data:            21/01/2022                   |
|-----------------------------------------------|_______________________
|COMENTÁRIOS:                                                           |
|Realização de teste no backend do Fluig. O objetivo aqui é utilizar	|
|metódos cumuns entre datasets e eventos de processo para agiliar o 	|
|desenvolvimento                        					        	|
|-----------------------------------------------------------------------|___________
|~~ SE TIVER ACESSO A ESTE FONTE FAÇA UM BOM USO E COMPARTILHE COM SUA EQUIPE ;D ~~ |
|-----------------------------------------------------------------------------------|
*/

function createDataset(fields, constraints, sortFields) {
	/** Vamos limpar o log para que seja mais fácil a análise do retorno */
	var retorno = new java.nio.file.Path.of("F:\\fluig\\appserver\\domain\\servers\\fluig1\\log\\server.log");
	var retorno3 = new java.nio.file.Files.writeString(retorno, "");
	log.info(retorno3);

	var dataset = DatasetBuilder.newDataset();

	try {
		dataset.addColumn("ciclo_status");
		dataset.addColumn("idParticipante");
		dataset.addColumn("nome");
		dataset.addColumn("cpf");
		dataset.addColumn("status");

		// A função abaixo será substituída pela hAPI.getCardData(${NUMERO_DO_PROCESSO_CICLO})
		var lista = {
			"companyid": "2",
			"cardid": "206",
			"documentid": "663",
			"version": "3000",
			"tableid": "principal",
			"anonymization_date": "",
			"anonymization_user_id": "",
			"identificador": "",
			"usuario": "",
			"numAtiv": "5",
			"numSolicitacao": "253",
			"userName": "Evaldo Maciel",
			"id_operadornome": "evaldo",
			"id_responsavel": "",
			"dataAbertura": "",
			"infoAtendimentos": "false",
			"infoAnexos": "",
			"infoParecerTec": "",
			"infoParecerCont": "",
			"infoIntegracao": "",
			"ds_atividaderealizada": "",
			"ds_casosdestaque": "",
			"tx_infopraticante": "4",
			"tx_infoatendimento": "10",
			"tx_municipio": "",
			"tx_valorrepasassado": "",
			"tx_natureza": "",
			"tx_centrocusto": "",
			"tx_item": "",
			"tx_proponente": "SECRETARIA DA RECEITA FEDERAL",
			"vl_aditivo": "23",
			"ds_integracao": "",
			"tx_sms": "",
			"dt_previsaopagamento": "",
			"ds_obsGeral": "",
			"vl_qtd_presencas": "",
			"vl_qtd_participantes": "",
			"vl_qtd_faltas": "10",
			"vl_qtd_desistencias": "1",
			"vl_count_reg_atend": "NaN",
			"vl_count_anexar_arquivo": "",
			"vl_count_valida_doc": "",
			"vl_count_com_etec": "",
			"vl_count_anex_parecer_cont": "",
			"vl_count_preench_sms": "",
			"vl_count_inf_prev_pag": "",
			"vl_tctf": "00001",
			"nm_municipio_exec": "Pocinhos",
			"nm_operador": "Evaldo Maciel",
			"nm_regional": "Evaldo Maciel",
			"nm_sindicato": "JOAO ITAMAR XAVIER DE OLIVEIRA",
			"nm_prepotente": "",
			"dt_cicloinicio": "25/01/2022",
			"dt_cicloEnd": "25/01/2022",
			"numCiclo": "1",
			"nm_proponente": "SECRETARIA DA RECEITA FEDERAL",
			"vl_minimoparticipante": "1",
			"tx_faltas": "10",
			"retornarParaOperador": "",
			"cb_retornarParaOperador": "",
			"backatend": "",
			"escopobservacao": "",
			"cb_retornarParaOperadorCt": "",
			"cb_retornaParaParecerTec": "",
			"rm_CODCFOsindicato": "C00001328",
			"rm_CODCFOproponente": "F09902",
			"cd_natureza": "",
			"cd_centrocusto": "",
			"numSolicitacaoPai": "252",
			"companyid___1": "2",
			"cardid___1": "206",
			"documentid___1": "663",
			"version___1": "3000",
			"tableid___1": "tb_participante",
			"anonymization_date___1": "",
			"anonymization_user_id___1": "",
			"tx_praticantenome___1": "Evaldo Maciel",
			"tx_praticantecpf___1": "123.123.131-31",
			"tx_atendimento_1___1": "31/01/2022",
			"tx_atendimento_2___1": "31/01/2022",
			"tx_atendimento_3___1": "31/01/2022",
			"tx_atendimento_4___1": "31/01/2022",
			"tx_atendimento_5___1": "31/01/2022",
			"tx_atendimentofim___1": "on",
			"tx_praticantestatus___1": "1",
			"tx_praticdantedesistencia___1": "",
			"masterid___1": "194",
			"companyid___2": "2",
			"cardid___2": "206",
			"documentid___2": "663",
			"version___2": "3000",
			"tableid___2": "tb_participante",
			"anonymization_date___2": "",
			"anonymization_user_id___2": "",
			"tx_praticantenome___2": "Bruno",
			"tx_praticantecpf___2": "242.424.242-34",
			"tx_atendimento_1___2": "",
			"tx_atendimento_2___2": "",
			"tx_atendimento_3___2": "",
			"tx_atendimento_4___2": "",
			"tx_atendimento_5___2": "",
			"tx_atendimentofim___2": "",
			"tx_praticantestatus___2": "1",
			"tx_praticdantedesistencia___2": "",
			"masterid___2": "194",
			"companyid___3": "2",
			"cardid___3": "206",
			"documentid___3": "663",
			"version___3": "3000",
			"tableid___3": "tb_participante",
			"anonymization_date___3": "",
			"anonymization_user_id___3": "",
			"tx_praticantenome___3": "Pedro",
			"tx_praticantecpf___3": "321.839.281-39",
			"tx_atendimento_1___3": "31/01/2022",
			"tx_atendimento_2___3": "31/01/2022",
			"tx_atendimento_3___3": "31/01/2022",
			"tx_atendimento_4___3": "31/01/2022",
			"tx_atendimento_5___3": "31/01/2022",
			"tx_atendimentofim___3": "on",
			"tx_praticantestatus___3": "1",
			"tx_praticdantedesistencia___3": "",
			"masterid___3": "194",
			"companyid___4": "2",
			"cardid___4": "206",
			"documentid___4": "663",
			"version___4": "3000",
			"tableid___4": "tb_participante",
			"anonymization_date___4": "",
			"anonymization_user_id___4": "",
			"tx_praticantenome___4": "Frank",
			"tx_praticantecpf___4": "283.948.924-89",
			"tx_atendimento_1___4": "",
			"tx_atendimento_2___4": "",
			"tx_atendimento_3___4": "",
			"tx_atendimento_4___4": "",
			"tx_atendimento_5___4": "",
			"tx_atendimentofim___4": "",
			"tx_praticantestatus___4": "2",
			"tx_praticdantedesistencia___4": "Foi-se",
			"masterid___4": "194"
		};

		// Aqui pegamos as chaves do objeto
		var iterator = Object.keys(lista);

		var indexPessoas = [];
		var participantes = [];

		// Obtemos o valor com base na chave
		for (var index = 0; index < iterator.length; index++) {
			var element = iterator[index];
			if (element.indexOf("tx_praticantenome___") >= 0) {
				participantes.push(String(element).split("___")[1]);
			}
		}

		for (var index = 0; index < participantes.length; index++) {
			var participante = "tx_praticantenome___" + participantes[index];
			var cpf = "tx_praticantecpf___" + participantes[index];
			var status = "tx_praticantestatus___" + participantes[index];
			var ciclo_status = statusCiclo(253);
			var statusPart = statusParticipante(lista[status]);
			indexPessoas.push([ciclo_status, participantes[index], lista[participante], lista[cpf], statusPart]);
			dataset.addRow([ciclo_status, participantes[index], lista[participante], lista[cpf], statusPart]);
		}
		log.dir(indexPessoas);

	} catch (e) {
		dataset = DatasetBuilder.newDataset();
		dataset.addColumn("nome");
		dataset.addColumn("cpf");
		dataset.addColumn("status");
		dataset.addRow([e.lineNumber, e.message]);
	}


	return dataset;
}

function statusParticipante(params) {
	var status;
	switch (parseInt(params)) {
		case 1:
			status = "Ativo";
			break;
		case 2:
			status = "Desistente";
			break;
		default:
			status = "Ativo";
			break;
	}
	return status;
}

function statusCiclo(params) {
	var datasetWorkflowProcess = DatasetFactory.getDataset('workflowProcess', ["status"], [
		DatasetFactory.createConstraint('workflowProcessPK.processInstanceId', params, params, ConstraintType.MUST)
	], null);
	var status;
	switch (parseInt(datasetWorkflowProcess.getValue(0, "status"))) {
		case 0:
			status = "Em andamento";
			break;
		case 1:
			status = "Cancelado";
			break;
		case 2:
			status = "Concluído";
			break;
		default:
			status = "Em andamento";
			break;
	}
	return status;
}