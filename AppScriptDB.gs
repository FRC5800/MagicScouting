function doGet(e){
  Logger.log(e.parameter)
  console.log(e.parameter)
  if (e.parameter["sheet"] == "MagicScouting"){
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("MagicScouting");
  }else if(e.parameter["sheet"] == "PitScouting"){
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PitScouting");
  }else{
    return ContentService
        .createTextOutput(JSON.stringify({status:"Bad request"}))
        .setMimeType(ContentService.MimeType.JSON);
  }
  const data = sheet.getDataRange().getValues();

  return ContentService
        .createTextOutput(JSON.stringify({status:"success", "data":data}))
        .setMimeType(ContentService.MimeType.JSON);

}

function doPost(e) {

  try {
    const pairTeamMatch = getTeamAndMatch();
    const newEntryTeamMatch = [parseInt(e.parameters["teamNumber"][0]), parseInt(e.parameters["matchNumber"][0])];

    let repeated = false;
    for (let i = 0; i < pairTeamMatch.length; i++){
      if (pairTeamMatch[i][0] == newEntryTeamMatch[0] && pairTeamMatch[i][1] == newEntryTeamMatch[1]){
        repeated=true
        break;
      }
    }

    if(!repeated){
      record_data(e);
    }
    var response = {
                    "result":"success",
                    "repeated": repeated
                   };
  } catch(error) {
    var response = {
                    "result":"error",
                    "error": String(error)
                   };
  }
  return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);

}

function getTeamAndMatch() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getRange(1,2,sheet.getLastRow(),2).getValues();
  data.shift();
  return data;
}

function record_data(e) {
  var lock = LockService.getDocumentLock();
  lock.waitLock(30000);

  try {
    var sheet = SpreadsheetApp.getActiveSheet();

    var oldHeader = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var newHeader = oldHeader.slice();
    var fieldsFromForm = getDataColumns(e.parameters);

    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();


    var row = [datetime];

    for (var i = 1; i < oldHeader.length; i++) {
      var field = oldHeader[i];
      var output = getFieldFromData(field, e.parameters);
      row.push(output);

      var formIndex = fieldsFromForm.indexOf(field);
      if (formIndex > -1) {
        fieldsFromForm.splice(formIndex, 1);
      }
    }

    for (var i = 0; i < fieldsFromForm.length; i++) {
      var field = fieldsFromForm[i];
      var output = getFieldFromData(field, e.parameters);
      row.push(output);
      newHeader.push(field);
    }

    var nextRow = sheet.getLastRow() + 1; // get next row
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);

    if (newHeader.length > oldHeader.length) {
      sheet.getRange(1, 1, 1, newHeader.length).setValues([newHeader]);
    }
  }
  catch(error) {
    Logger.log(error);
  }
  finally {
    lock.releaseLock();
    return;
  }

}

function getDataColumns(data) {
  return Object.keys(data).filter(function(column) {
    return !(column === 'formDataNameOrder' || column === 'formGoogleSheetName' || column === 'formGoogleSendEmail' || column === 'honeypot');
  });
}

function getFieldFromData(field, data) {
  var values = data[field] || '';
  var output = values.join ? values.join(', ') : values;
  return output;
}
