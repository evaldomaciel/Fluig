var MyWidget = SuperWidget.extend({
    //variáveis da widget
    variavelNumerica: null,
    variavelCaracter: null,

    //método iniciado quando a widget é carregada
    init: function() {
    },
  
    //BIND de eventos
    bindings: {
        local: {
            'execute': ['click_executeAction']
        },
        global: {}
    },
 
    executeAction: function(htmlElement, event) {
    }

});


function organograma() {

	var imagem = "data:image/jpeg;base64,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";

	var testData = [
	    {id: 1, img: imagem, name: 'My Organization', parent: 0},
	    {id: 2, img: imagem, name: 'Person 1', description: "CEO", parent: 1},
	    {id: 3, img: imagem, name: 'Person 2', description: "Division 1 VP", parent: 2},
	    {id: 4, img: imagem, name: 'Person 3', description: "Division 2 VP", parent: 2},
	    {id: 6, img: imagem, name: 'Person 4', description: "Division 1 Director", parent: 3},
	    {id: 7, img: imagem, name: 'Person 5', description: "Division 1 Director", parent: 3},
	    {id: 8, img: imagem, name: 'Person 6', description: "Division 2 Director", parent: 4}
	];
	var settings = {
	    data: testData
	}
	var testOrgChart = FLUIGC.orgChart('#orgChart', settings);
	testOrgChart.on('fluig.orgchart.node.click', function(node){
		FLUIGC.toast({
	        title: 'Node clicked: ',
	        message: node.data.name,
	        type: 'success'
	    });
	});
}


$(document).ready(function(){
	organograma();
});