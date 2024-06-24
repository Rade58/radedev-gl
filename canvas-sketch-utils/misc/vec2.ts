export default function squaredDistance(pt1: number[], pt2: number[]) {
  var dx = pt2[0] - pt1[0];
  var dy = pt2[1] - pt1[1];
  return dx * dx + dy * dy;
}
