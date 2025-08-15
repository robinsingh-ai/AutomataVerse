export const calculateDistance = (point1: {x: number, y: number}, point2: {x: number, y: number}): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const calculateMidpoint = (point1: {x: number, y: number}, point2: {x: number, y: number}): {x: number, y: number} => {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
};

export const adjustPointForNodeRadius = (from: {x: number, y: number}, to: {x: number, y: number}, radius: number): {x: number, y: number} => {
  const distance = calculateDistance(from, to);
  if (distance === 0) return from;
  
  const ratio = radius / distance;
  return {
    x: from.x + (to.x - from.x) * ratio,
    y: from.y + (to.y - from.y) * ratio
  };
};
