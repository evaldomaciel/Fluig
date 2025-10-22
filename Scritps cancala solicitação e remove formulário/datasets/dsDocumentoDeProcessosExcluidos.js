function defineStructure() {
    addColumn("NR_DOCUMENTO", DatasetFieldType.STRING)
    addColumn("NR_DOCUMENTO_PAI", DatasetFieldType.STRING)
    addColumn("COD_MIME_TYPE", DatasetFieldType.STRING)
    addColumn("CDOCUMENT_ID", DatasetFieldType.STRING)
    addColumn("Existencia_na_Anexo_Proces", DatasetFieldType.STRING)
    setKey(["NR_DOCUMENTO"]);
    addIndex(["NR_DOCUMENTO", "NR_DOCUMENTO_PAI"]);
}
function onSync(lastSyncDate) {
    return geraDataset(true);
}

function createDataset(fields, constraints, sortFields) {
    return geraDataset(false);
}

function geraDataset(sync) {
    var newDataset = DatasetBuilder.newDataset();
    var query = "  SELECT DISTINCT " +
        "\n DOCUMENTO.NR_DOCUMENTO, DOCUMENTO.NR_DOCUMENTO_PAI, DOCUMENTO.COD_MIME_TYPE, " +
        "\n CASE WHEN  DOCUMENTO.NR_DOCUMENTO > 0 THEN DOCUMENTO.NR_DOCUMENTO ELSE 0 END  AS DOCUMENT_ID, " +
        "\n     CASE " +
        "\n         WHEN anexo_proces.NR_DOCUMENTO IS NOT NULL THEN 'PROCESSO_ENCONTRADO' " +
        "\n         ELSE 'PROCESSO_REMOVIDO' " +
        "\n     END AS 'Existencia_na_Anexo_Proces' " +
        "\n FROM DOCUMENTO " +
        "\n LEFT JOIN anexo_proces ON anexo_proces.NR_DOCUMENTO = DOCUMENTO.NR_DOCUMENTO and anexo_proces.COD_EMPRESA = 1 " +
        "\n WHERE " +
        "\n COD_MIME_TYPE = 'application/octet-stream' " +
        "\n AND  DOCUMENTO.COD_EMPRESA = 1 " +
        "\n AND  DOCUMENTO.VERSAO_ATIVA = true " +
        "\n AND  NR_DOCUMENTO_PAI IN (1860, 28, 186, 27, 2513, 650, 624, 2397, 3402, 3327, 1450)  " +
        "\n AND  anexo_proces.NR_DOCUMENTO IS NULL  " +
        "\n ORDER BY DOCUMENTO.NR_DOCUMENTO DESC LIMIT 100000  ";

    log.info(query)

    var dataSource = '/jdbc/AppDS';
    var conn = null;
    var stmt = null;
    var rs = null;
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    try {
        conn = ds.getConnection(); /* java.sql.DriverManager */
        stmt = conn.createStatement();
        if (query.indexOf('DELETE') >= 0 || query.indexOf('UPDATE') >= 0) {
            rs = stmt.executeUpdate(query);
            newDataset.addColumn('REGISTROS_ATUALIZADOS');
            newDataset.addRow([parseInt(rs)]);
        }
        else {
            {
                rs = stmt.executeQuery(query);
                var columnCount = rs.getMetaData().getColumnCount();
                for (var i = 1; i <= columnCount; i++) {
                    newDataset.addColumn(rs.getMetaData().getColumnName(i));
                }
                var eliminado = "";
                while (rs.next()) {
                    var Arr = new Array();
                    for (var i = 1; i <= columnCount; i++) {
                        var obj = rs.getObject(rs.getMetaData().getColumnName(i));
                        if (null != obj) {
                            if (rs.getMetaData().getColumnName(i) == "DOCUMENT_ID") Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString() + ": " + eliminar(rs.getObject(rs.getMetaData().getColumnName(i)).toString());
                            else Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
                        }
                        else {
                            Arr[i - 1] = 'null';
                        }
                    }
                    if (sync) newDataset.addOrUpdateRow(Arr);
                    else newDataset.addRow(Arr);
                }
            }
        }
        if (rs != null && rs <= 0) rs.close();
        if (stmt != null) stmt.close();
        if (conn != null) conn.close();
    } catch (e) {
        newDataset.addColumn('QUERY');
        newDataset.addColumn('ERROR');
        if (sync) newDataset.addOrUpdateRow([e.message, e.lineNumber]);
        else newDataset.addRow([e.message, e.lineNumber]);
    }
    return newDataset;
}

function eliminar(docId) {
    try {
        var clientService = fluigAPI.getAuthorizeClientService();

        var data = {
            companyId: String(getValue("WKCompany")),
            serviceCode: 'FluigAPI',
            endpoint: '/api/public/2.0/documents/deleteDocument/' + String(docId),
            method: 'POST',
            timeoutService: '120', // segundos
            params: {}
        }
        var vo = clientService.invoke(JSONUtil.toJSON(data));

        if (vo.getResult() == null || vo.getResult().isEmpty()) {
            return String(docId + ": vazio");
        } else {
            return String(JSONUtil.toJSON(vo.getResult()));
        }
    } catch (error) {
        throw error;
    }
}