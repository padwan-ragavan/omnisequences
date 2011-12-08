this.addEventListener('click', function(event) {
    if (event.button == 0 && event.shiftKey == false) {
        self.port.emit('left-click');
    }

    if (event.button == 2 || (event.button == 0 && event.shiftKey == true)) {
        self.port.emit('right-click');
    }
    event.preventDefault();
    event.stopPropagation();
}, true);

self.port.on('keys-captured', function(keysCaptured) {
    keysCaptured = keysCaptured.toLowerCase();
    if (/\w+/.test(keysCaptured) || keysCaptured.length==0)
        document.getElementById("keysCaptured").innerHTML = keysCaptured;
});

self.port.on('dirIO.test', function(path){
    console.log(path);
});