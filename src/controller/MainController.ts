import { v4 as uuid } from 'uuid';
import { MainModel, StatusData, UnitData } from '../model/MainModel';



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

// export const UnitCondition = {
//     Blinded: "Blinded",
//     Charmed: "Charmed",
//     Deafened: "Deafened",
//     Frightened: "Frightened",
//     Incapacitated: "Incapacitated",
//     Invisible: "Invisible",
//     Paralyzed: "Paralyzed",
//     Poisoned: "Poisoned",
//     Prone: "Prone",
//     Stunned: "Stunned",
//     Restrained: "Restrained",
// }

export enum UnitCondition {
    Blinded,
    Charmed,
    Deafened,
    Frightened,
    Incapacitated,
    Invisible,
    Paralyzed,
    Poisoned,
    Prone,
    Stunned,
    Restrained,
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

    public getStatuses(unit: UnitData, round: number):StatusData[] {
        const activeStatuses: StatusData[] = [];
        for (let i=0; i<round; i++) {
            const statuses = unit.roundStatus[i];
            activeStatuses.push(...statuses.filter(s => s.endsRound >= round));
        }
        return activeStatuses;
    }

    private addUnit = (unitData:Omit<UnitData, "order" | "uuid" | "roundHp" | "roundStatus">, pushNotUnshift = true) => {
        const data:UnitData = {
            ...unitData,
            order: 0,
            uuid: uuid(),
            roundHp: new Array(100).fill(0),
            roundStatus: Array.from(new Array(100), () => []),
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


    public addStatus = (id: string, round: number, duration:number, statusId:UnitCondition) => {
        const unit = this.model.allUnits.find(u => u.uuid === id);
        if(!unit) throw new Error(`no such unit ${id}`);
        const endsRound = round+duration;
        const activeStatuses = this.getStatuses(unit, round);
        const possibleDuplicate = activeStatuses.find(s => s.statusId === statusId);
        if(possibleDuplicate) {
            possibleDuplicate.endsRound = Math.max(endsRound, possibleDuplicate.endsRound);
        } else {
            unit.roundStatus[round-1].push({statusId, endsRound});
        }

        this.onUpdate?.();
    }

    public addHpChange = (id: string, round: number, value:number) => {
        const unit = this.model.allUnits.find(u => u.uuid === id);
        if(!unit) throw new Error(`no such unit ${id}`);

        unit.roundHp[round-1] = value;
        this.updateHp(unit);
        this.onUpdate?.();
    }

    public setStartingHp = (id:string, hp:number) => {
        const unit = this.model.allUnits.find(u => u.uuid === id);
        if(!unit) throw new Error(`no such unit ${id}`);
        unit.startingHp = hp
        this.updateHp(unit);
        this.onUpdate?.();
    }

    public setInitiativeRoll = (id:string, roll:number) => {
        const unit = this.model.allUnits.find(u => u.uuid === id);
        if(!unit) throw new Error(`no such unit ${id}`);
        unit.initiativeRoll = roll;
        unit.initiative = roll + unit.initiativeMod;
        this.updateOrder();
        this.onUpdate?.();
    }

    public setInitiativeMod = (id:string, mod:number) => {
        const unit = this.model.allUnits.find(u => u.uuid === id);
        if(!unit) throw new Error(`no such unit ${id}`);
        unit.initiativeMod = mod;
        unit.initiative = unit.initiativeRoll + mod;
        this.updateOrder();
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