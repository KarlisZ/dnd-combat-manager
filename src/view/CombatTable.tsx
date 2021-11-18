import {Component, FormEventHandler, KeyboardEventHandler} from "react";
import { MainController, UnitData } from "../controller/MainController";
import { CombatControls } from "./CombatControls";


export class CombatTable extends Component<{controller:MainController}, {}> {
    private roundsNum: number = 1;
    public render(){
        const allUnits = this.props.controller.allUnits;
        const rows = this.createUnitRows(allUnits);
        const roundHeaders = [];
        for (let i = 0; i<this.roundsNum; i++) {
            roundHeaders.push(<th key={`round-${i}`}>R {i+1}</th>)
        }
        return allUnits.length 
            ? <div>
                <table>
                    <thead>
                    <tr>
                        <th>Order</th>
                        <th>Name</th>
                        <th>Cur HP</th>
                        <th>Init</th>
                        <th>Init Roll</th>
                        <th>Init Mod</th>
                        <th>Start HP</th>
                        <th>-</th>
                        {roundHeaders}
                    </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <CombatControls onNewCombat={this.onNewCombat} onNextTurn={this.onNextTurn} onPrevTurn={this.onPrevTurn}/>
            </div>
            : null;
    }


    private onNextTurn = () => {

    }

    private onPrevTurn = () => {

    }

    public onNewCombat = () => {
        this.roundsNum = 1;
    }

    private createUnitRows(allUnits:UnitData[]):JSX.Element[] {
        const allRows:JSX.Element[] = []
        for(let i = 0; i < allUnits.length; i++) {
            const unitData = allUnits[i];
            const hpChangeRows:JSX.Element[] = [];
            for(let ii = 0; ii < this.roundsNum; ii++) {
                hpChangeRows.push(
                    <td key={`hpChange-${unitData.uuid}-round-${ii}`}>
                        <input type="text" pattern="[\d-+*/]+" id={`${ii}-${unitData.uuid}`} onKeyDown={this.onHpChangeEntered}/>
                    </td>
                );
            }

            const newRow = <tr key={`unit-data-${unitData.order}`}>
                <td>{unitData.order + 1}</td>
                <td>{unitData.name}</td>
                <td>{unitData.currentHp}</td>
                <td>{unitData.initiative}</td>
                <td>{unitData.initiativeRoll}</td>
                <td>{unitData.initiativeMod}</td>
                <td><input type="number" defaultValue={unitData.startingHp}></input></td>
                <td><input type="button" name="remove" id={unitData.uuid} value="-" onClick={this.removeUnit}/></td>
                {hpChangeRows}
            </tr>;

            allRows.push(newRow);
        }

        return allRows;
    }

    

    private onHpChangeEntered: KeyboardEventHandler<HTMLInputElement> = e => {
        if(e.key === "Enter") {
            let value: number;
            try {
                value = Number.parseInt(eval(e.currentTarget.value)); 
            } catch {
                return;
            }
             
            if(Number.isNaN(value)) return;

            const [round, id] = e.currentTarget.id.split("-");
            this.props.controller.addHpChange(id, Number.parseInt(round), value);
        }
    }

    private removeUnit: FormEventHandler<HTMLInputElement> = e => {
        const uuid = e.currentTarget.id;
        this.props.controller.removeUnit(uuid);
    }
}
