import ReactDOM from "react-dom";
import { MainController } from "./controller/MainController";
import { MainView } from "./view/MainView";

window.onload = () => {
    const controller = new MainController();
    const appContainer = document.createElement("div");
    document.body.append(appContainer);

    const mainView = <MainView controller={controller}/>;
    const render = () => ReactDOM.render(mainView,appContainer);

    controller.onUpdate = render;
    render();
}