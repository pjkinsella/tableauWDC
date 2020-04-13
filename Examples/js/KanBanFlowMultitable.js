(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
		
		//KBF Columns Table
        var column_cols = [{
            id: "fetchDate",
			alias: "Date",
            dataType: tableau.dataTypeEnum.date
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
            columns: column_cols
        };
		
		//KBF Swimlanes Table
		var swimlane_cols = [{
            id: "fetchDate",
			alias: "Date",
            dataType: tableau.dataTypeEnum.date
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
            columns: swimlane_cols
        };
		
		//KBF Colors Table
		var color_cols = [{
            id: "fetchDate",
			alias: "Date",
            dataType: tableau.dataTypeEnum.date
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
            columns: color_cols
        };
		
		//KBF Task Table
        var task_cols = [{
            id: "fetchDate",
			alias: "Date",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "colId",
            alias: "Column ID",
           dataType: tableau.dataTypeEnum.string
        }, {
            id: "swimId",
            alias: "Swimlane ID",
            dataType: tableau.dataTypeEnum.string
        }, {
           id: "taskId",
		   alias: "Task ID",
            dataType: tableau.dataTypeEnum.string
        }];

        var taskTable = {
            id: "kbfTasks",
            alias: "KanBanFlow Task Data",
            columns: task_cols
        };

        schemaCallback([columnTable, swimlaneTable, colorTable, taskTable]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
		if (table.tableInfo.id == "kbfColumns" || table.tableInfo.id == "kbfSwimlanes" || table.tableInfo.id == "kbfColors") {
			$.getJSON("https://cors-anywhere.herokuapp.com/https://kanbanflow.com/api/v1/board?apiToken=<kbfApiKey>", function(resp) {
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

			});
		} else {
			
			$.getJSON("https://cors-anywhere.herokuapp.com/https://kanbanflow.com/api/v1/tasks?apiToken=<kbfApiKey>", function(resp) {
				var feat = resp,
					tableData = [],
					d = new Date();

				if (table.tableInfo.id == "kbfTasks") {
					// Iterate over the JSON object
					for (var i = 0, len = feat.length; i < len; i++) {
						for (var j = 0, len2 = feat[i].tasks.length; j < len2; j++) {
							tableData.push({
								"fetchDate": d,
								"colId": feat[i].tasks[j].columnId,
								"swimId": feat[i].tasks[j].swimlaneId,
								"taskId": feat[i].tasks[j]._id
							});
						}
					}
				}

				table.appendRows(tableData);
				
			});
		}
	doneCallback();
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
