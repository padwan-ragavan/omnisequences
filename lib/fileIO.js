const file =  require("file");
const dirIO = require("dirIO")

var writeToFile = function(fileName, content){
    var filePath = file.join(omniSequenceDirectory(),fileName);
    console.log("writing to file - " + filePath + " " + content);
    var fileWriter = file.open(filePath,"w");
    fileWriter.write(content);
    fileWriter.flush();
    fileWriter.close();
    console.log("write done");
};

var writeFunctionData = function(content){
    writeToFile("functionData",content);
};

var omniSequenceDirectory = function(){
    var omniSequenceDir = file.join(dirIO.getProfileDirector(),"omnisequences");
    console.log("creating " + omniSequenceDir);
    file.mkpath(omniSequenceDir);
    return omniSequenceDir;
}


exports.writeFunctionData = writeFunctionData;