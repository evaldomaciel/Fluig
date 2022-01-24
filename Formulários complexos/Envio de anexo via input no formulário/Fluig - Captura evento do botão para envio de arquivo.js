
/* HTML
<div class="col-md-2 col-sm-4">
	<label for="inputBotaoAnexo">Enviar arquivo</label>
	<input type="file" title="" id="inputBotaoAnexo" name="inputBotaoAnexo" class="col-md-2 form-control btn btn-info  btn-sm" />
</div>
*/

/* Evento que captura o input */
$("#inputBotaoAnexo").on('change', pegaArquivoDoInput);

pegaArquivoDoInput = function (evt) {
	// Captura o evento do botão.
	var files = evt.target.files;
	var file = files[0];
	let blob = new Blob([file], { type: 'application/octet-stream' });

	/* Chama a função para enviar o anexo onde as variáveis são: 
	1. Código da pasta onde os arquivos serão salvos 
	2. O nonme do arqivo, que você pega do retorno anterior
	3. Objeto Blob
	4. A função callback.
	*/

	enviarAnexo('2094718', file.name, blob, function (data) {
		// Salva id do documento no ecm.
		if (data.content != undefined) {
			var imagem = data.content.id; // recebe a id do documento
			var apiURL = "/api/public/2.0/documents/getDownloadURL/" + imagem; // chama a API para obter o link da imagem
			$.get(apiURL, function (data) {
				var URLimagem = data.content;
				$('#URL').val(URLimagem); // Salva o link direto para imagem no campo URL. 
			});
		}
	});
}	
