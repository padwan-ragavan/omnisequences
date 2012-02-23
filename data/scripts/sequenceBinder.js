const ESCAPE_KEYCODE = 27;
var shortcutsMap = {};
var functionData;
var keysPressed = '';

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
                var cachedMatchers = shortcutData.cachedMatchers;
                if (cachedMatchers == null || !shortcutData.cache) {
                    shortcutData.cachedMatchers = $(shortcutData.matchers);
                    cachedMatchers = shortcutData.cachedMatchers;
                }
                omniSequencesFunctions[shortcutData.shortcutFunction](cachedMatchers);
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

    var omniSequencesHelpHeading = $("<div>", {class:"omniSequenceHelpHeading",style:"display:none;"})
            .append($("<div>").text("Sequence"))
            .append($("<div>").text("Function"))
            .append($("<div>").text("Matchers"))
            .append($("<div>"));
    var omniSequenceHelpList = $("<div>", {class:"omniSeqenceHelpList"})
    var omniSequenceHelpDiv = $("<div>", {class:"omniSequenceHelp"})
            .append(omniSequencesHelpHeading)
            .append(omniSequenceHelpList);
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
        var omniSequenceHelpItem = $("<div>")
                .append($("<div>").text(shortcutKey))
                .append($("<div>").text(shortcut.shortcutFunction))
                .append($("<div>").text(shortcut.matchers))
                .append($("<div>"));
        omniSequenceHelpList.append(omniSequenceHelpItem);
    });

    $(window).unbind('keydown.omnisequences');
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

var addOmniSequencesStyle = function(cssResourcePath) {
    $("body").append($("<link>", {href:cssResourcePath,rel:"stylesheet"}))
};

self.port.on('bind-sequences', bindSequences);
self.port.on('add-omnisequences-style', addOmniSequencesStyle);