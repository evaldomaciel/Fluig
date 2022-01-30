
function consultar() {
	/** Carrega a lista de processos ativos */
	var settings = {
		"url": "/ecm/api/rest/ecm/processdefinition/getAllProcessDefinition?_search=false&nd=1643564045869&rows=3000&page=1&sidx=processDescription&sord=asc&_=1643564044812",
		"method": "GET",
		"async": false,
		"timeout": 0,
		"headers": {
			"Content-Type": "application/json"
		},
	};
	var retornoFuncao;
	$.ajax(settings).done(function (response) {
		retornoFuncao = response.invdata
	});
	return retornoFuncao;
}

function excluirProcesso(idProcess) {
	/** Faz a exclusão dos processos */
	var settings = {
		"url": "/ecm/api/rest/ecm/processdefinition/removeProcessDefinition/" + String(idProcess) + "?_=1643564570245",
		"method": "GET",
		"async": false,
		"timeout": 0,
		"headers": {
			"Content-Type": "application/json"
		},
	};
	var retornoFuncao;
	$.ajax(settings).done(function (response) {
		retornoFuncao = response.content
	});
	return retornoFuncao;
}

function repeticao() {
	/** Com base no retorno a consulta dos processo, começa a exclusão */
	var retornoCons = consultar();
	for (var index = 0; index < retornoCons.length; index++) {
		var element = retornoCons[index];
		console.log(excluirProcesso(element.processId));
		if (index == parseInt(retornoCons.length - 1)) {
			/** Permanece em loop até excluir todas as versões do processo */
			setTimeout(() => {
				start()
			}, 500);
			return "Acabou";
		}
	}
}

function start() {
	return repeticao();
}

start();