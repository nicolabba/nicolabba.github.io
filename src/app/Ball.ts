import * as PIXI from "pixi.js";

export abstract class Ball {
    protected _instance: PIXI.Sprite;
    protected _size: number;

    protected constructor(texture: PIXI.Texture, size: number) {
        this._instance = new PIXI.Sprite(texture);
        this._size = size;
        this._instance.width = this._size;
        this._instance.height = this._size;
    }

    get size(): number {
        return this._size;
    }

    get instance(): PIXI.Sprite {
        return this._instance;
    }

    set position(position: {x: number, y: number}) {
        this._instance.x = position.x - this._size / 2;
        this._instance.y = position.y - this._size / 2;
    }

    get position(): {x: number, y: number} {
        return {
            x: this._instance.x + this._size / 2,
            y: this._instance.y + this._size / 2
        };
    }

    public abstract execute(delta: number): void;
}
