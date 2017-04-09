// To run: `node examples/randomWalk.js` from the root directory
var fs = require('fs')
var Canvas = require('canvas')
var canvas = new Canvas(500, 300)
var pg = require('..')(canvas)
pg.fillBackground("#FFF")
const colors = ["#005C09","#00680A","#007B0C","#018E0E","#01A611","#005C09","#00680A","#007B0C"]
pg.setPalette(new pg.Palette({colorList: colors}))

function stepFunc() {
    return pg.geometry.toCircle(2 * Math.PI * Math.random())
}

function evenCircleStart(numPoints, radius){
    return pg.geometry.circlePoints(numPoints, radius);
}

pg.setPalette(new pg.Palette({colorFunc: pg.Palette.randGray}))
pg.setPalette(new pg.Palette({color: "$000"}))

var params = {nPaths: 512, nSteps: 32, stepSize: 1/64, renderer: pg.renderers.line}
var startPoints = pg.geometry.archSpiralPointSet(0, 1/32, 4, 128);//evenCircleStart(params.nPaths, .5);

for (var i = 0; i < params.nPaths; i++) {
    var L = new pg.PointList({list: pg.random.walk2d(params.nSteps, {stepScale: params.stepSize, start: startPoints[i], stepFunc: null})})
    var points = L.points;
    points.forEach(function(p, i) {
        if (i+1 < points.length) {
            pg.renderPoints(
                [p, points[i+1]], 
                params.renderer, 
                {}
            )
        }
    })
}
pg.save('output/randomWalk', fs)