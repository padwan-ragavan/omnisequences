var validEntryPoint = true;
var showShortcuts = function(omniShorcutsData) {
    reset();
    var shortcutsFromAllRules = [];
    var rules = omniShorcutsData.rules;
    for (var ruleIndex in rules) {
        var rule = rules[ruleIndex];
        var newRuleContainer = addNewRuleSet();
        $(".ruleName", newRuleContainer).val(rule.name);

        var shortcuts = rule.shortcuts;
        var shorcutList = $(".omnishortcutList", newRuleContainer);
        for (var index in shortcuts) {
            var shortcut = shortcuts[index];
            shortcutsFromAllRules.push(shortcut);
            var newShortcutContainer = $('#omnishortcutTemplate').clone();
            newShortcutContainer.removeAttr("id");
            $(".key1", newShortcutContainer).val(shortcut.key1);
            $(".key2", newShortcutContainer).val(shortcut.key2);
            $(".matchers", newShortcutContainer).val(shortcut.matchers);
            $(".cache", newShortcutContainer).prop("checked", shortcut.cache);
            shorcutList.append(newShortcutContainer);
        }

        var applyToContainer = $(".applyToContainer", newRuleContainer);
        var applyToUrls = rule.applyTo;
        var dontApplyToContainer = $(".dontApplyToContainer", newRuleContainer);
        var dontAppToUrls = rule.dontApplyTo;
        addUrlFiltersToContainer(applyToUrls, applyToContainer);
        addUrlFiltersToContainer(dontAppToUrls, dontApplyToContainer);
    }
    var functionData = omniShorcutsData.functionData;
    if (!functionData) return;
    var validFunctionNames = [];
    for (var functionName in functionData) {
        var functionDefinition = functionData[functionName];
        var newFunctionContainer = $('#functionTemplate').clone();
        newFunctionContainer.removeAttr("id");
        $(".functionName", newFunctionContainer).val(functionName);
        $(".functionDefinition", newFunctionContainer).val(functionDefinition);
        $("#functionList").append(newFunctionContainer);
        validFunctionNames.push(functionName);
    }
    if (shortcutsFromAllRules != null) {
        var selectedShortcutFunctionNames = $.map(shortcutsFromAllRules, function(shortcut) {
            return shortcut.shortcutFunction;
        });
        updateFunctionNamesInSelect(selectedShortcutFunctionNames, validFunctionNames);
    }
};

var addUrlFiltersToContainer = function(urlFilters, container) {
    for (var i in urlFilters) {
        var urlField = $("<input type='text' class='urlPatternField'/>");
        urlField.val(urlFilters[i]);
        container.append(urlField);
        addDeleteUrlButton(urlField);
    }
};

var addDeleteUrlButton = function(urlField) {
    var deleteUrlButton = $("<input type='button' width='5px'/>");
    deleteUrlButton.val('x');
    deleteUrlButton.addClass('deleteUrlButton');
    urlField.after(deleteUrlButton);
};

var saveShortcuts = function() {
    disableButton('exit');
    var dataToStore = {rules:getRules(),functionData:getFunctionData()};
    self.port.emit('save-shortcuts', dataToStore);
    enableButton('exit');
};

var getRules = function() {
    var ruleContianers = $(".rulesContainer");
    var rules = [];
    ruleContianers.each(function(index) {
        var ruleContainer = ruleContianers[index];
        var shortcuts = getShortcutsFromContainer(ruleContainer);
        var ruleName = $(".ruleName", ruleContainer).val();
        var applyToUrlFields = $(".applyToContainer .urlPatternField", ruleContainer);
        var dontApplyToUrlFields = $(".dontApplyToContainer .urlPatternField", ruleContainer);
        var applyToUrls = $.map(applyToUrlFields, function(urlField) {
            return $(urlField).val();
        });

        var dontApplyToUrls = $.map(dontApplyToUrlFields, function(urlField) {
            return $(urlField).val();
        });
        var rule = {};
        rule.name = ruleName;
        rule.shortcuts = shortcuts;
        rule.applyTo = applyToUrls;
        rule.dontApplyTo = dontApplyToUrls;
        if (shortcuts.length != 0)
            rules.push(rule);
    });
    return rules;
};

