function servicetask14(attempt, message) {
	var NOME_DATASERVER = "RhuPessoaData";

	var datasetDs_parametros = DatasetFactory.getDataset('ds_parametros', null, null, null);

	/* Prepararação das variaveis */
	//usuário e senha do aplicativo RM. O mesmo utilizado para logar no sistema e que tenha permissão de   
	//acesso ao cadastro que deseja utilizar  
	var usuario = datasetDs_parametros.getValue(0, "RM_USUARIO");
	var senha = datasetDs_parametros.getValue(0, "RM_SENHA");

	//importante passar no contexto o mesmo código de usuário usado para logar no webservice  
	var context = "CODSISTEMA=G;CODCOLIGADA=1;CODUSUARIO=mestre"
	/* Fim Prepararação das variaveis */

	try {

		if (isEmpty(hAPI.getCardValue("CODIGO")))
			return
		var primaryKey = hAPI.getCardValue("CODIGO");

		// carrega o webservice...  
		var authService = getWebService(usuario, senha);
		// define o contexto...  
		// faz a leitura...  
		var text = new String(authService.readRecord(NOME_DATASERVER, primaryKey, context));

		if (!ChekExist(text))
			text = GetXml();

		// atualiza o valor...  
		text = replaceValue(text, "EMAIL", hAPI.getCardValue("ds_email"));


		var result = new String(authService.saveRecord(NOME_DATASERVER, text, context));

		log.dir(result);

		// se retornou a chave, salvou ok...  
		checkIsPK(result, 1);
	}
	catch (e) {
		if (e == null) e = "Erro desconhecido!";
		var mensagemErro = "Ocorreu um erro ao salvar dados no RM: " + e;
		throw mensagemErro;
	}
}


function GetXml() {
	return "<RhuPessoa>" +
		"  <PPessoa>" +
		"    <CODIGO>1</CODIGO>" +
		"    <NOME>ITAMAR MENDES DA SILVEIRA</NOME>" +
		"    <DTNASCIMENTO>1965-08-10T00:00:00</DTNASCIMENTO>" +
		"    <ESTADONATAL>MG</ESTADONATAL>" +
		"    <NATURALIDADE>Belo Horizonte</NATURALIDADE>" +
		"    <APELIDO>asdf</APELIDO>" +
		"    <SEXO>M</SEXO>" +
		"    <NACIONALIDADE>10</NACIONALIDADE>" +
		"    <GRAUINSTRUCAO>9</GRAUINSTRUCAO>" +
		"    <RUA>Rua Mata Atlantica</RUA>" +
		"    <NUMERO>333</NUMERO>" +
		"    <BAIRRO>Planalto</BAIRRO>" +
		"    <ESTADO>MG</ESTADO>" +
		"    <CIDADE>Belo Horizonte</CIDADE>" +
		"    <CEP>30100020</CEP>" +
		"    <PAIS>Brasil</PAIS>" +
		"    <REGPROFISSIONAL>Reg-00098</REGPROFISSIONAL>" +
		"    <CPF>51427362653</CPF>" +
		"    <IDIMAGEM>844</IDIMAGEM>" +
		"    <TELEFONE1>4613636</TELEFONE1>" +
		"    <CARTIDENTIDADE>M 267392</CARTIDENTIDADE>" +
		"    <UFCARTIDENT>MG</UFCARTIDENT>" +
		"    <ORGEMISSORIDENT>SSP</ORGEMISSORIDENT>" +
		"    <DTEMISSAOIDENT>1993-04-25T00:00:00</DTEMISSAOIDENT>" +
		"    <TITULOELEITOR>123.334</TITULOELEITOR>" +
		"    <ZONATITELEITOR>0012</ZONATITELEITOR>" +
		"    <SECAOTITELEITOR>0006</SECAOTITELEITOR>" +
		"    <CARTEIRATRAB>015116</CARTEIRATRAB>" +
		"    <SERIECARTTRAB>00001</SERIECARTTRAB>" +
		"    <UFCARTTRAB>MG</UFCARTTRAB>" +
		"    <DTCARTTRAB>1993-03-01T00:00:00</DTCARTTRAB>" +
		"    <NIT>0</NIT>" +
		"    <CARTMOTORISTA>13.344.543</CARTMOTORISTA>" +
		"    <TIPOCARTHABILIT>A</TIPOCARTHABILIT>" +
		"    <DTVENCHABILIT>1997-02-05T00:00:00</DTVENCHABILIT>" +
		"    <CERTIFRESERV>12856945678</CERTIFRESERV>" +
		"    <CATEGMILITAR>CDI</CATEGMILITAR>" +
		"    <CONJUGEBRASIL>0</CONJUGEBRASIL>" +
		"    <NATURALIZADO>0</NATURALIZADO>" +
		"    <FILHOSBRASIL>0</FILHOSBRASIL>" +
		"    <NROFILHOSBRASIL>0</NROFILHOSBRASIL>" +
		"    <EMAIL>masterkeyweb@totvs.com.br</EMAIL>" +
		"    <INVESTTREINANT>2300.00</INVESTTREINANT>" +
		"    <CORRACA>0</CORRACA>" +
		"    <DEFICIENTEFISICO>0</DEFICIENTEFISICO>" +
		"    <CODUSUARIO>simone</CODUSUARIO>" +
		"    <TELEFONE3>21229000</TELEFONE3>" +
		"    <EMPRESA>RM SISTEMAS S.A</EMPRESA>" +
		"    <CODOCUPACAO>10</CODOCUPACAO>" +
		"    <BRPDH>0</BRPDH>" +
		"    <FUMANTE>0</FUMANTE>" +
		"    <AJUSTATAMANHOFOTO>0</AJUSTATAMANHOFOTO>" +
		"    <DEFICIENTEAUDITIVO>0</DEFICIENTEAUDITIVO>" +
		"    <DEFICIENTEFALA>0</DEFICIENTEFALA>" +
		"    <DEFICIENTEVISUAL>0</DEFICIENTEVISUAL>" +
		"    <DEFICIENTEMENTAL>0</DEFICIENTEMENTAL>" +
		"    <DATAAPROVACAOCURR>2005-04-01T09:36:02.66</DATAAPROVACAOCURR>" +
		"    <IMAGEM></IMAGEM>" +
		"    <ESTADOROW>0</ESTADOROW>" +
		"    <ROWVALIDA>0</ROWVALIDA>" +
		"    <ALUNO>1</ALUNO>" +
		"    <PROFESSOR>1</PROFESSOR>" +
		"    <CANDIDATO>1</CANDIDATO>" +
		"    <USUARIOBIBLIOS>1</USUARIOBIBLIOS>" +
		"    <FUNCIONARIO>1</FUNCIONARIO>" +
		"    <EXFUNCIONARIO>0</EXFUNCIONARIO>" +
		"    <DEFICIENTEINTELECTUAL>0</DEFICIENTEINTELECTUAL>" +
		"    <FALECIDO>0</FALECIDO>" +
		"    <IDADE>53</IDADE>" +
		"  </PPessoa>" +
		"  <VPCompl>" +
		"    <CODPESSOA>1</CODPESSOA>" +
		"    <IDADE>34</IDADE>" +
		"    <PESO>75</PESO>" +
		"  </VPCompl>" +
		"</RhuPessoa>";

}