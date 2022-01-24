 function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetBuilder.newDataset();
       
    //Cria as colunas
    dataset.addColumn("RM_USUARIO");
    dataset.addColumn("RM_SENHA");
      
    //Cria os registros
    dataset.addRow(["mestre", "integracao"]);

    return dataset;
}
 
 