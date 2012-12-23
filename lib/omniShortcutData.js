const simpleStorage = require("simple-storage").storage;
const fileIO = require("fileIO");
const version = "1.2.2";

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
    moveToNextElement: 'function(matches){\r\n' +
            '   matches = matches.filter(":visible");\r\n' +
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
            '       $(matches[elementIdInFocus]).removeClass("omniSequenceInFocus");\r\n' +
            '   }\r\n' +
            '}',
    moveToPrevElement: 'function(matches){\r\n' +
            '   matches = matches.filter(":visible");\r\n' +
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
            '       $(matches[elementIdInFocus]).removeClass("omniSequenceInFocus");\r\n' +
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
    clickWebMailCheckBox:'function(matches){\r\n' +
            '   matches.click();\r\n' +
            '   matches.parent().parent().addClass("omniSequenceInFocus");\r\n' +
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
            '}',
    moveToNextWebMail:'function(matches){\r\n' +
            '    if(matches.is("tr"))\r\n' +
            '        this.moveToNextElement(matches);\r\n' +
            '    else\r\n' +
            '         this.clickIfInsideSameSite(matches);\r\n' +
            '}',
    moveToPrevWebMail:'function(matches){\r\n' +
            '    if(matches.is("tr"))\r\n' +
            '        this.moveToPrevElement(matches);\r\n' +
            '    else\r\n' +
            '         this.clickIfInsideSameSite(matches);\r\n' +
            '}'
};

var defaultRuleSet = {
    name: 'defaultRuleSet',
    shortcuts: [
        {key1:'g',key2:'i',matchers:'',shortcutFunction:'goToHomePage', cache: true},
        {key1:'u',key2:'',matchers:'',shortcutFunction:'goOneLevelUp', cache: true},
        {key1:'j',key2:'',matchers:'[id*="ost"],[id*="tory"]',shortcutFunction:'moveToNextElement', cache: true},
        {key1:'k',key2:'',matchers:'[id*="ost"],[id*="tory"]',shortcutFunction:'moveToPrevElement', cache: true},
        {key1:'n',key2:'',matchers:'a:contains("next"),a:contains("Next")',shortcutFunction:'clickIfInsideSameSite', cache: true},
        {key1:'p',key2:'',matchers:'a:contains("prev"),a:contains("Prev"),a:contains("previous"),a:contains("Previous")',shortcutFunction:'clickIfInsideSameSite', cache: true},
        {key1:'o',key2:'',matchers:'.omniSequenceInFocus',shortcutFunction:'openFirstLinkInside', cache: false},
        {key1:'q',key2:'',matchers:'input[id*=earch],input#q,input[name=q],input#s,input[name=s]',shortcutFunction:'focus', cache: true},
        {key1:'g',key2:'p',matchers:'',shortcutFunction:'promptForPostId', cache: true},
        {key1:'s',key2:'h',matchers:'.omniSequenceHelp',shortcutFunction:'show', cache: true}
    ],
    applyTo: ['http://*','file://*'],
    dontApplyTo: ['*.google.*']
};

