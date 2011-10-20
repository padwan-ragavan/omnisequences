const simpleStorage = require("simple-storage").storage;
const version = "1.1.4";

var defaultFunctionData = {
    goToHomePage: 'function() {\r\nlocation.href = location.protocol + "//" + location.hostname;\r\n}',
    goOneLevelUp: 'function() {\r\n' +
            '    var lastPathRegex = /.*(\\/.*?)$/;\r\n' +
            '    var fullPath = location.pathname;\r\n' +
            '    fullPath = fullPath.replace(/\\/$/,"");\r\n' +
            '    var matchingGroups = lastPathRegex.exec(fullPath);\r\n' +
            '    var finalPath = fullPath;\r\n' +
            '    if (matchingGroups.length == 2) {\r\n' +
            '        var matchAtEnd = new RegExp(matchingGroups[1] + "$");\r\n' +
            '        finalPath = fullPath.replace(matchAtEnd, "");\r\n' +
            '    }\r\n' +
            ' location.href = finalPath ? finalPath : "/";\r\n' +
            '}',
    attachJQuery: 'function() {\r\n' +
            '    var jqueryLive = $("<script src=\'http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js\' type=\'text/javascript\'/>");\r\n' +
            '    jqueryLive;\r\n' +
            '    $("body").append(jqueryLive);\r\n' +
            '}',
    moveToNextElement: 'function(matches){\r\n' +
            '   var elementIdInFocus = -1;\r\n' +
            '   var omniSequenceClassRegex = /omniSequenceInFocus/;\r\n' +
            '   for(var index=0;index<matches.length;index++){\r\n' +
            '       elementIdInFocus = index;\r\n' +
            '       if(omniSequenceClassRegex.test(matches[index].className)){\r\n' +
            '           break;\r\n' +
            '       }\r\n' +
            '   }\r\n' +
            '   var elementIdToFocus = (elementIdInFocus + 1) % matches.length;\r\n' +
            '   if(matches.length > 0){\r\n' +
            '       $(matches[elementIdToFocus]).addClass("omniSequenceInFocus");\r\n' +
            '       var top = $(matches[elementIdToFocus]).offset().top;\r\n' +
            '       window.scrollTo(0,top - (window.screen.height / 3));\r\n' +
            '       $(matches[elementIdInFocus]).toggleClass("omniSequenceInFocus");\r\n' +
            '   }\r\n' +
            '}',
    moveToPrevElement: 'function(matches){\r\n' +
            '   var elementIdInFocus = -1;\r\n' +
            '   var omniSequenceClassRegex = /omniSequenceInFocus/;\r\n' +
            '   for(var index=0;index<matches.length;index++){\r\n' +
            '       elementIdInFocus = index;\r\n' +
            '       if(omniSequenceClassRegex.test(matches[index].className)){\r\n' +
            '           break;\r\n' +
            '       }\r\n' +
            '   }\r\n' +
            '   var elementIdToFocus = (elementIdInFocus + matches.length - 1) % matches.length;\r\n' +
            '   if(matches.length > 0){\r\n' +
            '       $(matches[elementIdToFocus]).addClass("omniSequenceInFocus");\r\n' +
            '       var top = $(matches[elementIdToFocus]).offset().top;\r\n' +
            '       window.scrollTo(0,top - (window.screen.height / 3));\r\n' +
            '       $(matches[elementIdInFocus]).toggleClass("omniSequenceInFocus");\r\n' +
            '   }\r\n' +
            '}',
    clickIfInsideSameSite: 'function(matches){\r\n' +
            'for(var match in matches){\r\n' +
            'if(matches[match].hostname == location.hostname){\r\n' +
            '       matches[match].click();\r\n' +
            '   }\r\n' +
            '}\r\n' +
            '}',
    openFirstLinkInside: 'function(matches){\r\n' +
            '      var firstLinkInside = matches.find("a");\r\n' +
            '      if(firstLinkInside.length >0){\r\n' +
            '       firstLinkInside[0].click();\r\n' +
            '       }' +
            '}',
    focus:'function(matches){\r\n' +
            'if(matches.length > 0){\r\n' +
            '   matches[0].focus();\r\n' +
            '}\r\n' +
            '}',
    promptForPostId:'function(){\r\n' +
            'var newPostId = prompt("Enter Post Id","");\r\n' +
            'var postUrl = location.href;\r\n' +
            'var postUrlRegEx = /(postid)=(\d+)/i;\r\n' +
            'var matches = postUrlRegEx.exec(postUrl);\r\n' +
            'if(matches!=null && matches.length == 3){\r\n' +
            '    var newPost = matches[1] + "=" + newPostId;\r\n' +
            '    location.href = postUrl.replace(postUrlRegEx, newPost);\r\n' +
            '}else{\r\n' +
            '    alert("current location does not have a postId");\r\n' +
            '}\r\n' +
            '}',
    show:'function(matches){\r\n' +
            'matches.show();' +
            '}'
};

