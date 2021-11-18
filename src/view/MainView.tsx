import {Component} from "react";
import { CombatTable, UnitData } from "./CombatTable";
import { HeroData, HeroTable } from "./HeroTable";
import { UserControls, SpawnData } from "./UserControls";
import { v4 as uuid } from 'uuid';
export class MainView extends Component<{},{allNpcs:Omit<UnitData, "order">[], allHeroes:Omit<UnitData, "order">[]}> {
    public state = {
        allNpcs: [],
        allHeroes: [],
    }

    public render(){
        return <>
            <CombatTable allUnits={this.assignOrder([...this.state.allHeroes,...this.state.allNpcs])} onRemoveUnit={this.onRemoveUnit}/>
            <UserControls onSubmit={this.onSpawnSubmit}/>
            <HeroTable onAddHero={this.onAddHero}/>
        </>;
    }

    private onRemoveUnit = (uuid:string): void => {
        this.setState(prevState => {
            const heroIndex = prevState.allHeroes.findIndex(h => h.key === uuid);
            const npcIndex = prevState.allNpcs.findIndex(n => n.key === uuid);
            if(heroIndex > -1) {
                prevState.allHeroes.splice(heroIndex, 1);
            } else if (npcIndex > -1) {
                prevState.allNpcs.splice(npcIndex, 1);
            }
            return {
                allHeroes: [...prevState.allHeroes],
                allNpcs: [...prevState.allNpcs],
            }
        });

    }

    private onAddHero = (hero: HeroData) => {
        const newHero = {
            currentHp: 0,
            initiative: hero.initiative,
            initiativeMod: 0,
            initiativeRoll: hero.initiative,
            name: hero.name,
            startingHp: 0,
            key: uuid(),
        }
        this.setState(prevState => ({allHeroes:[...prevState.allHeroes, newHero]}));
    }

    private onSpawnSubmit = (spawnData: SpawnData) => {
        const newUnits:Omit<UnitData, "order">[] = [];
        for(let i=0; i<spawnData.count; i++) {
            const newUnit = this.createNpc(spawnData);
            if(spawnData.count > 1) {
                newUnit.name = `${newUnit.name} ${i+1}`;
            }
            newUnits.push(newUnit);
        }

        this.setState(prevState => ({
            allNpcs: [...prevState.allNpcs, ...newUnits],
        }));
    }

    private createNpc(spawnData: SpawnData): Omit<UnitData, "order"> {
        const initativeRoll = getRandomInt(1, 20);
        return {
            currentHp: spawnData.hp,
            initiativeMod: spawnData.initiativeMod,
            initiativeRoll: initativeRoll,
            initiative: initativeRoll + spawnData.initiativeMod,
            name: spawnData.name,
            startingHp: spawnData.hp,
            key: uuid(),
        };
    }

    private assignOrder(allUnits:Omit<UnitData, "order">[]): UnitData[] {
        const sorted = [...allUnits].sort((a, b) => b.initiative - a.initiative);
        const withOrder: UnitData[] = allUnits as UnitData[];
        for (let unit of withOrder) {
            unit.order = sorted.indexOf(unit);
        }
        return withOrder;
    }

}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}