var translation = function(pageId) {
    var lang = tabris.device.get("language").replace(/-.*/, "");
    try {
        return require("./translations/" + pageId + "_" + lang + ".json");
    } catch (ex) {
        return require("./translations/" + pageId + "_bg.json");
    }
};

module.exports = translation;