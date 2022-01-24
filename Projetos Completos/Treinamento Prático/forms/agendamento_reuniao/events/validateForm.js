function validateForm(form) {
	var WKNumState = getValue("WKNumState");

	if (WKNumState == 0 || WKNumState == 4) {
		if (form.getValue('dt_agendamento') == null || form.getValue('dt_agendamento') == "") {
			throw "O campo 'Data' não foi informado";
		} if (form.getValue('nm_sala') == null || form.getValue('nm_sala') == "") {
			throw "O campo 'Sala' não foi informado";
		} if (form.getValue('ds_periodo') == null || form.getValue('ds_periodo') == "") {
			throw "O campo 'Período' não foi informado";
		}
	}


}