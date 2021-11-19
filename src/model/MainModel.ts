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
}


export class MainModel {
    public readonly allUnits: UnitData[] = [];

}