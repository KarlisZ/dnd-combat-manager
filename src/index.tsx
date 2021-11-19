import React from "react";
import ReactDOM from "react-dom";
import { MainController } from "./controller/MainController";
import { MainModel } from "./model/MainModel";
import { MainView } from "./view/MainView";

const appContainer = document.createElement("div");

window.onload = () => {
    document.body.append(appContainer);
    const model = new MainModel();
    const controller = new MainController(model);
    
    const ref = React.createRef<MainView>();
    const mainView = <MainView controller={controller} model={model} ref={ref}/>;
    ReactDOM.render(mainView,appContainer);
}
