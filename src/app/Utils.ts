import {Ball} from "./Ball";

export function getAngle(x1: number,y1: number,x2: number,y2: number): number {
    const delta_x = x1 - x2;
    const delta_y = y1 - y2;
    return Math.atan2(delta_y, delta_x);
}

export function randomInt(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function areBallsColliding(ballA: Ball, ballB: Ball) {
    // Checks if the distance between the position of the 2 balls is less than their average size
    return Math.pow((Math.pow(ballB.position.x - ballA.position.x, 2) + Math.pow(ballB.position.y - ballA.position.y, 2)), 0.5) < (ballA.size / 2 + ballB.size / 2)
}