const ESCAPE_KEYCODE = 27;
var shortcutsMap = {};
var functionData;
var keysPressed = '';
var functionScopeEncapsulator = {};

const omniSequenceCustomStyle = '<style type="text/css">' +
        '.omniSequenceInFocus {' +
        '    border-color: #FFFFFF !important;' +
        '    border-radius: 3px 3px 3px 3px;' +
        '    box-shadow: 0 0 6px #000000;' +
        '}\r\n' +
        '.omniSequenceHelp {' +
        'background-color: hsla(0, 0%, 0%, 0.9);' +
        'border-radius: 5px 5px 5px 5px;' +
        'color: hsl(120,50%,60%);' +
        'font-weight: bolder;' +
        'box-shadow: 0 0 6px hsl(0,0%,80%),0 0 5px 1024px hsla(0,0%,0%,0.6);' +
        'position: fixed;' +
        'top: 2%;' +
        'left:1%;' +
        'font-size: 16px;' +
        'display:none;' +
        'z-index:999' +
        '}\r\n' +
        '.omniSequenceHelpHeading{' +
        'color: white;' +
        'text-shadow: 1px 1px 1px hsl(240, 70%, 20%);' +
        'margin-bottom: 5px;' +
        'padding: 5px;' +
        'font-size: 1.2em;' +
        '}\r\n' +
        '.omniSequenceHelpHeading span{' +
        'margin:5px;' +
        'padding: 5px;' +
        '}\r\n' +
        '.omniSeqenceHelpList div span{' +
        'margin:10px;' +
        'padding: 5px;' +
        '}\r\n' +
        '.omniSeqenceHelpList div:nth-child(2n){' +
        'background-color: hsla(0, 0%, 70%, 0.9);' +
        'border-radius: 5px 5px 5px 5px;' +
        'color:hsl(0,0%,0%);' +
        '}\r\n' +
        '' +
        '</style>';//taken from jquery api focus
var keydownListener = function(event) {
    var focusedElement = document.activeElement.tagName.toUpperCase();
    if (focusedElement != 'INPUT' && focusedElement != 'TEXTAREA') {
        if (event.which == ESCAPE_KEYCODE) {
            keysPressed = '';
            $(".omniSequenceHelp").hide();
        } else {
            keysPressed += getStringFromKeyCode(event.which);
        }
        if (shortcutsMap[keysPressed]) {
            try {
                var shortcutData = shortcutsMap[keysPressed];
                if (functionScopeEncapsulator[shortcutData.shortcutFunction] == null)
                    eval('{functionScopeEncapsulator["' + shortcutData.shortcutFunction + '"] = ' + functionData[shortcutData.shortcutFunction] + '}');
                var cachedMatchers = shortcutData.cachedMatchers;
                if (cachedMatchers == null || !shortcutData.cache) {
                    shortcutData.cachedMatchers = $(shortcutData.matchers);
                    cachedMatchers = shortcutData.cachedMatchers;
                }
                functionScopeEncapsulator[shortcutData.shortcutFunction](cachedMatchers);
            } catch(e) {
                console.log(e);
            }
            keysPressed = '';
        }
        if (keysPressed.length >= 2) {
            keysPressed = '';
        }
    } else {
        keysPressed = '';
        if (event.which == ESCAPE_KEYCODE)
            $(document.activeElement).blur();
    }
    self.port.emit('keys-captured', keysPressed);
};


var bindSequences = function(omniSequences) {
    var rules = omniSequences.rules;
    functionData = omniSequences.functionData;
    if (!functionData || !rules) return;

    var omniSequenceHelpDiv = $("<div class='omniSequenceHelp'><div class='omniSequenceHelpHeading'><span>Sequence</span><span>Function</span><span>Matchers</span></div><div class='omniSeqenceHelpList'></div></div>");
    $("body").append(omniSequenceHelpDiv);
    var omniSequenceHelpList = $(".omniSeqenceHelpList");
    $.each(rules, function(index, rule) {
        var longestMatchingApplyToUrl = getLongestMatchingApplyToUrl(rule.applyTo);
        if (longestMatchingApplyToUrl && !isMatchingDontApplyToUrl(rule.dontApplyTo)) {
            var shortcuts = rule.shortcuts;
            $.each(shortcuts, function(index, shortcut) {
                var shortcutKey = (shortcut.key1 + shortcut.key2).toLowerCase();
                if (isShortcutNewOrMatchingUrlLongerThanPrevious(shortcutKey, longestMatchingApplyToUrl)) {
                    shortcutsMap[shortcutKey] = {};
                    shortcutsMap[shortcutKey]["matchers"] = shortcut.matchers;
                    shortcutsMap[shortcutKey]["shortcutFunction"] = shortcut.shortcutFunction;
                    shortcutsMap[shortcutKey]["applyTo"] = longestMatchingApplyToUrl;
                    shortcutsMap[shortcutKey]["cache"] = shortcut.cache;
                }
            });
        }
    });

    $.each(shortcutsMap, function(shortcutKey, shortcut) {
        var omniSequenceHelpItem = $("<div><span>" + shortcutKey + "</span><span>"+shortcut.shortcutFunction +"</span><span>" + shortcut.matchers+ "</span></div>");
        omniSequenceHelpList.append(omniSequenceHelpItem);
    });

    $(window).unbind('keydown.omnisequences');
    $("body").append($(omniSequenceCustomStyle));
    $(window).bind('keydown.omnisequences', keydownListener);
};

var isShortcutNewOrMatchingUrlLongerThanPrevious = function(shortcutKey, longestMatchingApplyToUrl) {
    return (shortcutsMap[shortcutKey] == null) || (shortcutsMap[shortcutKey] && (longestMatchingApplyToUrl.length > shortcutsMap[shortcutKey]["applyTo"].length));
};

var getLongestMatchingApplyToUrl = function(applyToUrls) {
    if (applyToUrls == null || applyToUrls.length == 0)
        return '*';
    var longestMatch = '';
    var currentLocation = window.location.href;
    $.each(applyToUrls, function(index, applyToUrl) {
        var applyToUrlForRegex = applyToUrl.replace(/\*/g, '.*');
        var urlRegex = new RegExp(applyToUrlForRegex, 'i');
        if (urlRegex.test(currentLocation) && (applyToUrl.length > longestMatch.length)) {
            longestMatch = applyToUrl;
        }
    });
    return longestMatch;
};

var isMatchingDontApplyToUrl = function(dontApplyToUrls) {
    var currentLocation = window.location.href;
    if (dontApplyToUrls == null || dontApplyToUrls.length == 0)
    var dontApply = false;
    $.each(dontApplyToUrls, function(index, dontApplyToUrl) {
        var dontApplyToUrlForRegex = dontApplyToUrl.replace(/\*/g, '.*');
        var urlRegex = new RegExp(dontApplyToUrlForRegex, 'i');
        dontApply = dontApply || urlRegex.test(currentLocation);
    });
    return dontApply;
}

self.port.on('bind-sequences', bindSequences);