const fileIO =  require("fileIO");
const filePicker =  require("filePicker");
const omniShortcutDataStore = require("omniShortcutData");

var importSequences = function() {
    var importFileName = filePicker.getImportFileName();
    if(importFileName == null) {
        return false;
    }
    var omnisequences = omniShortcutDataStore.fetchOmniShortcuts();
    var importStr = fileIO.read(importFileName);
    var importData = JSON.parse(importStr);
    if (importData.rules != null) {
        omnisequences.rules = omnisequences.rules.concat(importData.rules);
    }
    if (importData.functionData != null) {
        for (let [functionName,functionDefinition] in importData.functionData) {
            if(!omniShortcutDataStore.isDefault(functionName))
                omnisequences.functionData[functionName] = functionDefinition;
        }
    }
    omniShortcutDataStore.saveOmniShortcuts(omnisequences);
    return true;
};

exports.importSequences = importSequences;