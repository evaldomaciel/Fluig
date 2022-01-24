var MyWidget = SuperWidget.extend({
    //variáveis da widget
    variavelNumerica: null,
    variavelCaracter: null,

    myTable: null,
    tableData: null,
    dataInit: null,

    //método iniciado quando a widget é carregada
    init: function () {
        this.loadTable();
    },

    loadTable: function () {
        var that = this;
        that.myTable = FLUIGC.datatable('#idtable' + "_" + that.instanceId, {
            dom: 'Bfrtip',
            buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5'
            ],
            dataRequest: DatasetFactory.getDataset('colleague', null, null, null).values,
            renderContent: ['colleagueName', 'login', 'mail', 'defaultLanguage'],
            header: [
                { 'title': 'Nome' },
                { 'title': 'Login' },
                { 'title': 'E-mail' },
                { 'title': 'Idioma' }
            ],
            search: {
                enabled: true,
                onlyEnterkey: true,
                onSearch: function (res) {
                    if (!res) {
                        that.myTable.reload(dataInit);
                    }
                    var dataAll = that.myTable.getData();
                    var search = dataAll.filter(function (el) {
                        return el.colleagueName.toUpperCase().indexOf(res.toUpperCase()) >= 0
                            || el.login.toUpperCase().indexOf(res.toUpperCase()) >= 0
                            || el.mail.toUpperCase().indexOf(res.toUpperCase()) >= 0;
                    });
                    if (search && search.length) {
                        that.myTable.reload(search);
                    } else {
                        FLUIGC.toast({
                            title: 'Searching: ',
                            message: 'No results',
                            type: 'success'
                        });
                    }
                }
            },
            navButtons: {
                enabled: true,
            },
        }, function (err, data) {
            if (data) {
                dataInit = data;
            }
            else if (err) {
                FLUIGC.toast({
                    message: err,
                    type: 'danger'
                });
            }
        });
    },

    //BIND de eventos
    bindings: {
        local: {
            'execute': ['click_executeAction']
        },
        global: {}
    },

    executeAction: function (htmlElement, event) {
    }

});

