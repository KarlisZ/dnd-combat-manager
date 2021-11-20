import { UnitCondition } from "../controller/MainController";

export interface StatusData {
    statusId:UnitCondition, endsRound:number
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
    public readonly allUnits: UnitData[] = [];

}