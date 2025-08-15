export const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculates the midpoint between two points.
 */
export const getMidpoint = (p1: { x: number; y: number }, p2: { x: number; y: number }): { x: number; y: number } => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
};

/**
 * Returns a point moved along a line by a given offset distance.
 * Useful for adjusting arrow start/end to avoid overlapping node shapes.
 */
export const movePointAlongLine = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  offset: number
): { x: number; y: number } => {
  const distance = getDistance(from, to);
  if (distance === 0) return { ...from };

  const ratio = offset / distance;
  return {
    x: from.x + (to.x - from.x) * ratio,
    y: from.y + (to.y - from.y) * ratio
  };
};

/**
 * Calculates arrow start and end points adjusted for node radius.
 * @param from Node center position
 * @param to Target node center position
 * @param radius Node shape radius
 */
export const getAdjustedArrowPoints = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  radius: number
): [number, number, number, number] => {
  const start = movePointAlongLine(from, to, radius);
  const end = movePointAlongLine(to, from, radius);
  return [start.x, start.y, end.x, end.y];
};

/**
 * Optionally calculate control points for a curved line (self-loops or curved edges)
 */
export const getQuadraticCurveControlPoint = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  curveOffset: number
): { x: number; y: number } => {
  // Midpoint
  const mid = getMidpoint(start, end);

  // Direction vector perpendicular to line
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  return {
    x: mid.x - dy * curveOffset,
    y: mid.y + dx * curveOffset
  };
};
