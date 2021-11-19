import { v4 as uuid } from 'uuid';
import { MainModel, UnitData } from '../model/MainModel';



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
    public constructor(private model:MainModel) {

    }
    public onUpdate?: () => void;

    public addHero = (hero:HeroData) => {
        this.addUnit({
            currentHp: 10,
            initiative: hero.initiative,
            initiativeMod: 0,
            initiativeRoll: hero.initiative,
            name: hero.name,
            startingHp: 10,
        }, false);
    }

    public addNpc = (spawnData:SpawnData) => {
        const initativeRoll = getRandomInt(1, 20);
        this.addUnit({
            currentHp: spawnData.hp,
            initiativeMod: spawnData.initiativeMod,
            initiativeRoll: initativeRoll,
            initiative: initativeRoll + spawnData.initiativeMod,
            name: spawnData.name,
            startingHp: spawnData.hp,
        });
    }

    private addUnit = (unitData:Omit<UnitData, "order" | "uuid" | "roundHp">, pushNotUnshift = true) => {
        const data:UnitData = {
            ...unitData,
            order: 0,
            uuid: uuid(),
            roundHp: new Array(100).fill(0),
        };

        if(pushNotUnshift) {
            this.model.allUnits.push(data);
        } else {
            this.model.allUnits.unshift(data);
        }

        this.updateOrder();
        this.onUpdate?.();
    }

    public removeUnit = (uuid:string): void => {
        this.model.allUnits.splice(this.model.allUnits.findIndex(u => u.uuid === uuid), 1);
        this.updateOrder();
        this.onUpdate?.();
    }


    public addHpChange = (id: string, round: number, value:number) => {
        const unit = this.model.allUnits.find(u => u.uuid === id);
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
        const sorted = [...this.model.allUnits].sort((a,b) => b.initiative - a.initiative);
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