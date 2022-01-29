var MyWidget = SuperWidget.extend({
	message: null,
	init: function () {
		/** Para autenticação é necessário registrar um OAuth Provider e um novo OAuth application */
		var oauth = OAuth({
			consumer: {
				key: 'wcmapp',
				secret: 'wcm4pp'
			},
			signature_method: 'HMAC-SHA1',
			hash_function: function (base_string, key) {
				return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
			},
			nonce_length: 6
		});

		var request_data = {
			url: '/api/public/ecm/dataset/datasets',
			method: 'POST'
		};

		var data = {
			"name": "colleague",
			"fields": [],
			"constraints": [{ "_field": "active", "_finalValue": "true", "_initialValue": "true", "_type": 1 }],
			"order": []
		};

		var token = {
			key: '0b5338b4-e4f5-4b7a-8d08-40bba92592f4',
			secret: '0158c0c7-417a-48fc-8cd7-6e8a3ea0d5510a9b88ee-30fb-48f8-9712-a48b170edc8e'
		};

		$.ajax({
			url: request_data.url,
			contentType: 'application/json',
			crossDomain: true,
			async: true,
			type: request_data.method,
			data: JSON.stringify(data),
			headers: oauth.toHeader(oauth.authorize(request_data, token))
		}).done(function (data) {

			let dataVal = $(data.content)[0].values

			for (let i in dataVal) {
				$(".targetSelect").append($('<option>', {
					value: dataVal[i].colleagueName,
					text: dataVal[i].colleagueName
				}));

			}

		}).fail(function (jqXHR, textStatus) {
			FLUIGC.toast({
				title: 'Não foi possível carregar a lista de usuarios',
				type: 'danger'
			});
		});
	},
	bindings: {
		local: {
			'registrarocorrencia': ['click_registrarocorrencia'],
			'consultarsolicitacao': ['click_consultarsolicitacao']
		},
		global: {}
	},

	registrarocorrencia: function () {

		$('#sendButton').prop("disabled", true);

		var load = FLUIGC.loading('#registrarSolicitacao', {
			textMessage: null,
			title: null,
			cursorReset: 'default',
			baseZ: 1000,
			centerX: true,
			centerY: true,
			bindEvents: false,
			fadeIn: 200,
			fadeOut: 400,
			timeout: 0,
			showOverlay: false,
			onBlock: null,
			onUnblock: null,
			ignoreIfBlocked: false
		});

		load.show();
		let _xml = null;

		$.ajax({
			url: '/atendimento/resources/js/xmls/startProcess.xml',
			async: false,
			type: "get",
			datatype: "xml",
			success: function (xml) {
				_xml = $(xml)
			}
		});

		console.log("Data ------ ");
		console.log($('[name*="dt_agendamento_"]').val());

		_xml.find('[name="ds_solicitante"]').text($('[name*="usuario_"]').val());
		_xml.find('[name="ds_agendamento"]').text($('[name*="descricaoSolici_"]').val());
		_xml.find('[name="dt_agendamento"]').text($('[name*="dt_agendamento_"]').val());
		_xml.find('[name="nm_sala"]').text($('[name*="nm_sala_"]').val());
		_xml.find('[name="ds_periodo"]').text($('[name*="ds_periodo_"]').val());

		console.log(_xml);

		if ($('#tbody-table tr').length > 0) {
			let index = $('#tbody-table tr:last')[0].rowIndex;

			for (let i = 0; i < index; i++) {

				let base64 = $('#tbody-table').find("tr:eq(" + i + ")").find("td:eq(0)")[0].childNodes[0].href;
				base64 = base64.split(',');
				let fileContent = base64[1];
				let fileName = $('#tbody-table').find("tr:eq(" + i + ")").find("td:eq(1)")[0].childNodes[0].nodeValue;
				let seq = i + 1;
				let _itemsXML = '<item>' +
					'<attachmentSequence>' + seq + '</attachmentSequence>' +
					'<attachments>' +
					'<attach>true</attach>' +
					'<fileName>' + fileName + '</fileName>' +
					'<filecontent>' + fileContent + '</filecontent>' +
					'<mobile>true</mobile>' +
					'<fileSize>0</fileSize>' +
					'<principal>true</principal>' +
					'</attachments>' +
					'<description>' + fileName + '</description>' +
					'<fileName>' + fileName + '</fileName>' +
					'</item>';

				let parser = new DOMParser();
				let itemsXML = parser.parseFromString(_itemsXML, "text/xml");
				let element = _xml[0].getElementsByTagName("attachments");
				element[0].appendChild(itemsXML.documentElement);
			}
		}

		console.log(_xml)

		WCMAPI.Create({
			url: "/webdesk/ECMWorkflowEngineService?wsdl",
			contentType: "text/xml;charset=ISO-8859-1",
			dataType: "xml",
			data: _xml[0],
			success: function (data) {

				if (data.getElementsByTagName("result")[0].getElementsByTagName("item")[0].getElementsByTagName("item")[0].textContent == 'ERROR') {
					Swal.fire({
						type: 'warning',
						title: 'Atenção',
						html: data.getElementsByTagName("result")[0].getElementsByTagName("item")[0].getElementsByTagName("item")[1].textContent,
						showCloseButton: false,
						focusConfirm: true,
						confirmButtonText: 'Fechar',
					})
					$('#sendButton').prop("disabled", false);
					load.hide()
				} else {

					let processId = $(data).find("result").children()[5].children[1].textContent;
					let numDocto = $(data).find("result").children()[0].children[1].textContent;
					let dataSolicitacao = ("0" + new Date().getDate()).substr(-2) + ("0" + (new Date().getMonth() + 1)).substr(-2) + new Date().getFullYear()
					//let protocolo = dataSolicitacao + processId;
					let protocolo = processId;

					Swal.fire({
						title: '<h1>Solicitação Efetuada com Sucesso</h1>',
						type: 'success',
						width: '50%',
						html: '<div class="container"><div class="info-header"></div><div class="info-body"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><p><strong>O número do seu protocolo é <span><h2>' + protocolo + '</h2></a></span></p><p> Tudo certo! Você receberá um e-mail de confirmação com mais detalhes sobre sua solicitação. Em caso de dúvidas, entre em contato conosco pelo telefone <a href="tel:3612-0200">3612-0200</a></p></div><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="info-link"><p>Nossos atendentes darão retorno sobre sua solicitação em até dois dias úteis a partir da data de abertura da solicitação.</p></div></div></div>',
						showCloseButton: false,
						showCancelButton: false,
						focusConfirm: false,
						confirmButtonText: '<i class="fluigicon fluigicon-remove icon-sm"></i> Fechar Página'
					})
					load.hide()
					$("#backborder").css("visibility", "hidden")
				}
			}, error: function (err) {
				load.hide()
				console.log(_xml)
				FLUIGC.message.error({
					title: 'Erro',
					message: 'Houve um erro ao enviar a solicitação, informe-nos sobre os detalhes abaixo.',
					details: err.status + ': ' + err.statusText + "\n \n" + err.responseXML.all[4].innerHTML
				});
			}
		})
	}
});