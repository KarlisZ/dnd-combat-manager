import {ChangeEventHandler, Component, FormEventHandler, KeyboardEventHandler} from "react";
import { MainController } from "../controller/MainController";
import { UnitData } from "../model/MainModel";
import { CombatControls } from "./CombatControls";


export class CombatTable extends Component<{controller:MainController, allUnits:UnitData[]}, {turnNum:number}> {
    public state = {
        turnNum : 1,
    }
    private roundsNum: number = 1;

    public render(){
        const allUnits = this.props.allUnits;
        const rows = this.createUnitRows(allUnits);
        const roundHeaders = [];
        for (let i = 0; i<this.roundsNum; i++) {
            const isActiveRound = this.roundsNum === i+1;
            roundHeaders.push(<th key={`round-${i}`} className={isActiveRound ? "active-round-cell" : undefined}>R {i+1}</th>)
        }
        return allUnits.length 
            ? <div>
                <table>
                    <thead>
                    <tr>
                        <th>Del</th>
                        <th>Order</th>
                        <th>Name</th>
                        <th>Cur HP</th>
                        <th>Init</th>
                        <th>Init Roll</th>
                        <th>Init Mod</th>
                        <th>Start HP</th>
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
        if(this.state.turnNum === this.props.allUnits.length) {
            this.roundsNum++;
            this.setState({turnNum:1});
        } else {
            this.setState({turnNum:this.state.turnNum + 1});

        }
    }

    private onPrevTurn = () => {
        if(this.state.turnNum === 1) {
            this.roundsNum = Math.max(this.roundsNum-1, 1);
            this.setState({turnNum:this.props.allUnits.length});
        } else {
            this.setState({turnNum:this.state.turnNum -1});
        }
    }

    public onNewCombat = () => {
        this.roundsNum = 1;
        this.setState({turnNum: 1});
    }

    private createUnitRows(allUnits:UnitData[]):JSX.Element[] {
        const allRows:JSX.Element[] = []
        for(let i = 0; i < allUnits.length; i++) {
            const unitData = allUnits[i];
            const hpChangeRows:JSX.Element[] = [];
            const isUnitTurn = this.state.turnNum === unitData.order;
            for(let ii = 0; ii < this.roundsNum; ii++) {
                const isCurrentRound = this.roundsNum === ii+1;
                hpChangeRows.push(
                    <td key={`hpChange-${unitData.uuid}-round-${ii}`} className={isCurrentRound ? "active-round-cell" : undefined}>
                        <input 
                            type="text"
                            defaultValue={unitData.roundHp[ii] > 0 ? unitData.roundHp[ii] : undefined}
                            pattern="[\d\-\+\*\/]+"
                            id={`${ii}::${unitData.uuid}`}
                            onChange={this.onHpChange}
                            onKeyDown={this.onHpChangeKey}
                        />
                    </td>
                );
            }

            const newRow = <tr key={`unit-data-${unitData.uuid}`} className={isUnitTurn ? "active-turn" : undefined}>
                <td><input type="button" name="remove" id={unitData.uuid} value="-" onClick={this.removeUnit}/></td>
                <td>{unitData.order}</td>
                <td>{unitData.name}</td>
                <td>{unitData.currentHp}</td>
                <td>{unitData.initiative}</td>
                <td>{unitData.initiativeRoll}</td>
                <td>{unitData.initiativeMod}</td>
                <td><input type="number" defaultValue={unitData.startingHp}></input></td>
                {hpChangeRows}
            </tr>;

            allRows.push(newRow);
        }

        return allRows;
    }

    

    private onHpChangeKey: KeyboardEventHandler<HTMLInputElement> = e => {
        if(e.key === "Enter") {
            e.currentTarget.blur()
        }
    }

    private onHpChange: ChangeEventHandler<HTMLInputElement> = e => {
        let value: number;
        try {
            value = Number.parseInt(eval(e.currentTarget.value)) || 0; 
        } catch {
            return;
        }
            
        if(Number.isNaN(value)) return;

        const [round, id] = e.currentTarget.id.split("::");
        this.props.controller.addHpChange(id, Number.parseInt(round), value);
    }

    private removeUnit: FormEventHandler<HTMLInputElement> = e => {
        const uuid = e.currentTarget.id;
        this.props.controller.removeUnit(uuid);
    }
}
