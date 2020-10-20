function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("RETORNO");

	//DEFINICAO DAS VARIAVEIS PARA A CHAMADA DA FUNCAO createData()
	var company = 1; // parseInt(getValue("WKCompany"));
	var user = "integrador";
	var password = "totvs@123";

	//CHAMADA DA FUNCAO PARA A CRIACAO DOS REGISTROS DE FORMULARIO
	var retorno = createData(company, user, password);
	dataset.addRow([retorno]);

	return dataset;
}

function createData(company, user, password) {
	var OPERADORA = "CNU";
	var COMPETENCIAPGTO = data(new Date(), "COMPETENCIAPGTO");
	var TIPOCSV = "MENSALIDADE";
	var dataDaImportacao = String(data());

	try {

		var properties = {};
		properties["disable.chunking"] = "true";
		properties["log.soap.messages"] = "true";

		//CHAMADA DO SERVICO E INSTANCIAÇAO DAS CLASSES PARA A CHAMADA DO METODO	
		var serviceManager = ServiceManager.getService("ECMCardService");
		var serviceInstance = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.ECMCardServiceService");
		var service = serviceInstance.getCardServicePort();
		var customClient = serviceManager.getCustomClient(service, "com.totvs.technology.ecm.dm.ws.CardService", properties);

		var attachment = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.Attachment");
		var relatedDocument = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.RelatedDocumentDto");
		var documentSecurity = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.DocumentSecurityConfigDto");
		var approver = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.ApproverDto");

		var cs1 = DatasetFactory.createConstraint('codigoDocumento', '1090118', '1090118', ConstraintType.MUST); // Documento com 1000 linhas 
		//var cs1 = DatasetFactory.createConstraint('codigoDocumento', '1089185', '1089185', ConstraintType.MUST); // Documento menor para teste
		//var cs1 = DatasetFactory.createConstraint('codigoDocumento', '1089527', '1089527', ConstraintType.MUST); // Documento menor do menor para teste
		//var cs1 = DatasetFactory.createConstraint('codigoDocumento', '2253569', '2253569', ConstraintType.MUST); // Documento grande para teste
		var consts = new Array(cs1);
		var csvPlano = DatasetFactory.getDataset("dsAtualizaCard_v2", null, consts, null);

		for (var i = 0; i < csvPlano.rowsCount; i++) {
			var result = null;

			var TIPO_REGISTRO = csvPlano.getValue(i, "TIPO_REGISTRO");
			var COD_EMPRESA = csvPlano.getValue(i, "COD_EMPRESA");
			var NOME_LOTACAO = csvPlano.getValue(i, "NOME_LOTACAO");
			var COMPETENCIA = csvPlano.getValue(i, "COMPETENCIA");
			var TIPO_OPERACAO = csvPlano.getValue(i, "CATEG_BENEFICIARIO");
			var VIGENCIA = csvPlano.getValue(i, "VIGENCIA");
			var FUNCIONAL = csvPlano.getValue(i, "FUNCIONAL");
			var DEPENDENCIA = csvPlano.getValue(i, "DEPENDENCIA");
			var NOME_ASSOCIADO = csvPlano.getValue(i, "NOME_ASSOCIADO");
			var DT_NASC_ASSOCIADO = csvPlano.getValue(i, "DT_NASC_ASSOCIADO");
			var CPF_ASSOCIADO = csvPlano.getValue(i, "CPF_ASSOCIADO");
			var NUM_ASSOCIADO = csvPlano.getValue(i, "NUM_ASSOCIADO");
			var SEXO = csvPlano.getValue(i, "SEXO");
			var EST_CIVIL = csvPlano.getValue(i, "EST_CIVIL");
			var NOME_TITULAR = csvPlano.getValue(i, "NOME_TITULAR");
			var CPF_TITULAR = csvPlano.getValue(i, "CPF_TITULAR");
			var DT_INI_CONVENIO = csvPlano.getValue(i, "DT_INI_CONVENIO");
			var DT_FIM_CONVENIO = csvPlano.getValue(i, "DT_FIM_CONVENIO");
			var CATEG_BENEFICIARIO = csvPlano.getValue(i, "CATEG_BENEFICIARIO");
			var COD_PLANO = csvPlano.getValue(i, "COD_PLANO");
			var IDADE_MAXIMA = csvPlano.getValue(i, "IDADE_MAXIMA");
			var VL_FATURA = csvPlano.getValue(i, "VL_FATURA");
			var SINAL_OPERACAO = csvPlano.getValue(i, "SINAL_OPERACAO");
			var VL_INSCRICAO = csvPlano.getValue(i, "VL_INSCRICAO");
			var NUM_FATURA = csvPlano.getValue(i, "NUM_FATURA");
			var CENTRO_DE_CUSTO = csvPlano.getValue(i, "CENTRO_DE_CUSTO");
			var NOME_EMPRESA = csvPlano.getValue(i, "NOME_EMPRESA");
			var COD_LOTACAO = csvPlano.getValue(i, "COD_LOTACAO");
			var CNPJ = csvPlano.getValue(i, "CNPJ");
			var LINHADOCSV = csvPlano.getValue(i, "LINHADOCSV");
			var CCRATEIO = csvPlano.getValue(i, "CCRATEIO");
			var CHAPAVALIDA = csvPlano.getValue(i, "CHAPAVALIDA");

			var descForm = String(TIPOCSV) + "/" + String(OPERADORA) + " - " + String(COMPETENCIA) + " - " + String(novaChapa(FUNCIONAL)) + " - " + String(NOME_TITULAR);

			//CRIACAO DA CONSTRAINT PARA VERIFICAR SE COMPETÊNCIA JÁ FOI INSERIDA JA NAO ESTA SINCRONIZADO NO FORMULARIO DE DESTINO			
			var c1 = DatasetFactory.createConstraint("LINHADOCSV", LINHADOCSV, LINHADOCSV, ConstraintType.MUST);
			c1.setLikeSearch(true);
			var constraints = new Array(c1);

			var dsFormCSVPlanoRetorno = DatasetFactory.getDataset("dsFormCSVPlano", null, constraints, null);

			if (dsFormCSVPlanoRetorno.values.length > 0) {
				// log.info("###### COMPETÊNCIA JÁ INSERIDA");
				continue;
			}
			else {
				// log.info("###### COMPETÊNCIA NAO SINCRONIZADO AINDA!");

				//A CADA ITERACAO, SE A LINHA NAO FOI SINCRONIZADA É PRECISO INSTANCIAR AS VARIÁVEIS ABAIXO,
				//PARA QUE NAO HAJA DUPLICIDADE DOS REGISTROS DO FORMULARIO (CAUSANDO A CRIACAO DE MAIS DE UM REGISTRO DE FORMULARIO PARA O MESMO REGISTRO DO FOR) 

				var cardDtoArray = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardDtoArray");
				var cardDto = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardDto");

				var cardFieldDto1 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto2 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto3 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto4 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto5 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto6 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto7 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto8 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto9 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto10 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto11 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto12 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto13 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto14 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto15 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto16 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto17 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto18 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto19 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto20 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto21 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto22 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto23 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto24 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto25 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto26 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto27 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto28 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto29 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto30 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto31 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto32 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto33 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto34 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto35 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto36 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				var cardFieldDto37 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");

				cardDto.getAttachs().add(attachment);
				cardDto.getReldocs().add(relatedDocument);
				cardDto.getDocsecurity().add(documentSecurity);
				cardDto.getDocapprovers().add(approver);

				//ADICIONA NO ARRAY OS METADADOS DO REGISTRO DE FORMULARIO 
				cardDto.setDocumentDescription(COMPETENCIA);
				cardDto.setAdditionalComments("");
				cardDto.setParentDocumentId(1089442);
				cardDto.setColleagueId("integrador"); // alterar para usuário de integração <SENHA_DO_USUARIO>
				cardDto.setExpires(false);
				cardDto.setUserNotify(false);
				cardDto.setInheritSecurity(true);
				cardDto.setTopicId(1);
				cardDto.setVersionDescription("");
				cardDto.setDocumentKeyWord("");

				//ADICIONA NO ARRAY OS DADOS DOS CAMPOS DO FORMULARIO: NOME E O VALOR	
				cardFieldDto1.setField("TIPO_REGISTRO"); cardFieldDto1.setValue(TIPO_REGISTRO); cardDto.getCardData().add(cardFieldDto1);
				cardFieldDto2.setField("COD_EMPRESA"); cardFieldDto2.setValue(COD_EMPRESA); cardDto.getCardData().add(cardFieldDto2);
				cardFieldDto3.setField("NOME_LOTACAO"); cardFieldDto3.setValue(NOME_LOTACAO); cardDto.getCardData().add(cardFieldDto3);
				cardFieldDto4.setField("COMPETENCIA"); cardFieldDto4.setValue(COMPETENCIA); cardDto.getCardData().add(cardFieldDto4);
				cardFieldDto5.setField("TIPO_OPERACAO"); cardFieldDto5.setValue(TIPO_OPERACAO); cardDto.getCardData().add(cardFieldDto5);
				cardFieldDto6.setField("VIGENCIA"); cardFieldDto6.setValue(VIGENCIA); cardDto.getCardData().add(cardFieldDto6);
				cardFieldDto7.setField("FUNCIONAL"); cardFieldDto7.setValue(FUNCIONAL); cardDto.getCardData().add(cardFieldDto7);
				cardFieldDto8.setField("DEPENDENCIA"); cardFieldDto8.setValue(DEPENDENCIA); cardDto.getCardData().add(cardFieldDto8);
				cardFieldDto9.setField("NOME_ASSOCIADO"); cardFieldDto9.setValue(NOME_ASSOCIADO); cardDto.getCardData().add(cardFieldDto9);
				cardFieldDto10.setField("DT_NASC_ASSOCIADO"); cardFieldDto10.setValue(DT_NASC_ASSOCIADO); cardDto.getCardData().add(cardFieldDto10);
				cardFieldDto11.setField("CPF_ASSOCIADO"); cardFieldDto11.setValue(CPF_ASSOCIADO); cardDto.getCardData().add(cardFieldDto11);
				cardFieldDto12.setField("NUM_ASSOCIADO"); cardFieldDto12.setValue(NUM_ASSOCIADO); cardDto.getCardData().add(cardFieldDto12);
				cardFieldDto13.setField("SEXO"); cardFieldDto13.setValue(SEXO); cardDto.getCardData().add(cardFieldDto13);
				cardFieldDto14.setField("EST_CIVIL"); cardFieldDto14.setValue(EST_CIVIL); cardDto.getCardData().add(cardFieldDto14);
				cardFieldDto15.setField("NOME_TITULAR"); cardFieldDto15.setValue(NOME_TITULAR); cardDto.getCardData().add(cardFieldDto15);
				cardFieldDto16.setField("CPF_TITULAR"); cardFieldDto16.setValue(CPF_TITULAR); cardDto.getCardData().add(cardFieldDto16);
				cardFieldDto17.setField("DT_INI_CONVENIO"); cardFieldDto17.setValue(DT_INI_CONVENIO); cardDto.getCardData().add(cardFieldDto17);
				cardFieldDto18.setField("DT_FIM_CONVENIO"); cardFieldDto18.setValue(DT_FIM_CONVENIO); cardDto.getCardData().add(cardFieldDto18);
				cardFieldDto19.setField("CATEG_BENEFICIARIO"); cardFieldDto19.setValue(CATEG_BENEFICIARIO); cardDto.getCardData().add(cardFieldDto19);
				cardFieldDto20.setField("COD_PLANO"); cardFieldDto20.setValue(COD_PLANO); cardDto.getCardData().add(cardFieldDto20);
				cardFieldDto21.setField("IDADE_MAXIMA"); cardFieldDto21.setValue(IDADE_MAXIMA); cardDto.getCardData().add(cardFieldDto21);
				cardFieldDto22.setField("VL_FATURA"); cardFieldDto22.setValue(VL_FATURA); cardDto.getCardData().add(cardFieldDto22);
				cardFieldDto23.setField("SINAL_OPERACAO"); cardFieldDto23.setValue(SINAL_OPERACAO); cardDto.getCardData().add(cardFieldDto23);
				cardFieldDto24.setField("VL_INSCRICAO"); cardFieldDto24.setValue(VL_INSCRICAO); cardDto.getCardData().add(cardFieldDto24);
				cardFieldDto25.setField("NUM_FATURA"); cardFieldDto25.setValue(NUM_FATURA); cardDto.getCardData().add(cardFieldDto25);
				cardFieldDto26.setField("CENTRO_DE_CUSTO"); cardFieldDto26.setValue(CENTRO_DE_CUSTO); cardDto.getCardData().add(cardFieldDto26);
				cardFieldDto27.setField("NOME_EMPRESA"); cardFieldDto27.setValue(NOME_EMPRESA); cardDto.getCardData().add(cardFieldDto27);
				cardFieldDto28.setField("COD_LOTACAO"); cardFieldDto28.setValue(COD_LOTACAO); cardDto.getCardData().add(cardFieldDto28);
				cardFieldDto29.setField("CNPJ"); cardFieldDto29.setValue(CNPJ); cardDto.getCardData().add(cardFieldDto29);
				cardFieldDto30.setField("LINHADOCSV"); cardFieldDto30.setValue(LINHADOCSV); cardDto.getCardData().add(cardFieldDto30);
				cardFieldDto31.setField("CCRATEIO"); cardFieldDto31.setValue(CCRATEIO); cardDto.getCardData().add(cardFieldDto31);
				cardFieldDto32.setField("CHAPAVALIDA"); cardFieldDto32.setValue(CHAPAVALIDA); cardDto.getCardData().add(cardFieldDto32);
				cardFieldDto33.setField("OPERADORA"); cardFieldDto33.setValue(OPERADORA); cardDto.getCardData().add(cardFieldDto33);
				cardFieldDto34.setField("COMPETENCIAPGTO"); cardFieldDto34.setValue(COMPETENCIAPGTO); cardDto.getCardData().add(cardFieldDto34);
				cardFieldDto35.setField("TIPOCSV"); cardFieldDto35.setValue(TIPOCSV); cardDto.getCardData().add(cardFieldDto35);
				cardFieldDto36.setField("dataDaImportacao"); cardFieldDto36.setValue(dataDaImportacao); cardDto.getCardData().add(cardFieldDto36);
				cardFieldDto37.setField("descForm"); cardFieldDto37.setValue(descForm); cardDto.getCardData().add(cardFieldDto37);

				// ADICIONA O REGISTRO NO ARRAY DO REGISTRO DE FORMULARIO
				cardDtoArray.getItem().add(cardDto);

				//CHAMADA METODO PARA CRIACAO DOS REGISTROS DE FORMULARIO
				result = customClient.create(company, user, password, cardDtoArray);
				// log.info("###### FUNCIONARIO SINCRONIZADO!");

			}
		}
		if (result.getItem().get(0).getWebServiceMessage().equals("ok")) {
			return "Sincronização completada com sucesso!";
		} else {
			return "Não foi: " + result.getItem().get(0).getWebServiceMessage();
		}
	}
	catch (e) {
		// log.error('###### Erro ao sincronizar os aniversariantes. ' + e.message);
		return e.message;
	}
}

function data(valor, tipo) {
	var novovalor = valor == null ? Date() : valor;
	var data = new Date(novovalor);
	var mes = data.getUTCMonth() < 10 ? "0" + (data.getUTCMonth() + 1) : (data.getUTCMonth() + 1);
	var ano = data.getUTCFullYear();
	var dia = data.getUTCDate() < 10 ? "0" + data.getUTCDate() : data.getUTCDate();

	if (tipo == "COMPETENCIAPGTO") {
		var novaData = String(mes) + "/" + String(ano);
	} else {
		var novaData = String(ano) + "/" + String(mes) + "/" + String(dia);
	}
	return novaData;
}

var novaChapa = function (chapaAntiga) {
	var novaChapa = ("000000" + chapaAntiga).slice(-6)
	return novaChapa;
}