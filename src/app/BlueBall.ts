import * as PIXI from "pixi.js";
import {Ball} from "./Ball";

export default class BlueBall extends Ball {
    constructor(app: PIXI.Application, size: number = 100) {
        super(app.loader.resources["Blue Ball"].texture, size);
        app.stage.addChild(this.instance);
        this.position = {x: -1000, y: -1000};

        // @ts-ignore
        app.stage.mousemove = (event) => {
            this.position = event.data.global;
        };
    }

    // @ts-ignore
    public execute(delta: number): void {
    }
}
