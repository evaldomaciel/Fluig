function enableFields(form) {

	var WKNumState = getValue("WKNumState");

	form.setEnabled("nm_solicitacao", false);
	form.setEnabled("ds_solicitante", false);

	if (WKNumState == 0 || WKNumState == 4) {
		form.setEnabled("ds_obs_aprovao", false);
		form.setEnabled("ds_aprovacao", false);
	}

	// 5 == Aprovação
	if (WKNumState == 5) {
		form.setEnabled("dt_agendamento", false);
		form.setEnabled("ds_agendamento", false);
		form.setEnabled("nm_cep", false);
		form.setEnabled("nm_uf", false);
		form.setEnabled("nm_cidade", false);
		form.setEnabled("nm_bairro", false);
		form.setEnabled("nm_logradouro", false);
		form.setEnabled("nm_sala", false);
		form.setEnabled("ds_periodo", false);
	}

}