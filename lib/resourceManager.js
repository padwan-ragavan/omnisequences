var {Cc,Ci} = require("chrome");
const file = require("file");
const fileIO = require("fileIO");
const omnisequences = "omnisequences";
var functionDataFile = "";

const initResource = function() {
    var functionDataPath = fileIO.getFunctionDataFilePath();
    functionDataFile = file.basename(functionDataPath);
    const omnisequencesDir = file.dirname(functionDataPath);
    var ioService = Cc["@mozilla.org/network/io-service;1"]
            .getService(Ci.nsIIOService);
    var resProt = ioService.getProtocolHandler("resource")
            .QueryInterface(Ci.nsIResProtocolHandler);
    var aliasFile = Cc["@mozilla.org/file/local;1"]
            .createInstance(Ci.nsILocalFile);
    aliasFile.initWithPath(omnisequencesDir);
    var aliasURI = ioService.newFileURI(aliasFile);
    resProt.setSubstitution(omnisequences, aliasURI);
};

const getFunctionDataResource = function(){
    return "resource://" + omnisequences + "/" + functionDataFile;
};

exports.initResource = initResource;
exports.getFunctionDataResource = getFunctionDataResource;