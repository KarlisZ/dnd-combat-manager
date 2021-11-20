import { UnitCondition } from "../controller/MainController";

export interface StatusData {
    statusId:UnitCondition,
    endsRound:number,
    turnAppliedUnitId:string,
}
export interface UnitData {
    order: number;
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

export class MainModel {
    private readonly allUnits: UnitData[] = []; // TODO need to somehow index by id, this looping to find by id is horrible

    public getUnitById(id:string): UnitData {
        const unit = this.allUnits.find(u => u.uuid === id);
        if(!unit) throw new Error(`no such unit with id ${id}`);
        return unit;
    }

    public getUnitByOrder(order:number): UnitData {
        const unit = this.allUnits.find(u => u.order === order);
        if(!unit) throw new Error(`no such unit with order ${order}`);
        return unit;
    }

    public removeUnit (uuid:string): void {
        this.allUnits.splice(this.allUnits.findIndex(u => u.uuid === uuid), 1);
    }

    public addUnit (data:UnitData, position: "start" | "end" = "end"): void {
        switch (position) {
            case "start":
                this.allUnits.unshift(data);
                break;

            case "end":
                this.allUnits.push(data);
                break;

            default:
                throw new Error("invalid position");
        }
    }

    public updateOrder():void {
        const sorted = [...this.allUnits].sort((a,b) => b.initiative - a.initiative);
        for(let i = 0; i< sorted.length; i++) {
            sorted[i].order = i+1;
        }
    }

    public duplicateAllUnits(): UnitData[] {
        return [...this.allUnits];
    }
}