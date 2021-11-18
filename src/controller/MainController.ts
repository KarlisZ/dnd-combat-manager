import { v4 as uuid } from 'uuid';


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

interface RoundData {
    hpChange: {id:string, value:number}[];
}

export interface HeroData {
    name: string;
    initiative: number;
}

export interface SpawnData {
    name:string,
    hp:number,
    initiativeMod:number,
    count:number,
}


export class MainController {
    public readonly allUnits: UnitData[] = [];
    public onUpdate?: () => void;

    public addHero = (hero:HeroData) => {
        this.allUnits.unshift({
            order: 0,
            currentHp: 10,
            initiative: hero.initiative,
            initiativeMod: 0,
            initiativeRoll: hero.initiative,
            name: hero.name,
            startingHp: 10,
            uuid: uuid(),
            roundHp: [],
        });
        this.updateOrder();
        this.onUpdate?.();
    }

    public addNpc = (spawnData:SpawnData) => {
        const initativeRoll = getRandomInt(1, 20);
        this.allUnits.push({
            order: 0,
            currentHp: spawnData.hp,
            initiativeMod: spawnData.initiativeMod,
            initiativeRoll: initativeRoll,
            initiative: initativeRoll + spawnData.initiativeMod,
            name: spawnData.name,
            startingHp: spawnData.hp,
            uuid: uuid(),
            roundHp: [],
        });
        this.updateOrder();
        this.onUpdate?.();
    }

    public removeUnit = (uuid:string): void => {
        this.allUnits.splice(this.allUnits.findIndex(u => u.uuid === uuid), 1);
    }


    public addHpChange(id: string, round: number, value:number) {
        const unit = this.allUnits.find(u => u.uuid === id);
        if(!unit) throw new Error(`no such unit ${id}`);

        unit.roundHp[round] = value;
        this.updateHp(unit);
        this.onUpdate?.();
    }

    private updateHp(unit: UnitData) {
        let hpChange = 0;
        for (const roundChange of unit.roundHp) {
            hpChange += roundChange;
        }
        unit.currentHp = unit.startingHp + hpChange;
    }

    private updateOrder():void {
        const sorted = [...this.allUnits].sort((a,b) => b.initiative - a.initiative);
        for(let i = 0; i< sorted.length; i++) {
            sorted[i].order = i+1;
        }
    }
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}