var getShortcutsFromContainer = function(rulesContainer) {
    var shorcutContainers = $(".omnishortcutList div", rulesContainer);
    var shortcuts = [];
    for (var index = 0; index < shorcutContainers.length; index++) {
        var extractedShortcut = extractShortcut(shorcutContainers[index]);
        if (isValidShortcut(extractedShortcut))
            shortcuts.push(extractedShortcut);
    }
    return shortcuts;
};

var getFunctionData = function() {
    var functionContainers = $("#functionList div");
    var functionData = {};
    for (var index = 0; index < functionContainers.length; index++) {
        var extractedFunction = extractFunction(functionContainers[index]);
        if (isValidFunction(extractedFunction)) {
            functionData[extractedFunction.functionName] = extractedFunction.functionDefinition;
        }
    }
    return functionData;
};

var addNewSequence = function(event) {
    var clickedAddNewSequenceButton = $(event.target);
    var newShortcutContainer = $('#omnishortcutTemplate').clone();
    newShortcutContainer.removeAttr("id");
    clickedAddNewSequenceButton.prev().append(newShortcutContainer);
    $(".key1", newShortcutContainer).focus();
    updateFunctionList();

};

var addNewFunction = function() {
    var newFunctionContainer = $("#functionTemplate").clone();
    newFunctionContainer.removeAttr("id");
    $("#functionList").append(newFunctionContainer);
    $(".functionName", newFunctionContainer).focus();
};

var extractShortcut = function(shortcutContainer) {
    var shortcut = {};
    shortcut.key1 = $(".key1", shortcutContainer).val();
    shortcut.key2 = $(".key2", shortcutContainer).val();
    shortcut.matchers = $(".matchers", shortcutContainer).val();
    shortcut.shortcutFunction = $(".shortcutFunction", shortcutContainer).val();
    shortcut.cache = $(".cache", shortcutContainer).prop("checked");
    return shortcut;
};

var extractFunction = function(functionContainer) {
    var functionData = {};
    functionData["functionDefinition"] = $(".functionDefinition", functionContainer).val();
    functionData["functionName"] = $(".functionName", functionContainer).val();
    return functionData;
};


var updateFunctionList = function() {
    var functionNameFields = getFunctionNameFields();
    var validFunctionNames = $.map(functionNameFields, function(functionNameField) {
        var functionName = $(functionNameField).val();
        return ($.trim(functionName).length > 0 ? functionName : null);
    });
    var selectionFields = getFunctionSelectFields();
    var selectedFunctionNames = $.map(selectionFields, function(selectionField) {
        return $(selectionField).val() ? $(selectionField).val() : '0InvalidFunctionName';
    });
    updateFunctionNamesInSelect(selectedFunctionNames, validFunctionNames);
};

var updateFunctionNamesInSelect = function(selectedFunctionNames, validFunctionNames) {
    var selectionFields = getFunctionSelectFields();
    $.each(selectionFields, function(selectionFieldIndex, selectionField) {
        $(selectionField).empty();
        $.each(validFunctionNames, function(functionNameIndex, validFunctionName) {
            var opt = $("<option>" + validFunctionName + "</option>");
            if (selectedFunctionNames.length > selectionFieldIndex && selectedFunctionNames[selectionFieldIndex] == validFunctionName) {
                opt.prop('selected', 'selected');
            }
            $(selectionField).append(opt);
        });
    });
};

var getFunctionSelectFields = function() {
    return $(".omnishortcutList div .shortcutFunction");
};

var getFunctionNameFields = function() {
    return $("#functionList .functionName");
};

var isValidShortcut = function(shortcut) {
    return  (shortcut.key1 || shortcut.key2);
};

var isValidFunction = function(functionData) {
    return !!functionData["functionName"] && !!functionData["functionDefinition"];
};

var focusNextInputField = function(event) {
    var changedElement = $(event.target);
    var string = getStringFromKeyCode(event.which);
    changedElement.val(string);
    if (changedElement.val()) {
        changedElement.next().focus();
    }
    event.preventDefault();
};

var clearInputField = function(event) {
    var focusedElement = $(event.target);
    focusedElement.val('');
};

var addNewRuleSet = function() {
    var ruleSetContainer = $("#ruleSetContainer");
    var newRulesContainer = $("#rulesContainerTemplate").clone();
    newRulesContainer.removeAttr("id");
    newRulesContainer.addClass("rulesContainer");
    ruleSetContainer.append(newRulesContainer);
    return newRulesContainer;
};

