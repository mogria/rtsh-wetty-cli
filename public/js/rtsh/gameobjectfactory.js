define(['tile', 'unit'], function(Tile, Unit) {
    function gameObjectFactory(map, data) {
        var classMap = {
            'tile': Tile,
            'unit': Unit
        };

        if(typeof classMap[data["class"]] !== 'undefined') {
            var classSymbol = classMap[data["class"]]
            return new classSymbol(data, map);
        }
        return undefined;
    }
    return gameObjectFactory;
});
