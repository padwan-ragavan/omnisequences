const file =  require("file");
const functionDataFileName = "functionData.js";
const dirIO = require("dirIO");

var writeToFile = function(filePath, content) {
    var fileWriter = file.open(filePath, "w");
    fileWriter.write(content);
    fileWriter.flush();
    fileWriter.close();
};

function serializeJSONWithFunction(content) {
    var functionData = 'var omniSequencesFunctions = {';
    for (var fuctionName in content) {
        functionData += '"' + fuctionName + '"';
        functionData += ":";
        functionData += content[fuctionName] + ",";
    }
    functionData = functionData.replace(/,$/,"") + "}";
    return functionData;
}
var writeFunctionData = function(content){
    var serializedContent = serializeJSONWithFunction(content);
    writeToFile(getFunctionDataFilePath(), serializedContent);
};

var omniSequenceDirectory = function() {
    var omniSequenceDir = file.join(dirIO.getProfileDirector(), "omnisequences");
    file.mkpath(omniSequenceDir);
    return omniSequenceDir;
};

var getFunctionDataFilePath = function(){
    return file.join(omniSequenceDirectory(),functionDataFileName);
};

var read = function(fileName) {
    return file.read(fileName);
};

exports.writeFunctionData = writeFunctionData;
exports.getFunctionDataFilePath = getFunctionDataFilePath;
exports.writeToFile = writeToFile;
exports.read = read;