const {Cc,Ci} = require("chrome");
const windowUtils = require("window-utils");

var getExportFileName = function() {
    var filePicker = Cc['@mozilla.org/filepicker;1']
        .createInstance(Ci.nsIFilePicker);
    filePicker.init(windowUtils.activeBrowserWindow, "Export Omnisequences", Ci.nsIFilePicker.modeSave);
    filePicker.appendFilter("*.json", "*.json");
    var show = filePicker.show();
    if(show != Ci.nsIFilePicker.returnCancel) {
        var fileName = filePicker.file.persistentDescriptor;
        if(/.json$/.test(fileName)) {
            return fileName;
        } else {
            return fileName + ".json";
        }
    }
    return null;
};

exports.getExportFileName = getExportFileName;