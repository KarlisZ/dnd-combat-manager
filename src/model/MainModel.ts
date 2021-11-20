import { UnitCondition } from "../controller/MainController";

export interface StatusData {
    statusId:UnitCondition,
    endsRound:number,
    turnAppliedUnitId:string,
}
export interface UnitData {
    turnOrder: number;
    name: string;
    currentHp: number;
    initiative: number;
    initiativeRoll: number;
    initiativeMod: number;
    startingHp: number;
    uuid: string;
    roundHp: number[];
    roundStatus: StatusData[][];
}

interface FullUnitData extends UnitData {
    showOrderPriority: number;
}

export class MainModel {
    private readonly allUnits: Record<string, FullUnitData> = {}; // TODO need to somehow index by id, this looping to find by id is horrible
    private numUnits: number = 0;

    public getUnitById(id:string): UnitData {
        return this.allUnits[id];
    }

    public getUnitByOrder(order:number): UnitData {
        const unit = this.getUnitsArray().find(u => u.turnOrder === order);
        if(!unit) throw new Error(`no such unit with order ${order}`);
        return unit;
    }

    public removeUnit (uuid:string): void {
        delete this.allUnits[uuid];
        this.numUnits--;
    }

    public addUnit (data:UnitData, position: "start" | "end" = "end"): void {
        const fullData = data as FullUnitData;
        fullData.showOrderPriority = position === "start" ? -this.numUnits : this.numUnits;
        this.allUnits[data.uuid] = fullData;
        this.numUnits++;
    }

    public updateOrder():void {
        const sorted = this.getUnitsArray().sort((a,b) => b.initiative - a.initiative);
        for(let i = 0; i< sorted.length; i++) {
            sorted[i].turnOrder = i+1;
        }
    }

    private getUnitsArray(): FullUnitData[] {
        return Object.values(this.allUnits);
    }

    public getUnitsInShowOrder(): UnitData[] {
        const sorted = this.getUnitsArray().sort((a,b) => a.showOrderPriority - b.showOrderPriority);
        return sorted;
    }
}