var reset = function() {
    var ruleSetContainer = $("#ruleSetContainer");
    var functionList = $("#functionList");
    ruleSetContainer.empty();
    functionList.empty();
};

var addUrlPattern = function(event) {
    var addUrlPatternButton = $(event.target);
    var urlPatternSelector = addUrlPatternButton.prev();
    var urlPattern = urlPatternSelector.prev().val();
    urlPatternSelector.prev().val('');
    var urlPatternType = urlPatternSelector.val();
    var newUrlPattern = $("<input type='text' class='urlPatternField'/>");
    newUrlPattern.val(urlPattern);
    if (urlPattern) {
        var urlPatternContainer = addUrlPatternButton.siblings(urlPatternType);
        urlPatternContainer.append(newUrlPattern);
        addDeleteUrlButton(newUrlPattern);
    }
};

var deleteUrlPatten = function(event) {
    var deleteUrlButton = $(event.target);
    deleteUrlButton.prev().remove();
    deleteUrlButton.remove();
};

var disableButton = function(buttonId) {
    $("#" + buttonId).attr('disabled', 'disabled');
};

var enableButton = function(buttonId) {
    $("#" + buttonId).removeAttr('disabled');
};

var loadHelpPage = function() {
    location.href = "help.html";
};

var restoreDefaults = function() {
    var restoreDefaults = confirm("Restore Default", "Are you sure you want to restore defaults? All your custom functions, rules will be lost?");
    if (restoreDefaults)
        self.port.emit('restore-defaults');
};

var restoreDefaults = function() {
    var restoreDefaults = confirm("Restore Default", "Are you sure you want to restore defaults? All your custom functions, rules will be lost?");
    if (restoreDefaults)
        self.port.emit('restore-defaults');
};

var showExportDialog = function (omnisequences) {
    $("#exportSequenceDialog").show();
    $("#exportSequenceDialog").dialog({ position: { at: 'center-' + ($(window).width() / 2) + ' center', of: "#export"} });
    $("#exportSequenceDialog").dialog('open');
    var rules = _.map(omnisequences.rules, function (rule) { return {name: rule.name}; });
    $("#exportSequenceList").jqGrid('setGridParam', { data: rules}).trigger('reloadGrid');
};

self.port.on('show-export-dialog', showExportDialog);

var exportSequences = function () {
    self.port.emit('get-omnisequences', { callback: 'show-export-dialog'});
};

self.port.on('show-shortcuts', showShortcuts);


$(function () {
    $(".functionName").on('blur.functionNameModified', updateFunctionList);
    $(".key1").on('keydown.key1Changed', focusNextInputField);
    $(".key2").on('keydown.key2Changed', focusNextInputField);
    $(".key1").on('focus.key1Changed', clearInputField);
    $(".key2").on('focus.key2Changed', clearInputField);
    $(".addUrlPattern").on('click.addUrlPattern', addUrlPattern);
    $(".addNewSequence").on('click', addNewSequence);
    $("#validEntryPoint").val("true");
    $("#addNewFunction").on('click', addNewFunction);
    $("#save").on('click', saveShortcuts);
    $("#addNewRuleSet").on('click', addNewRuleSet);
    $(".deleteUrlButton").on('click', deleteUrlPatten);
    $(".helpButton").on('click', loadHelpPage);
    $("#restoreDefault").on('click', restoreDefaults);
    $("#export").on('click', exportSequences);
    $("#exit").on('click', function () {
        self.port.emit('exit');
    });
    $("#exportSequenceDialog").dialog({
        title: 'Export Sequences',
        width: 400,
        autoOpen: false,
        modal: true,
        closeText: 'close',
        buttons: {
            'Export': function () {
                var grid = $("#exportSequenceList");
                var selectedRowIds = grid.jqGrid('getGridParam', 'selarrrow');
                var selectedRules = _.map(selectedRowIds, function (rowId) {
                    return grid.jqGrid('getRowData', rowId).name;
                });
                self.port.emit('export-omnisequence', selectedRules);
                $("#exportSequenceDialog").dialog('close');
            }
        }
    });
    $("#exportSequenceList").jqGrid({
        datatype: 'local',
        multiselect: true,
        colNames: ['Rule Name'],
        colModel: [{ name: 'name', index: 'name'}],
        width: 350
    });
});