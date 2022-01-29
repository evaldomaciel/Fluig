$(document).ready(function () {
    $('.cpf').mask('000.000.000-00', { reverse: true });
    $('.telefone').mask('(00) 00000-0000');
});


var reader

function previewFiles() {
    var files = document.querySelector('input[type=file]').files;
    function readAndPreview(file) {
        reader = new FileReader();
        reader.addEventListener("load", function () {
            $('#tbody-table').append(
                '<tr>' +
                '<td class="text-center col-sm-1">' +
                '<a href="' + this.result + '"></a>' +
                '<span class="btn btn-sm btn-danger flaticon flaticon-trash" onclick="remove(this)"></span>' +
                '</td>' +
                '<td class="col-sm-11">' + file.name + '</td>' +
                '</tr>');

            let Toast = Swal.mixin({
                position: 'top-end',
                showConfirmButton: false,
                timerProgressBar: true,
                backdrop: `rgba(0, 0, 0, 0.1) `,
                timer: 3000
            })

            Toast.fire({
                type: 'success',
                title: 'Arquivo ' + file.name + ' adicionado.'
            })

        }, false);
        reader.readAsDataURL(file);
    }
    if (files) {
        [].forEach.call(files, readAndPreview);
    }
}

(function ($) {
    remove = function (item) {
        var tr = $(item).closest('tr');
        tr.fadeOut(100, function () {
            tr.remove();
        });
        return false;
    }
})(jQuery);