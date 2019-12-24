const enviarAnexo = function (parentId, fileName, blob, callback) {
    $.ajax({
        async: false,
        type: "POST",
        url: '/api/public/2.0/contentfiles/upload/?fileName=' + fileName,
        cache: false,
        contentType: 'application/octet-stream',
        processData: false,
        data: blob,
 
        error: function () {
            FLUIGC.toast({
                title: '',
                message: "Falha ao enviar, tente novamente e se o problema persistir contate a equipe responsavel pelo Fluig.",
                type: 'danger'
            });
        },
 
        success: function (data) {
            const today = new Date();
            today.setDate(today.getDate() + 1);
 
            $.ajax({
                async: false,
                type: "POST",
                contentType: "application/json;",
                url: '/api/public/ecm/document/createDocument',
 
                data: JSON.stringify({
                    "description": fileName,
                    "parentId": '' + parentId,
                    "expirationDate": today.toISOString().split('T')[0],
                    "attachments": [{
                        "fileName": fileName
                    }],
                }),
 
                error: function () {
                    FLUIGC.toast({
                        title: '',
                        message: "Falha ao enviar, tente novamente e se o problema persistir contate a equipe responsavel pelo Fluig.",
                        type: 'danger'
                    });
                },
 
                success: function (data) {
                    callback(data);
                },
            });
        },
    });
};