var {Cc,Ci} = require("chrome");


exports.get = function(){
                            try{
                             return Cc['@mozilla.org/file/directory_service;1']
							.createInstance(Ci.nsIProperties)
							.get('ProfDefNoLoc', Ci.nsIFile).path;
							}catch(e){
							    return "Err";
							}
						};