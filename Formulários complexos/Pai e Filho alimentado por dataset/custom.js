$(document).ready(function () {
	/** Função é iniciada quando o HTML termina o carregando */
	carregaDatasetNoPaiFilho();
});

function carregaDatasetNoPaiFilho() {
	var colunasColleague = new Array('colleagueName', 'mail', 'colleaguePK.colleagueId');
	var datasetColleague = DatasetFactory.getDataset('colleague', colunasColleague, null, null);
	for (var key in datasetColleague.values) {
		if (Object.hasOwnProperty.call(datasetColleague.values, key)) {
			/** Adicionando um nova linha para cada item do dataset */
			var rowId = wdkAddChild("tabelaDeUsuarios");
			/** Alimentando os campos com as informações */
			$("[name='idUser___" + rowId + "']").val(datasetColleague.values[key]["colleaguePK.colleagueId"]);
			$("[name='nome___" + rowId + "']").val(datasetColleague.values[key].colleagueName);
			$("[name='email___" + rowId + "']").val(datasetColleague.values[key].mail);
		}
	}
}
