import {Component} from "react";
import { CombatTable } from "./CombatTable";
import { HeroTable } from "./HeroTable";
import { SpawnControls } from "./SpawnControls";
import { MainController } from "../controller/MainController";
import { MainModel, UnitData } from "../model/MainModel";
export class MainView extends Component<{controller:MainController, model:MainModel},{allUnits:UnitData[]}> {
    public state = {
        allUnits: [],
    }
    public constructor(props:{controller:MainController, model:MainModel}) {
        super(props);
        this.props.controller.onUpdate = () => this.setState({allUnits:[...this.props.model.allUnits]});
    }

    public render(){
        return <>
            <CombatTable controller={this.props.controller} allUnits={this.state.allUnits}/>
            <SpawnControls onSubmit={this.props.controller.addNpc}/>
            <HeroTable onAddHero={this.props.controller.addHero}/>
            <label>Save?</label>
            <input type="checkbox" defaultChecked={true} />
        </>;
    }
}
