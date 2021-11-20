import {Component, FormEventHandler} from "react";
import { HeroData } from "../controller/MainController";


export class HeroTable extends Component<
    { onAddHero: (heroData: HeroData) => void }
> {

    private inputData = {
        name: "My Hero",
        init: "10",
    }

    public render() {
        return <div>
                <p>Hero Data</p>
                <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Initiative</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
                <tfoot>
                    <tr>
                        <th><input type="text" name="name"onChange={this.inputChangeHandler}/></th>
                        <th><input type="number" name="init"onChange={this.inputChangeHandler}/></th>
                        <th><input type="button" name="add" value="+" onClick={this.addHero}/></th>
                    </tr>
                </tfoot>
            </table>
        </div>
    }

    private addHero: FormEventHandler<HTMLInputElement> = e => {
        const newHero: HeroData = {
            initiative: Number.parseInt(this.inputData.init),
            name: this.inputData.name,
        }

        this.props.onAddHero(newHero);
    }

    private inputChangeHandler: FormEventHandler<HTMLInputElement> = e => {
        (this.inputData as any)[e.currentTarget.name] = e.currentTarget.value;
    }

}
