function inicial() {
	FLUIGC.calendar('#dt_agendamento');


	$("#nm_cep").on("change", function () {
		buscaCEP($("#nm_cep").val());
	});
}

function setSelectedZoomItem(selectedItem) {
	if (selectedItem.inputName == "ds_participante") {
		$("#ds_email").val(selectedItem.EMAIL);
		$("#CODIGO").val(selectedItem.CODIGO);
	}
}

function removedZoomItem(removedItem) {
	if (removedItem.inputName == "ds_participante") {
		$("#ds_email").val("");
	}
}

function buscaCEP(paramCEP) {

	var cep = String(paramCEP).replace(/\D/g, "");

	$.get("//viacep.com.br/ws/" + cep + "/json/", function (dados) {
		console.log(dados);
		if (!("erro" in dados)) {
			$("#nm_uf").val(dados.uf);
			$("#nm_cidade").val(dados.localidade);
			$("#nm_bairro").val(dados.bairro);
			$("#nm_logradouro").val(dados.logradouro);
		} else {
			alert("CEP invalido");
		}
	});

}