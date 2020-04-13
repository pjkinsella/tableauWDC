(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "fetchDate",
			alias: "Date",
            dataType: tableau.dataTypeEnum.datetime
        }, {
			id: "colorValue",
            alias: "Color",
           dataType: tableau.dataTypeEnum.string
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

        var tableSchema = {
            id: "kbfTasks",
            alias: "KanBanFlow Task Data",
            columns: cols,
			incrementColumnId: "fetchDate"
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
		
		var lastId = table.incrementValue;
		
        //$.getJSON("https://cors-anywhere.herokuapp.com/https://kanbanflow.com/api/v1/tasks?apiToken=<kbfApiKey>", function(resp) {
		$.ajax({
				headers: {
					"Authorization":  "Basic " + btoa("apiToken:<kbfApiKey>")
				},
				dataType: "json",
				url: "https://cors-anywhere.herokuapp.com/https://kanbanflow.com/api/v1/tasks",
				success: function(resp) {
            var feat = resp,
                tableData = [],
				d = new Date();

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
				for (var j = 0, len2 = feat[i].tasks.length; j < len2; j++) {
					tableData.push({
						"fetchDate": d,
						"colorValue": feat[i].tasks[j].color,
						"colId": feat[i].tasks[j].columnId,
						"swimId": feat[i].tasks[j].swimlaneId,
						"taskId": feat[i].tasks[j]._id
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
            tableau.connectionName = "KanBanFlow Task Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
