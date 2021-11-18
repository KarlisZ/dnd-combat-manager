import {Component, FormEventHandler} from "react";

export interface UnitData {
    order: number;
    name: string;
    currentHp: number;
    initiative: number;
    initiativeRoll: number;
    initiativeMod: number;
    startingHp: number;
    key: string;
}

export class CombatTable extends Component<{allUnits:UnitData[], onRemoveUnit:(key:string) => void}> {
    public render(){
        // const orderedUnits = this.props.allUnits.sort((a, b) => a.initiative - b.initiative);
        const rows = this.createUnitRows(this.props.allUnits);
        return <table>
            <thead>
            <tr>
                <th>Order</th>
                <th>Name</th>
                <th>Current HP</th>
                <th>Initiative</th>
                <th>Initiative Roll</th>
                <th>Initiative Mod</th>
                <th>Starting HP</th>
            </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    }

    private createUnitRows(allUnits:UnitData[]):JSX.Element[] {
        const allRows:JSX.Element[] = []
        for (let unitData of allUnits) {
            const newRow = <tr key={`unit-data-${unitData.order}`}>
                <th>{unitData.order + 1}</th>
                <th>{unitData.name}</th>
                <th>{unitData.currentHp}</th>
                <th>{unitData.initiative}</th>
                <th>{unitData.initiativeRoll}</th>
                <th>{unitData.initiativeMod}</th>
                <th>{unitData.startingHp}</th>
                <th><input type="button" name="remove" id={unitData.key} value="-" onClick={this.removeUnit}/></th>
            </tr>;

            allRows.push(newRow);
        }

        return allRows;
    }

    private removeUnit: FormEventHandler<HTMLInputElement> = e => {
        const heroKey = e.currentTarget.id;
        this.props.onRemoveUnit(heroKey);
    }


}