var webmailRuleSet = {
    name: 'webmail Rule Set',
    shortcuts:[
            {key1:'u',key2:'',matchers:'',shortcutFunction:'goOneLevelUp', cache: true},
            {key1:'g',key2:'i',matchers:'',shortcutFunction:'goToHomePage', cache: true},
            {key1:'g',key2:'s',matchers:'a[title="Sent Items"]',shortcutFunction:'clickIfInsideSameSite', cache: true}, {key1:'g',key2:'d',matchers:'a[title="Drafts"]',shortcutFunction:'clickIfInsideSameSite', cache: true},
            {key1:'g',key2:'t',matchers:'a[title="Deleted Items"]',shortcutFunction:'clickIfInsideSameSite', cache: true},
            {key1:'g',key2:'j',matchers:'a[title="Junk E-mail"]',shortcutFunction:'clickIfInsideSameSite', cache: true},
            {key1:'j',key2:'',matchers:'.cntnt > table > tbody > tr:gt(1),#lnkHdrnext',shortcutFunction:'moveToNextWebMail', cache: true},
            {key1:'k',key2:'',matchers:'.cntnt > table > tbody > tr:gt(1),#lnkHdrprevious',shortcutFunction:'moveToPrevWebMail', cache: true},
            {key1:'c',key2:'',matchers:'#lnkHdrnewmsg',shortcutFunction:'clickIfInsideSameSite', cache: true},
            {key1:'ll',key2:'',matchers:'#lnkHdrcheckmessages',shortcutFunction:'clickIfInsideSameSite', cache: true},
            {key1:'o',key2:'',matchers:'.omniSequenceInFocus a',shortcutFunction:'clickIfInsideSameSite', cache: false},
            {key1:'x',key2:'',matchers:'.omniSequenceInFocus input:checkbox',shortcutFunction:'clickWebMailCheckBox', cache: false},
            {key1:'r',key2:'',matchers:'#lnkHdrreply',shortcutFunction:'clickIfInsideSameSite', cache: true},
            {key1:'a',key2:'',matchers:'#lnkHdrreplyall',shortcutFunction:'clickIfInsideSameSite', cache: true},
            {key1:'f',key2:'',matchers:'#lnkHdrforward',shortcutFunction:'clickIfInsideSameSite', cache: true},
            {key1:'q',key2:'',matchers:'#txtSch',shortcutFunction:'focus', cache: true},
            {key1:'m',key2:'r',matchers:'#lnkHdrmarkread',shortcutFunction:'clickIfInsideSameSite', cache: true},
            {key1:'m',key2:'u',matchers:'#lnkHdrmarkunread',shortcutFunction:'clickIfInsideSameSite', cache: true},
            {key1:'m',key2:'i',matchers:'#lnkHdrmarkread',shortcutFunction:'clickIfInsideSameSite', cache: true},
            {key1:'n',key2:'',matchers:'#lnkHdrnewmsg',shortcutFunction:'clickIfInsideSameSite', cache: true},
            {key1:'s',key2:'h',matchers:'.omniSequenceHelp',shortcutFunction:'show', cache: true}
    ],
    applyTo: ['https://webmail*'],
    dontApplyTo: []
};

var defaultRuleSets = [defaultRuleSet, webmailRuleSet];

var fetchOmniShortcuts = function() {
    checkForUpgrade();
    var omnishortcuts = simpleStorage.omniShortcuts ? simpleStorage.omniShortcuts : {};
    if (omnishortcuts.functionData == null) {
        omnishortcuts.functionData = defaultFunctionData;
    }
    if (omnishortcuts.rules == null) {
        omnishortcuts.rules = defaultRuleSets;
    }
    return omnishortcuts;
};

var saveOmniShortcuts = function(omniShortcutData) {
    omniShortcutData.version = version;
    simpleStorage.omniShortcuts = omniShortcutData;
    fileIO.writeFunctionData(omniShortcutData.functionData);
};

var restoreDefaults = function() {
    simpleStorage.omniShortcuts = null;
};

var checkForUpgrade = function() {
    var shortcutData = simpleStorage.omniShortcuts ? simpleStorage.omniShortcuts : {};
    if (shortcutData.version == version) {
        return;
    }
    var existingRules = shortcutData.rules;
    var existingFunctionData = shortcutData.functionData;
    var newRules = defaultRuleSets;
    if (existingRules != null) {
        for (var i in existingRules) {
            if (existingRules[i].name != defaultRuleSet.name && existingRules[i].name != webmailRuleSet.name) {
                newRules.push(existingRules[i]);
            }
        }
    }
    var newFunctionData = defaultFunctionData;
    for (var i in existingFunctionData) {
        if (newFunctionData[i] == null) {
            newFunctionData[i] = existingFunctionData[i];
        }
    }
    saveOmniShortcuts({rules: newRules, functionData: newFunctionData});
};

var isDefault = function(functionName) {
    return defaultFunctionData[functionName] != null;
};

exports.fetchOmniShortcuts = fetchOmniShortcuts;
exports.saveOmniShortcuts = saveOmniShortcuts;
exports.restoreDefaults = restoreDefaults;
exports.isDefault = isDefault;
