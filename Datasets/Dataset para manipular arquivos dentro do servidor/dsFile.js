function createDataset(fields, constraints, sortFields) {

	/** 
	 * Este dataset foi desenvolvido com o objetivo de limpar o log do servidor ao ser executado, porém, pode ser editado para fazer a leitura e gravação de outros arquivos.
	 * O dataset foi testado em ambiente Windows, os trechos comentados foram de testes em ambiente Linux. Para ambos o sucesso na operação foi de 100%.
	 * 
	*/
	
	var dataset = DatasetBuilder.newDataset();

	try {


		dataset.addColumn("DOC_ID");
		dataset.addColumn("retorno");

		/*
			 var retorno = String(new java.nio.file.Path.of("c:\\dev\\licenses\\windows\\readme.txt"));
			 var retorno = String(new java.nio.file.Files.createTempFile("some", ".txt"));
			 var retorno = new java.nio.file.Files.createTempFile("server", ".log"); esse funciona
			 C:\TOTVS\FLUIG\appserver
		*/

		var retorno = new java.nio.file.Path.of("F:\\fluig\\appserver\\domain\\servers\\fluig1\\log\\server.log");
		var domain = new java.nio.file.Path.of("F:\\fluig\\appserver\\domain\\configuration\\domain.xml");
		domain = new java.nio.file.Path.of("F:\\fluig\\appserver\\repository\\wcmdir\\config\\configuration.properties");
		
		var retorno3 = "";
		
		var retorno3 = new java.nio.file.Files.writeString(retorno, "");
		// var retorno3 = new java.nio.file.Files.readString(retorno);
		//var retorno4 = new java.nio.file.Files.readAllLines(retorno);
		//var domain2 = new java.nio.file.Files.readAllLines(domain);

		var DOC_ID = "OK";
		//dataset.addOrUpdateRow([DOC_ID, String(retorno)]);
		//dataset.addOrUpdateRow([DOC_ID, String(retorno2)]);

		// log.dir(domain2);

		dataset.addRow([String(retorno3), String(domain)]);

		// dataset.addRow([String(retorno), String(retorno3)]);
		//        dataset.addRow([String(retorno), String(domain2)]);

		/* 
	
		var retorno2 = new java.nio.file.Files.move(retorno, java.nio.file.Path.of("C:\\fluig\\appserver\\domain\\servers\\fluig1\\log").resolve(retorno.getFileName().toString()));
		dataset.addRow([DOC_ID, String(retorno2)]);
	
		*/

	} catch (e) {
		dataset = DatasetBuilder.newDataset();
		dataset.addColumn("erro");
		dataset.addColumn("linha");
		dataset.addRow([e.message, e.lineNumber]);
	}

	return dataset;
}