var defaultRuleSet = {
    name: 'defaultRuleSet',
    shortcuts: [
        {key1:'g',key2:'i',matchers:'',shortcutFunction:'goToHomePage', cache: true},
        {key1:'a',key2:'j',matchers:'',shortcutFunction:'attachJQuery', cache: true},
        {key1:'u',key2:'',matchers:'',shortcutFunction:'goOneLevelUp', cache: true},
        {key1:'j',key2:'',matchers:'[id*="post"]:visible,[id*="Post"]:visible,[id*="Story"]:visible,[id*="story"]:visible',shortcutFunction:'moveToNextElement', cache: true},
        {key1:'k',key2:'',matchers:'[id*="post"]:visible,[id*="Post"]:visible,[id*="Story"]:visible,[id*="story"]:visible',shortcutFunction:'moveToPrevElement', cache: true},
        {key1:'n',key2:'',matchers:'a:contains("next"),a:contains("Next")',shortcutFunction:'clickIfInsideSameSite', cache: true},
        {key1:'p',key2:'',matchers:'a:contains("prev"),a:contains("Prev"),a:contains("previous"),a:contains("Previous")',shortcutFunction:'clickIfInsideSameSite', cache: true},
        {key1:'o',key2:'',matchers:'.omniSequenceInFocus',shortcutFunction:'openFirstLinkInside', cache: false},
        {key1:'q',key2:'',matchers:'input[id*=Search],input[id*=search],input[name=s],input[id=q],input[name=q],input[id=s]',shortcutFunction:'focus', cache: true},
        {key1:'g',key2:'p',matchers:'',shortcutFunction:'promptForPostId', cache: true},
        {key1:'s',key2:'h',matchers:'.omniSequenceHelp',shortcutFunction:'show', cache: true}
    ],
    applyTo: ['http://*','file://*'],
    dontApplyTo: ['*.google.*']
};

var fetchOmniShortcuts = function() {
    checkForUpgrade();
    var omnishortcuts = simpleStorage.omniShortcuts ? simpleStorage.omniShortcuts : {};
    if (omnishortcuts.functionData == null) {
        omnishortcuts.functionData = defaultFunctionData;
    }
    if (omnishortcuts.rules == null) {
        omnishortcuts.rules = [defaultRuleSet];
    }
    return omnishortcuts;
};

var saveOmniShortcuts = function(omniShortcutData) {
    omniShortcutData.version = version;
    simpleStorage.omniShortcuts = omniShortcutData;
};

var restoreDefaults = function(){
    simpleStorage.omniShortcuts = null;
};

exports.fetchOmniShortcuts = fetchOmniShortcuts;
exports.saveOmniShortcuts = saveOmniShortcuts;
exports.restoreDefaults = restoreDefaults;

var checkForUpgrade = function() {
    var shortcutData = simpleStorage.omniShortcuts ? simpleStorage.omniShortcuts : {};
    if (shortcutData.version == version) {
        return;
    }
    saveOmniShortcuts({rules: [defaultRuleSet], functionData: defaultFunctionData});
};