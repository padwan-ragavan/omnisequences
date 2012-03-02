const widgets = require("widget");
const fileIO = require("fileIO");
const dirIO = require("dirIO");
const resourceManager = require("resourceManager");
const tabs = require("tabs");
const windows = require("windows").browserWindows;
const data = require("self").data;
const omniShortcutDataStore = require("omniShortcutData");
const WIDGET_CONTENT_URL = data.url('widget.html');
const unload = require("unload");
var configPanel = require("config");


exports.main = function() {
    resourceManager.initResource();
    var widget = widgets.Widget({
                id: "omniShortcutsWidget",
                label: "omnisequences",
                contentScriptWhen: 'ready',
                contentScriptFile : data.url('scripts/widget.js'),
                contentURL: WIDGET_CONTENT_URL,
                width: 35
            });

    widget.port.on('left-click', function() {
        configPanel.show();
    });

    widget.port.on('right-click', function() {
        configPanel.show();
    });

    widget.onAttach = function() {
        widget.contentURL = WIDGET_CONTENT_URL;
    };

    unload.when(function(reason){
        if(reason == "uninstall"){
            tabs.open("why.uninstal.?");
            simpleStorage.saveOmniShortcuts({});
        }
    });

    tabs.on('ready', function(tab) {
        var omniSequences = omniShortcutDataStore.fetchOmniShortcuts();
        var activeTabWorker = tab.attach({
                    contentScriptFile:[data.url('scripts/jquery-1.7.1.min.js'),resourceManager.getFunctionDataResource(),data.url('scripts/stringKeyExtractor.js'),data.url("scripts/sequenceBinder.js")]
                });
        activeTabWorker.port.emit('add-omnisequences-style', data.url('css/omniSequences.css'));
        activeTabWorker.port.emit('bind-sequences', omniSequences);
        activeTabWorker.port.on('keys-captured', function(keysCaptured){
            widget.port.emit('keys-captured', keysCaptured);
        });
    });
}