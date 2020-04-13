(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
		
		//KBF Columns Table
        var column_cols = [{
            id: "fetchDate",
			alias: "Date",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "colId",
            alias: "Column ID",
           dataType: tableau.dataTypeEnum.string
        }, {
            id: "colName",
            alias: "Column Name",
            dataType: tableau.dataTypeEnum.string
        }];

        var columnTable = {
            id: "kbfColumns",
            alias: "KanBanFlow Column Data",
            columns: column_cols,
			incrementColumnId: "fetchDate"
        };
		
		//KBF Swimlanes Table
		var swimlane_cols = [{
            id: "fetchDate",
			alias: "Date",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "swimId",
            alias: "Swimlane ID",
           dataType: tableau.dataTypeEnum.string
        }, {
            id: "swimName",
            alias: "Swimlane Name",
            dataType: tableau.dataTypeEnum.string
        }];

        var swimlaneTable = {
            id: "kbfSwimlanes",
            alias: "KanBanFlow Swimlane Data",
            columns: swimlane_cols,
			incrementColumnId: "fetchDate"
        };
		
		//KBF Colors Table
		var color_cols = [{
            id: "fetchDate",
			alias: "Date",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "colorValue",
            alias: "Color",
           dataType: tableau.dataTypeEnum.string
        }, {
            id: "colorName",
            alias: "Color Meaning",
            dataType: tableau.dataTypeEnum.string

        }];

        var colorTable = {
            id: "kbfColors",
            alias: "KanBanFlow Color Data",
            columns: color_cols,
			incrementColumnId: "fetchDate"
        };

        schemaCallback([columnTable, swimlaneTable, colorTable]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
		var lastId = table.incrementValue;
		

			//$.getJSON("https://cors-anywhere.herokuapp.com/https://kanbanflow.com/api/v1/board?apiToken=<kbfApiKey>", function(resp) {
			$.ajax({
				headers: {
					"Authorization":  "Basic " + btoa("apiToken:<kbfApiKey>")
				},
				dataType: "json",
				url: "https://cors-anywhere.herokuapp.com/https://kanbanflow.com/api/v1/board",
				success: function(resp) {
				
				var feat = resp,
					tableData = [],
					d = new Date(),
					i = 0;

				if (table.tableInfo.id == "kbfColumns") {
					// Iterate over the JSON object
					for (i = 0, len = feat.columns.length; i < len; i++) {
						tableData.push({
							"fetchDate": d,
							"colId": feat.columns[i].uniqueId,
							"colName": feat.columns[i].name
						});
					}
				}
				
				if (table.tableInfo.id == "kbfSwimlanes") {
					// Iterate over the JSON object
					for (i = 0, len = feat.swimlanes.length; i < len; i++) {
						tableData.push({
							"fetchDate": d,
							"swimId": feat.swimlanes[i].uniqueId,
							"swimName": feat.swimlanes[i].name
						});
					}
				}
				
				if (table.tableInfo.id == "kbfColors") {
					// Iterate over the JSON object
					for (i = 0, len = feat.colors.length; i < len; i++) {
						tableData.push({
							"fetchDate": d,
							"colorValue": feat.colors[i].value,
							"colorName": feat.colors[i].name
						});
					}
				}

				table.appendRows(tableData);
				doneCallback();

			}});

    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "KanBanFlow Board Tables"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
