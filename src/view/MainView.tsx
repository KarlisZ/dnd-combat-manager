import {Component} from "react";
import { CombatTable } from "./CombatTable";
import { HeroTable } from "./HeroTable";
import { SpawnControls } from "./SpawnControls";
import { MainController } from "../controller/MainController";
export class MainView extends Component<{controller:MainController},{}> {
    public render(){
        return <>
            <CombatTable controller={this.props.controller}/>
            <SpawnControls onSubmit={this.props.controller.addNpc}/>
            <HeroTable onAddHero={this.props.controller.addHero}/>
        </>;
    }
}
