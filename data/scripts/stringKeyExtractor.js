var getStringFromKeyCode = function(keycode) {
    var string = String.fromCharCode(keycode);
    if (/\w/i.test(string))
        return string.toLowerCase();
    switch (keycode) {
        case 96:
            return   "0";
            break;
        case 97:
            return   "1";
            break;
        case 98:
            return   "2";
            break;
        case 99:
            return   "3";
            break;
        case 100:
            return   "4";
            break;
        case 101:
            return   "5";
            break;
        case 102:
            return   "6";
            break;
        case 103:
            return   "7";
            break;
        case 104:
            return   "8";
            break;
        case 105:
            return   "9";
            break;
        case 106:
            return   "*";
            break;
        case 107:
            return   "+";
            break;
        case 109:
            return   "-";
            break;
        case 110:
            return   ".";
            break;
        case 111:
            return   "/";
            break;
        case 186:
            return   ";";
            break;
        case 187:
            return   "=";
            break;
        case 188:
            return   ",";
            break;
        case 189:
            return   "-";
            break;
        case 190:
            return   ".";
            break;
        case 191:
            return   "/";
            break;
        case 192:
            return   "`";
            break;
        case 219:
            return   "[";
            break;
        case 220:
            return   "\\";
            break;
        case 221:
            return   "]";
            break;
        case 222:
            return   "'";
            break;
        default:
            return  "";
    }
};
