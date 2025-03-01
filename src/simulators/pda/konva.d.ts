// This file ensures TypeScript recognizes the Konva shape properties

import { Vector2d } from 'konva/lib/Node';
declare module 'konva' {
  interface Shape {
    fillLinearGradientColorStops?: number[];
    fillLinearGradientStartPoint?: Vector2d;
    fillLinearGradientEndPoint?: Vector2d;
  }
}

export {};

