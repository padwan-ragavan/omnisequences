const fileIO =  require("fileIO");
const saveAsDialog =  require("saveAsDialog");
const omniShortcutDataStore = require("omniShortcutData");

var exportSequences = function(ruleNames) {
    var exportFileName = saveAsDialog.getExportFileName();
    var omnisequences = omniShortcutDataStore.fetchOmniShortcuts();
    var exportData = { };
    var existingRules = omnisequences.rules;
    var ruleMap = ruleNames.map(function(ruleName) {
        var r = { };
        return r[ruleName] = existingRules.filter(function(rule) { return rule.name == ruleName; })[0];
    });
    exportData["rules"] = ruleMap;
    fileIO.writeToFile(exportFileName, JSON.stringify(exportData));
};

exports.exportSequences = exportSequences;