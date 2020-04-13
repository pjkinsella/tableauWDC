(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "columnName",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "colId",
            alias: "column-id",
           dataType: tableau.dataTypeEnum.string
        }, {
            id: "totCols",
            alias: "total columns",
            dataType: tableau.dataTypeEnum.string
        //}, {
        //   id: "location",
        //    dataType: tableau.dataTypeEnum.geometry
        }];

        var tableSchema = {
            id: "kbfTasks",
            alias: "KanBanFlow Task Data",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://cors-anywhere.herokuapp.com/https://kanbanflow.com/api/v1/board?apiToken=<kbfApiKey>", function(resp) {
            var feat = resp.columns,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "columnName": feat[i].name,
                    "colId": feat[i].uniqueId,
                    "totCols": feat.length
                    //"location": feat[i].geometry
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "KanBanFlow Task Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
