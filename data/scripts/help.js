var focusNextInputField = function(event) {
    var changedElement = $(event.target);
    if (changedElement.val()) {
        changedElement.next().focus();
    }
};

var clearInputField = function(event) {
    var focusedElement = $(event.target);
    focusedElement.val('');
};

var goBack = function() {
    history.back();
};

var createSequenceDemo = function() {
    $(".blackButton").hide();
    $("#createSequenceDemoSequence .key1").val('');
    $("#createSequenceDemoSequence .key2").val('');
    $("#createSequenceDemoSequence").hide();
    var delay = 0;
    $("#createSequenceDemoPointer").addClass('overAddSequenceButton');
    delay += 1000;
    setTimeout(function() {
        $("#createSequenceDemoButton").addClass('blueButtonActive');
    }, delay);
    delay += 500;
    setTimeout(function() {
        $("#createSequenceDemoButton").removeClass('blueButtonActive');
        $("#createSequenceDemoSequence").show();
        $("#createSequenceDemoSequence .key1").addClass('helpFieldFocus');
    }, delay);
    delay += 500;
    setTimeout(function() {
        $("#createSequenceDemoSequence .key1").val('g');
    }, delay);
    delay += 500;
    setTimeout(function() {
        $("#createSequenceDemoSequence .key1").removeClass('helpFieldFocus');
        $("#createSequenceDemoSequence .key2").addClass('helpFieldFocus');
        $("#createSequenceDemoSequence .key2").val('i');
    }, delay);
    delay += 500;
    setTimeout(function() {
        $("#createSequenceDemoSequence .key2").removeClass('helpFieldFocus');
        $("#createSequenceDemoSequence .matchers").addClass('helpFieldFocus');
    }, delay);
    delay += 500;
    setTimeout(function() {
        $("#createSequenceDemoSequence .matchers").removeClass('helpFieldFocus');
        var optionSize = $("#createSequenceDemoSequence option").length;
        $("#createSequenceDemoSequence .shortcutFunction").attr('size', optionSize);
    }, delay)
    delay += 300;
    setTimeout(function() {
        $("#createSequenceDemoSequence .shortcutFunction").attr('size', 1);
    }, delay);
    delay += 30;
    setTimeout(function() {
        $("#createSequenceDemoPointer").removeClass('overAddSequenceButton');
        $(".blackButton").show();
    }, delay)
};

var createFunctionDemo = function() {
    $("#createFunction").hide();
    $("#addFunctionDemo .functionList").hide();
    $("#addFunctionDemo .functionName").val('');
    $("#addFunctionDemo .functionDefinition").val('function(matches){\r\n\r\n}');
    var delay = 0;
    $("#createFunctionDemoPointer").addClass('overAddFunctionButton');
    delay += 1000;
    setTimeout(function() {
        $("#addFunctionDemo .blueButton").addClass('blueButtonActive');
    }, delay);
    delay += 500;
    setTimeout(function() {
        $("#addFunctionDemo .blueButton").removeClass('blueButtonActive');
        $("#addFunctionDemo .functionList").show();
        $("#addFunctionDemo .functionName").addClass('helpFieldFocus');
    }, delay);
    delay += 500;
    setTimeout(function() {
        $("#addFunctionDemo .functionName").val('customFunction');
    }, delay);
    delay += 500;
    setTimeout(function() {
        $("#addFunctionDemo .functionName").removeClass('helpFieldFocus');
        $("#addFunctionDemo .functionDefinition").addClass('helpFunctionDefinitionFocus');
        $("#addFunctionDemo .functionDefinition").addClass('helpFieldFocus');
    }, delay);
    delay += 500;
    setTimeout(function() {
        $("#addFunctionDemo .functionDefinition").val('function(matches){\r\n//do something\r\n}');
    }, delay);
    delay += 800;
    setTimeout(function() {
        $("#addFunctionDemo .functionDefinition").removeClass('helpFunctionDefinitionFocus');
        $("#addFunctionDemo .functionDefinition").removeClass('helpFieldFocus');
        $("#createFunctionDemoPointer").removeClass('overAddFunctionButton');
        $(".blackButton").show();
    }, delay);
};

var createPatternDemo = function() {
    $("#addPatternDemo .applyToContainer").empty();
    $("#addPatternDemo .dontApplyToContainer").empty();
    $(".blackButton").hide();
    var urlPattern = 'http://mashable.com/*';
    var delay = 0;
    $("#createPatternDemoPointer").addClass('overAddPatternField');
    delay += 1000;
    setTimeout(function() {
        $("#addPatternDemo .urlPattern").val('');
        $("#addPatternDemo .urlPattern").addClass('helpFieldFocus');
    }, delay);
    delay += 800;
    setTimeout(function() {
        $("#addPatternDemo .urlPattern").val(urlPattern);
    }, delay);
    delay += 500;
    setTimeout(function() {
        $("#addPatternDemo .urlPattern").removeClass('helpFieldFocus');
        $("#addPatternDemo .shortcutFunction").attr('size', 2);
    }, delay);
    delay += 500;
    setTimeout(function() {
        $("#addPatternDemo .shortcutFunction").attr('size', 1);
        $("#createPatternDemoPointer").removeClass('overAddPatternField');
        $("#createPatternDemoPointer").addClass('overAddPatternButton');
    }, delay);
    delay += 1000;
    setTimeout(function() {
        $("#addPatternDemo .addUrlPattern").addClass('blueButtonActive');
    }, delay);
    delay += 500;
    setTimeout(function() {
        $("#addPatternDemo .urlPattern").val('');
        $("#addPatternDemo .addUrlPattern").removeClass('blueButtonActive');
        $("#addPatternDemo .applyToContainer").append($('<input class="urlPatternField" type="text" value="' + urlPattern + '">'));
        $("#addPatternDemo .applyToContainer").append($('<input class="deleteUrlButton" width="5px" type="button" value="x">'));
        $("#createPatternDemoPointer").removeClass('overAddPatternButton');
        $(".blackButton").show();
    }, delay);
};

$(".key1").live('keyup.key1Changed', focusNextInputField);
$(".key2").live('keyup.key2Changed', focusNextInputField);
$(".key1").live('focus.key1Changed', clearInputField);
$(".key2").live('focus.key2Changed', clearInputField);
$("#backButton").bind("click.backButton", goBack);
$("#createSequence").bind('click', createSequenceDemo);
$("#createFunction").bind('click', createFunctionDemo);
$("#createPattern").bind('click', createPatternDemo);
$("#validEntryPoint").val("true");