import * as PIXI from "pixi.js";
import {Ball} from "./Ball";
import {getAngle} from "./Utils";

enum BORDER {
    TOP,
    BOTTOM,
    LEFT,
    RIGHT
}

export default class RedBall extends Ball {
    public direction: number;
    public speed: number;
    public isInside: boolean;
    private _vx: number;
    private _vy: number;

    constructor(app: PIXI.Application, size: number = 100, speed: number = 10) {
        super(app.loader.resources["Red Ball"].texture, size);

        this.speed = speed;

        // Spawning ball outside the screen
        // Ball is always spawned near a randomly chosen screen wall
        const startBorder = Math.floor(Math.random() * 4);
        switch (startBorder) {
            case 0:
                this.position = {y: -this.size / 2, x: Math.random() * app.renderer.width};
                break;
            case 1:
                this.position = {y: app.renderer.height + this.size / 2, x: Math.random() * app.renderer.width};
                break;
            case 2:
                this.position = {x: -this.size / 2, y: Math.random() * app.renderer.height};
                break;
            case 3:
                this.position = {x: app.renderer.width + this.size / 2, y: Math.random() * app.renderer.height};
                break;
        }
        this.isInside = false;

        // Calculating the angle between the ball center and the screen center
        this.direction = getAngle(
            this.instance.x + this.size / 2, this.instance.y + this.size / 2,
            app.renderer.width / 2, app.renderer.width / 2
        );

        // Setting individual speeds based upon the direction angle
        this._vx = -Math.cos(this.direction) * this.speed;
        this._vy = -Math.sin(this.direction) * this.speed;
        app.stage.addChild(this.instance);
    }

    public execute(delta: number): void {
        this.move(delta);
    }

    public move(delta: number): void {
        // Ignoring collisions before the ball enters the screen
        if (this.isInside) {
            const hitBorder = this.borderCollision(delta);
            if (hitBorder !== null) {
                this.changeDirection(hitBorder);
            }
        } else if (!this.borderCollision(delta)) {
            this.isInside = true;
        }
        this.instance.x += this._vx + delta;
        this.instance.y += this._vy + delta;
    }

    public borderCollision(delta: number): BORDER | null {
        const height = window.innerHeight;
        const width = window.innerWidth;

        if (this.position.x - this.size / 2 + this._vx + delta < 0) {
            return BORDER.LEFT;
        }
        if (this.position.x + this.size / 2 + this._vx + delta > width) {
            return BORDER.RIGHT;
        }
        if (this.position.y - this.size / 2 + this._vy + delta < 0) {
            return BORDER.TOP;
        }
        if (this.position.y + this.size / 2 + this._vy + delta > height) {
            return BORDER.BOTTOM;
        }
        return null;
    }

    public changeDirection(hitBorder: BORDER): void {
        if (hitBorder === BORDER.LEFT || hitBorder === BORDER.RIGHT) {
            this._vx = -this._vx;
        }
        if (hitBorder === BORDER.TOP || hitBorder === BORDER.BOTTOM) {
            this._vy = -this._vy;
        }

        this.direction = Math.atan2(this._vy / this.speed, this._vx / this.speed);
    }
}
