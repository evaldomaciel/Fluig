function displayFields(form,customHTML){
    var user = getValue("WKUser");
    customHTML.append("\n<script>\n");
    customHTML.append("$(window).on('load', function(){\n");
    customHTML.append("		$('#comFila_nome').val('"+ user +"');\n");
    customHTML.append("})\n</script>\n");
}