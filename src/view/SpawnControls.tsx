import {Component, FormEventHandler} from "react";
import { SpawnData } from "../controller/MainController";

export class SpawnControls extends Component<{onSubmit:(spawnData:SpawnData) => void}> {
    private name = "Monster";
    private hp = "10";
    private init = "0";
    private count = "1";
    public render(){
        return <>
            <p>Spawn Controls</p>
            <form>
                <label>
                    Name:
                    <input type="text" name="name" defaultValue={this.name} onChange={this.inputChangeHandler}/>
                </label>
                <label>
                    HP:
                    <input type="number" name="hp" defaultValue={this.hp} onChange={this.inputChangeHandler}/>
                </label>
                <label>
                    Initiative modifier:
                    <input type="number" name="init" defaultValue={this.init} onChange={this.inputChangeHandler}/>
                </label>
                <label>
                    Spawn count:
                    <input type="number" name="count" defaultValue={this.count} onChange={this.inputChangeHandler}/>
                </label>
                <input type="button" value="Spawn" onClick={this.onSubmit} />
            </form>
        </>;
    }

    private onSubmit: FormEventHandler<HTMLInputElement> = (e) => {
        this.props.onSubmit({
            name: this.name,
            hp: Number.parseInt(this.hp),
            initiativeMod: Number.parseInt(this.init),
            count: Number.parseInt(this.count),
        })
    }

    private inputChangeHandler: FormEventHandler<HTMLInputElement> = e => {
        (this as any)[e.currentTarget.name] = e.currentTarget.value;
    }
}