const file =  require("file");
const functionDataFileName = "functionData.js";
const dirIO = require("dirIO")

var writeToFile = function(filePath, content){
    console.log("writing to file - " + filePath + " " + content);
    var fileWriter = file.open(filePath,"w");
    fileWriter.write(content);
    fileWriter.flush();
    fileWriter.close();
    console.log("write done");
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

var omniSequenceDirectory = function(){
    var omniSequenceDir = file.join(dirIO.getProfileDirector(),"omnisequences");
    console.log("creating " + omniSequenceDir);
    file.mkpath(omniSequenceDir);
    return omniSequenceDir;
}

var getFunctionDataFilePath = function(){
    return file.join(omniSequenceDirectory(),functionDataFileName);
};

exports.writeFunctionData = writeFunctionData;
exports.getFunctionDataFilePath = getFunctionDataFilePath;