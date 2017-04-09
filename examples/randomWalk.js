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

/*archimedeanSpiralPointSet
a => the rotational offset
b => controls the tightness and parity of the spiral
from: https://en.wikipedia.org/wiki/Archimedean_spiral
"in polar coordinates(r, theta) 
r = a + b*theta
nCycles => number of cycles
nPoints => number of sample points in the set
##FUTURE## even, growth, random spacing of points option

*/
function archSpiralPointSet(a, b, nCycles, nPoints){
    var startPoints = [];
    var pathLength = nCycles * 2*Math.PI;
    for(var i = 0; i < nPoints; i++){
        var theta = i*pathLength/nPoints;
        var r = a + b*theta;
        var point = [0,0];
        point[0] = pg.geometry.toCircle(theta)[0]*r;
        point[1] = pg.geometry.toCircle(theta)[1]*r;
        startPoints.push(point);
    }
    return startPoints;
}

pg.setPalette(new pg.Palette({colorFunc: pg.Palette.randGray}))
pg.setPalette(new pg.Palette({color: "$000"}))

var params = {nPaths: 512, nSteps: 32, stepSize: 1/64, renderer: pg.renderers.line}
var startPoints = archSpiralPointSet(0, 1/32, 4, 128);//evenCircleStart(params.nPaths, .5);

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