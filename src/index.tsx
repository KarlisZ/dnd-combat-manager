import ReactDOM from "react-dom";
import { MainView } from "./view/MainView";

window.onload = () => {
    const appContainer = document.createElement("div");
    document.body.append(appContainer);
    ReactDOM.render(<MainView/>,appContainer);
}