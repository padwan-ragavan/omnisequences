const data = require("self").data;
const tabs = require("tabs");
const windows = require("windows").browserWindows;
const simpleStorage = require("simple-storage").storage;
const omniShortcutDataStore = require("omniShortcutData");
const fileIO = require("fileIO");
const exportSeq = require("exportSeq");
const importSeq = require("importSeq");
var configTabWorker;

var initConfigTabWorker = function() {
    var existingOmniTab = getExistingOmniTab();
    if(existingOmniTab) {       
        activateExisting(existingOmniTab);
    } else {
        openConfigPanel();
    }
};

var getExistingOmniTab = function() {
    for (var i in windows) {
        var tabs = windows[i].tabs;
        for (var openTab in tabs) {
            var tab = tabs[openTab];
            var url = getTabUrl(tab);
            if (url == data.url("configPanel.html") || url == data.url("help.html")) {
                return { tab: tab, window: windows[i]};
            }
        }
    }
    return false;
};

var activateExisting = function({tab,window}) {
    tab.attach({
        contentScript: "self.postMessage(document.getElementById('validEntryPoint').value=='true');",
        onMessage: function(valid) {
            if (valid) {
                tab.activate();
                window.activate();
            } else {
                openConfigPanel();
                tab.close();                                
            }
        }
    });
};
var getTabUrl = function(tab) {
    //todo: ugly fix to handle broken tab api
    var url = undefined;
    try {
        url = tab.url;
    } catch(e) {
    }
    return url;
};

var openConfigPanel = function() {
    tabs.open({
                title:'omnisequence',
                isPinned: true,
                url:data.url("configPanel.html"),
                onReady : function(tab) {
                    if (!/configPanel.html$/.test(tab.url)) {
                        tab.attach({
                                    contentScriptFile:[data.url('scripts/jquery-1.8.3.min.js'),data.url("scripts/help.js")]
                                });
                        return;
                    }
                    configTabWorker = tab.attach({
                                contentScriptFile:[data.url('scripts/jquery-1.8.3.min.js'),
                                    data.url('scripts/jquery-ui-1.9.2.custom.min.js'),
                                    data.url('scripts/underscore-min.js'),
                                    data.url('scripts/stringKeyExtractor.js'),
                                    data.url("scripts/configPanelContentScript.js"),
                                    data.url("scripts/jquery.jqGrid.min.js"),
                                    data.url("scripts/underscore-min.js")
                                ]
                            });
                    configTabWorker.port.on('save-shortcuts', function(omniShortcutData) {
                        fileIO.writeFunctionData(omniShortcutData.functionData);
                        omniShortcutDataStore.saveOmniShortcuts(omniShortcutData);
                    });
                    configTabWorker.port.on('restore-defaults', function() {
                        omniShortcutDataStore.restoreDefaults();
                        showShortcuts(configTabWorker);
                    });
                    configTabWorker.port.on('get-omnisequences', function({callback}) {
                        var omnisequences = omniShortcutDataStore.fetchOmniShortcuts();
                        configTabWorker.port.emit(callback,omnisequences);
                    });
                    configTabWorker.port.on('export-omnisequence', function(ruleNames) {
                        exportSeq.exportSequences(ruleNames);
                    });
                    configTabWorker.port.on('import-omnisequences', function() {
                        if (importSeq.importSequences()) {
                            showShortcuts(configTabWorker);
                        }
                    });                    
                    configTabWorker.port.on('exit', function() {
                        windows.activeWindow.tabs.activeTab.close();
                    });
                    showShortcuts(configTabWorker);
                }
            });
};

var showShortcuts = function(tabWorker) {
    var shortcuts = omniShortcutDataStore.fetchOmniShortcuts();
    tabWorker.port.emit('show-shortcuts', shortcuts);
};

exports.show = function() {
    initConfigTabWorker();
};