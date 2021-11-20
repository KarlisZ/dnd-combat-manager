import React, {ChangeEventHandler, Component, FormEventHandler, KeyboardEventHandler} from "react";
import { MainController, UnitCondition } from "../controller/MainController";
import { UnitData } from "../model/MainModel";
import { CombatControls } from "./CombatControls";


export class CombatTable extends Component<{controller:MainController, allUnits:UnitData[]}, {turnNum:number, showStatusIds:string[]}> {
    public state: {turnNum:number, showStatusIds:string[]} = {
        turnNum : 1, // TODO: move turn management to model
        showStatusIds: [],
    }
    private activeRound: number = 1;

    public render(){
        const allUnits = this.props.allUnits;
        const rows = this.createUnitRows(allUnits);
        const roundHeaders = [];
        for (let i = 0; i<this.activeRound; i++) {
            const isActiveRound = this.activeRound === i+1;
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
                        <th>Status</th>
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
            this.activeRound++;
            this.setState({turnNum:1});
        } else {
            this.setState({turnNum:this.state.turnNum + 1});

        }
    }

    private onPrevTurn = () => {
        if(this.state.turnNum === 1) {
            if(this.activeRound === 1) return;
            this.activeRound = Math.max(this.activeRound-1, 1);
            this.setState({turnNum:this.props.allUnits.length});
        } else {
            this.setState({turnNum:this.state.turnNum -1});
        }
    }

    public onNewCombat = () => {
        this.activeRound = 1;
        this.setState({turnNum: 1});
    }

    private createUnitRows(allUnits:UnitData[]):JSX.Element[] {
        const allRows:JSX.Element[] = []
        for(let unitNum = 0; unitNum < allUnits.length; unitNum++) {
            const unitData = allUnits[unitNum];
            const hpChangeRows:JSX.Element[] = [];
            const isUnitTurn = this.state.turnNum === unitData.order;
            for(let roundNum = 0; roundNum < this.activeRound; roundNum++) {
                const isCurrentRound = this.activeRound === roundNum+1;
                hpChangeRows.push(
                    <td key={`hpChange-${unitData.uuid}-round-${roundNum}`} className={isCurrentRound ? "active-round-cell" : undefined}>
                        <input 
                            type="text"
                            className="hp-change-input"
                            defaultValue={unitData.roundHp[roundNum] > 0 ? unitData.roundHp[roundNum] : undefined}
                            pattern="[\d\-\+\*\/]+"
                            id={unitData.uuid}
                            onChange={this.onHpChange}
                            onKeyDown={this.onInputKeyDown}
                        />
                    </td>
                );
            }

            const currentStatuses = this.props.controller.getStatuses(unitData, this.activeRound, this.state.turnNum);
            let statusInfo = [];
            for (const status of currentStatuses) {
                statusInfo.push(<p className="status-info-text" key={UnitCondition[status.statusId]}>{`${UnitCondition[status.statusId]}, ${status.endsRound - this.activeRound}r`}</p>)
            }

            const isBadHp = unitData.currentHp < 1;
            let statusInfoOrInput;
            if(this.state.showStatusIds.includes(unitData.uuid) ){
                const statusOptions = getEnumStrings(UnitCondition).map(k => <option key={k} value={k}>{k}</option>)
                statusInfoOrInput = <>
                    <select id="status-select" autoFocus={true} key="status-select">{statusOptions}</select>
                    <input id="status-duration" type="number" defaultValue="1" key="status-duration"/>
                    <input type="button" name="add status" id={`${unitData.uuid}`} value="Add" onClick={this.addStatusInput} key="add-status"/>
                </>;
            } else {
                statusInfoOrInput = 
                    <>
                        {statusInfo}
                        <input key="add-status" type="button" name="add status" id={unitData.uuid} value="+" onClick={this.showStatusInpt}/>
                    </>;
            }

            const newRow = <tr key={`unit-data-${unitData.uuid}`} className={isUnitTurn ? "active-turn" : undefined}>
                <td><input type="button" name="remove" id={unitData.uuid} value="-" onClick={this.removeUnit}/></td>
                <td>{unitData.order}</td>
                <td><input className="combat-name-field" type="text" id={unitData.uuid} defaultValue={unitData.name} onKeyDown={this.onInputKeyDown} onChange={this.onNameChange}/></td>
                <td className={isBadHp ? "bad-hp-cell" : undefined}>{unitData.currentHp}</td>
                <td>{unitData.initiative}</td>
                <td><input type="number" id={unitData.uuid} defaultValue={unitData.initiativeRoll} onKeyDown={this.onInputKeyDown} onChange={this.onInitiativeChange}/></td>
                <td><input type="number" id={unitData.uuid} defaultValue={unitData.initiativeMod} onKeyDown={this.onInputKeyDown} onChange={this.onInitiativeModChange}/></td>
                <td><input type="number" id={unitData.uuid} defaultValue={unitData.startingHp} onKeyDown={this.onInputKeyDown} onChange={this.onStartingHpChange}></input></td>
                {hpChangeRows}
                <td>{statusInfoOrInput}</td>
            </tr>;

            allRows.push(newRow);
        }

        return allRows;
    }

    private addStatusInput: FormEventHandler<HTMLInputElement> = e => {
        const id = e.currentTarget.id;
        const duration = Number.parseInt(e.currentTarget.parentElement?.querySelector<HTMLInputElement>("#status-duration")?.value ?? "1");
        const statusIndex = e.currentTarget.parentElement?.querySelector<HTMLSelectElement>("#status-select")?.selectedIndex;
        if(statusIndex === undefined) throw new Error("Invalid status");
        this.props.controller.addStatus(id, this.activeRound, this.state.turnNum, duration, statusIndex);
        this.setState(prevState => ({showStatusIds:prevState.showStatusIds.filter(i => i !== id)}))
    }

    private showStatusInpt: FormEventHandler<HTMLInputElement> = e => {
        const id = e.currentTarget.id;
        this.setState(prevState => ({showStatusIds:[...prevState.showStatusIds, id]}));
    }

    private onNameChange: ChangeEventHandler<HTMLInputElement> = e => {
        const id = e.currentTarget.id;
        const name = e.currentTarget.value;
        this.props.controller.setName(id, name);
    }

    private onStartingHpChange: ChangeEventHandler<HTMLInputElement> = e => {
        const id = e.currentTarget.id;
        const newHp = Number.parseInt(e.currentTarget.value);
        this.props.controller.setStartingHp(id, newHp);
    }

    private onInitiativeChange: ChangeEventHandler<HTMLInputElement> = e => {
        const id = e.currentTarget.id;
        const newRoll = Number.parseInt(e.currentTarget.value);
        this.props.controller.setInitiativeRoll(id, newRoll);
    }

    private onInitiativeModChange: ChangeEventHandler<HTMLInputElement> = e => {
        const id = e.currentTarget.id;
        const newMod = Number.parseInt(e.currentTarget.value);
        this.props.controller.setInitiativeMod(id, newMod);
    }

    private onInputKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
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

        const id = e.currentTarget.id;
        this.props.controller.addHpChange(id, this.activeRound, value);
    }

    private removeUnit: FormEventHandler<HTMLInputElement> = e => {
        const uuid = e.currentTarget.id;
        this.props.controller.removeUnit(uuid);
    }
}

function getEnumStrings (e:Object): string[] {
    return Object.values(e).filter(isNaN);
}