"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeString = decodeString;
var map = {
  "\\\\X2\\\\00FC\\\\X0\\\\": "ü",
  "\\\\X2\\\\00F6\\\\X0\\\\": "ä"
};

function decodeString(str) {
  // Skip if no special characters found
  if (str.indexOf("\\") == -1) return str; // Replace all known special characters

  var keys = Object.keys(map);

  for (var i = 0; i < keys.length; i++) {
    var regex = new RegExp(keys[i], "g");
    str = str.replace(regex, map[keys[i]]);
  }

  return str;
}
//# sourceMappingURL=character-decode.js.map