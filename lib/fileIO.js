const file =  require("file");
const dirIO = require("dirIO")

var writeToFile = function(fileName, content){
    var filePath = file.join(omniSequenceDirectory(),fileName);
    var fileWriter = file.open(filePath,"w");
    fileWriter.write(content);
    fileWriter.flush();
    fileWriter.close();
};



var omniSequenceDirectory = function(){
    return file.join(dirIO.getProfileDirector(),"omnisequences");
}