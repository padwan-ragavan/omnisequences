const data = require("self").data;
const tabs = require("tabs");
const windows = require("windows").browserWindows;
const simpleStorage = require("simple-storage").storage;
const omniShortcutDataStore = require("omniShortcutData");
const fileIO = require("fileIO");
var configTabWorker;

var initConfigTabWorker = function() {
    var tabsInActiveWindow = windows.activeWindow.tabs;
    var isConfigAlreadyOpen = false;
    for (var openTab in tabsInActiveWindow) {
        if (tabsInActiveWindow[openTab].url == data.url("configPanel.html") || tabsInActiveWindow[openTab].url == data.url("help.html")) {
            isConfigAlreadyOpen = true;
            tabsInActiveWindow[openTab].attach({
                        contentScript:"if(document.getElementById('validEntryPoint')==null){self.postMessage(true);}else{self.postMessage(false);}",
                        onMessage:function(isInvalidEntryPoint) {
                            if (isInvalidEntryPoint) {
                                openConfigPanel();
                                tabsInActiveWindow[openTab].close();
                            } else {
                                tabsInActiveWindow[openTab].activate();
                            }
                        }
                    });
            break;
        }
    }
    if (!isConfigAlreadyOpen) {
        openConfigPanel();
    }
}

var openConfigPanel = function() {
    tabs.open({
                title:'omnisequence',
                isPinned: true,
                url:data.url("configPanel.html"),
                onReady : function(tab) {
                    if (!/configPanel.html$/.test(tab.url)) {
                        tab.attach({
                                    contentScriptFile:[data.url('scripts/jquery-1.7.1.min.js'),data.url("scripts/help.js")]
                                });
                        return;
                    }
                    configTabWorker = tab.attach({
                                contentScriptFile:[data.url('scripts/jquery-1.7.1.min.js'),data.url('scripts/stringKeyExtractor.js'),data.url("scripts/configPanelContentScript.js")]
                            });
                    configTabWorker.port.on('save-shortcuts', function(omniShortcutData) {
                        fileIO.writeFunctionData(omniShortcutData.functionData);
                        omniShortcutDataStore.saveOmniShortcuts(omniShortcutData);
                    });
                    configTabWorker.port.on('restore-defaults', function() {
                        omniShortcutDataStore.restoreDefaults();
                        showShortcuts(configTabWorker);
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