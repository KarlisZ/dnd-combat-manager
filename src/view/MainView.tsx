import { Component } from "react";
import { CombatTable } from "./combat/CombatTable";
import { HeroTable } from "./HeroTable";
import { SpawnControls } from "./SpawnControls";
import { MainController } from "../controller/MainController";
import { MainModel, UnitData } from "../model/MainModel";
export class MainView extends Component<{controller:MainController; model:MainModel;},{allUnits:UnitData[];}> {
    public state = {
        allUnits: [],
    };
    public constructor(props:{controller:MainController; model:MainModel;}) {
        super(props);
        this.props.controller.onUpdate = () => this.setState({ allUnits:this.props.model.getUnitsInShowOrder() });
    }

    public render(){
        return <div className="app-container">
            <CombatTable controller={this.props.controller} allUnits={this.state.allUnits}/>
            <SpawnControls onSubmit={this.props.controller.addNpc}/>
            <HeroTable onAddHero={this.props.controller.addHero}/>
            <label>Save?</label>
            <input type="checkbox" defaultChecked={true} />
            <p>Ideas:
                 collapse unnecessary columns;
                  save to unique id;
                   round scroller;
                    remove status;
                     click to select round;
                      apply status to multiple units;
                      show input field after click to save space;
            </p>
        </div>;
    }
}
