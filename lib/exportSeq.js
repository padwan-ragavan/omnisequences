const fileIO =  require("fileIO");
const saveAsDialog =  require("saveAsDialog");
const omniShortcutDataStore = require("omniShortcutData");

var exportSequences = function(ruleNames) {
    var exportFileName = saveAsDialog.getExportFileName();
    var omnisequences = omniShortcutDataStore.fetchOmniShortcuts();
    var exportData = { };
    var existingRules = omnisequences.rules;
    var dependentFunctions = new Set();
    var rules = ruleNames.map(function(ruleName) {        
        var rule = existingRules.filter(function(er) { return er.name == ruleName; })[0];
        var nonDefaultFunctions = rule.shortcuts
            .map(function(s) { return s.shortcutFunction; })
            .filter(function(f) { return !omniShortcutDataStore.isDefault(f); });
        for (var f in nonDefaultFunctions) {
            dependentFunctions.add(f);
        }
        return rule;
    });
    var dependentFunctionMap = { };
    for (var f of dependentFunctions){
           dependentFunctionMap[f] = omnisequences.functionData[f];
       }
    exportData["rules"] = rules;
    exportData["functionData"] = dependentFunctionMap;
    fileIO.writeToFile(exportFileName, JSON.stringify(exportData));
};

exports.exportSequences = exportSequences;