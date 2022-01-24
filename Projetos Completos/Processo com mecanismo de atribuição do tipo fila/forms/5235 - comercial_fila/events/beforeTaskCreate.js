function beforeTaskCreate(agreementData){
	var userDestino =  hAPI.setCardValue("comFila_execVendas",agreementData.get("currentDestUsers"));
	return userDestino;
}