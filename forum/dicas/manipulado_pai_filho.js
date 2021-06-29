

/* Captura o Change */ 
$("[name^=FUNC_COMPETENCIA]").on("change", function () {
	alteracaoDeCampos();
});

$("[name^=COLETIVO_COMPETENCIA]").on("change", function () {
	alteracaoDeCampos();
});


/* Faz o trabalho  */ 

function alteracaoDeCampos () { 
	$("[name^=FUNC_COMPETENCIA]").on("change", function (e) {
		var dataCompetencia = $(e.currentTarget).val().split("/");
		console.log(dataCompetencia);
		$(e.currentTarget).val("01/" + dataCompetencia[1] + "/" + dataCompetencia[2]);
	})
	
	$("[name^=COLETIVO_COMPETENCIA]").on("change", function (e) {
		var dataCompetencia = $(e.currentTarget).val().split("/");
		console.log(dataCompetencia);
		$(e.currentTarget).val("01/" + dataCompetencia[1] + "/" + dataCompetencia[2]);
	})
}