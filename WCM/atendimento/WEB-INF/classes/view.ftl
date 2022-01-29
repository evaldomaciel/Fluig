<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>
	<div class="backgborder">
		<div class="backgborder-content">
		   <div class="jumbotron">
		      <div class="container">
				<div class=" col logo"></div>
		        <p>Agradecemos seu contato.  Informamos que após o registro, sua solicitação será encaminhada aos nossos atendentes.</p>
		      </div>
		    </div>
		    <div class="col-lg-12 col-lg-offset-2">
		    	<h3>Preencha o formulário abaixo, os campos marcados com <span class="required">*</span> são de preenchimento obrigatório.</h3>
		    </div>
			<div id="registrarSolicitacao" class="tabcontent">
					<div class="row">
						<div class="form-field" data-type="textbox" data-field-name="condominio" data-style="formField">
							<div class="form-input col-xs-12 col-sm-12 col-md-4 col-lg-3 col-lg-offset-2">
								<div class="form-group">
									<select class="form-control input-lg targetSelect" id="usuario_${instanceId}" name="usuario_${instanceId}">
                                            <option value="">Selecione</option>
                                            </select> 
									<label class="label-input">Usuário</label><span class="required">*</span>
								</div>
							</div>
						</div>
						
						<div class="form-field" data-type="textbox" data-field-name="condominio" data-style="formField">
							<div class="form-input col-xs-2 col-sm-2 col-md-4 col-lg-3 col-lg-offset-2">
								<div class="form-group">
									<input type="text" class="form-control" name="dt_agendamento_${instanceId}" id="dt_agendamento_${instanceId}"/>
									<label class="label-input">Data</label><span class="required">*</span>
								</div>
							</div>
						</div>
						
						<div class="form-field" data-type="textbox" data-field-name="condominio" data-style="formField">
							<div class="form-input col-xs-2 col-sm-2 col-md-4 col-lg-3 col-lg-offset-2">
								<div class="form-group">
									<input type="text" class="form-control" name="nm_sala_${instanceId}" id="nm_sala_${instanceId}"/>
									<label class="label-input">Sala</label><span class="required">*</span>
								</div>
							</div>
						</div>
						
						<div class="form-field" data-type="textbox" data-field-name="condominio" data-style="formField">
							<div class="form-input col-xs-2 col-sm-2 col-md-4 col-lg-3 col-lg-offset-2">
								<div class="form-group">
									<input type="text" class="form-control" name="ds_periodo_${instanceId}" id="ds_periodo_${instanceId}"/>
									<label class="label-input">Periodo</label><span class="required">*</span>
								</div>
							</div>
						</div>



						<div class="form-field " data-type="textarea" data-field-name="descricaoSolici" data-style="formField" >
							<div class="form-input col-xs-12 col-sm-12 col-md-12 col-lg-8 col-lg-offset-2">
								<div class="form-group form-group-lg">
									<textarea class="form-control input-lg" rows="5" name="descricaoSolici_${instanceId}" id="descricaoSolici_${instanceId}"></textarea>
									<label class="label-input">Descrição da Ocorrência</label><span class="required">*</span>
								</div>
							</div>
						</div>
					</div>
					<div class="row" algin="center">
						<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center" data-style="formField" style="margin-bottom:15px">
							<input type="file" id="input-file-preview" name="input-file-preview" multiple="multiple" onchange="previewFiles()" style="display:none">
							<button type="buton" class="btn btn-danger btn-lg" onclick="$($(this)[0].parentElement.firstElementChild).trigger('click')" data-enviaranexo="">ANEXAR ARQUIVOS</button>
                   	    </div>
					</div>
					<div class="row">						
                    	<div class="form-field col-xs-6 col-sm-6 col-md-6 col-lg-12 col-lg-offset-2">
							<button id="sendButton" type="buton" class="btn btn-primary btn-lg" data-registrarocorrencia="">ENVIAR</button>
                   		</div>
                	</div>					
                	<div class="row">
						<div class="col-sm-8 col-sm-offset-2">
							<div class="panel panel-default">
								<div class="panel-heading">
								</div>
								<table id="tableAnexos" class="table table-bordered table-hover vmiddle">
									<thead>
										<tr>
											<th></th>
											<th></th>
										</tr>
									</thead>
									<tbody class="tbody-table" id="tbody-table"></tbody><!-- recebe anexos -->
								</table>
							</div>
						</div>
					</div>
				<p class="text-footer" align="center">Desenvolvido por TOTVS | © fluig. Todos os direitos reservados. </p>
			</div>	
		</div>
	</div>
</div>