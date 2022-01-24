function displayFields(form, customHTML) {

	var WKNumState = getValue("WKNumState");
	var WKNumProces = getValue("WKNumProces");
	var WKUser = getValue("WKUser");

	form.setValue("nm_solicitacao", WKNumProces);
	form.setValue("ds_solicitante", retornaNomeUsuario(WKUser));

	if (WKNumState != 5) {
		form.setVisibleById("apravacao", false);
	}

	if (WKNumState == 5) {
		form.setValue("ds_aprovador", retornaNomeUsuario(WKUser));
	}

	if (String(form.getValue("ds_obs_aprovao")).length > 0) {
		form.setVisibleById("apravacao", true);
	}



	function retornaNomeUsuario(params) {
		var constraintColleague1 = DatasetFactory.createConstraint('colleaguePK.colleagueId', params, params, ConstraintType.MUST);
		var datasetColleague = DatasetFactory.getDataset('colleague', null, new Array(constraintColleague1), null);
		return datasetColleague.getValue(0, "colleagueName");
	}







}