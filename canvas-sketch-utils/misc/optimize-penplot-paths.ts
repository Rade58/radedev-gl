import clone from "clone";
import squaredDistance from "./vec2";

export function sort(paths: any) {
  paths = clone(paths);

  if (!paths.length) return paths;

  var newPaths = [];
  newPaths.push(paths[0]);

  paths = paths.slice(1);

  while (paths.length) {
    var lastPath = newPaths[newPaths.length - 1];
    var curPt = lastPath[lastPath.length - 1];
    var result = paths.reduce(function (
      closest: number,
      path: number[],
      i: number
    ) {
      var firstPt = path[0];
      var lastPt = path[path.length - 1];
      // @ts-expect-error reason
      var distanceToFirst = squaredDistance(curPt, firstPt);
      // @ts-expect-error reason
      var distanceToLast = squaredDistance(curPt, lastPt);
      if (!closest) {
        return {
          idx: i,
          distance: Math.min(distanceToFirst, distanceToLast),
          reverse: distanceToLast < distanceToFirst,
        };
      }
      // @ts-expect-error reason
      if (distanceToFirst < closest.distance) {
        return {
          idx: i,
          distance: distanceToFirst,
          reverse: false,
        };
      }
      // @ts-expect-error reason
      if (distanceToLast < closest.distance) {
        return {
          idx: i,
          distance: distanceToLast,
          reverse: true,
        };
      }
      return closest;
    },
    null);
    var idx = result.idx;
    var reverse = result.reverse;
    var closestPath = paths.splice(idx, 1)[0].slice();
    if (reverse) {
      closestPath.reverse();
    }
    newPaths.push(closestPath);
  }
  return newPaths;
}

// @ts-expect-error reason
export function merge(paths, mergeThrehsold) {
  mergeThrehsold = mergeThrehsold != null ? mergeThrehsold : 0.05;

  var mergeThrehsoldSq = mergeThrehsold * mergeThrehsold;
  paths = clone(paths);
  for (var i = 1; i < paths.length; i++) {
    var lastPath = paths[i - 1];
    var curPath = paths[i];
    if (
      squaredDistance(curPath[0], lastPath[lastPath.length - 1]) <
      mergeThrehsoldSq
    ) {
      paths = mergePaths(paths, i - 1, i);
      i -= 1; // now that we've merged, var's correct i for the next round
    }
  }
  return paths;
}

// @ts-expect-error reason
function mergePaths(paths, path1Idx, path2Idx) {
  // this will help us keep things in order when we do the splicing
  var minIdx = Math.min(path1Idx, path2Idx);
  var maxIdx = Math.max(path1Idx, path2Idx);
  paths = paths.slice();
  var path1 = paths[minIdx];
  var path2 = paths[maxIdx];
  var mergedPath = path1.concat(path2.slice(1));
  paths.splice(maxIdx, 1);
  paths.splice(minIdx, 1, mergedPath);
  return paths;
}
