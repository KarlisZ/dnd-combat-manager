import { Component } from "react";

export class CombatControls extends Component<{onNewCombat:() => void; onPrevTurn:()=>void;onNextTurn:()=>void;}> {
    public render() {
        return <div>
            <p>Combat Controls</p>
            <input type="button" value="New Combat" onClick={this.props.onNewCombat}/>
            <input type="button" value="Prev Turn" onClick={this.props.onPrevTurn}/>
            <input type="button" value="Next Turn" onClick={this.props.onNextTurn}/>
        </div>;
    }
}
