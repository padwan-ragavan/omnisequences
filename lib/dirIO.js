var {Cc,Ci} = require("chrome");

var getProfileDirector = function() {
    return Cc['@mozilla.org/file/directory_service;1']
            .createInstance(Ci.nsIProperties)
            .get('ProfD', Ci.nsIFile).path;
};

exports.getProfileDirector = getProfileDirector;