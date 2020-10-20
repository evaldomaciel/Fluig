function afterProcessing(form){

	WKNumProces = hAPI.getValue("WKNumProces");
    form.setValue("numSolicitacao", WKNumProces);

    log.info("Salvo no fomulário o número do processo no campo numSolicitacao: " + WKNumProces);

}