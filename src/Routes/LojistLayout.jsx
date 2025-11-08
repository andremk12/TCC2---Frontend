import { Outlet } from "react-router-dom";
import SideMenu from "../components/SideMenu"

function LojistLayout() {
    return (
        <div>
            <SideMenu />
            <div>
                <Outlet/>
            </div>
        </div>
    )
}

export default LojistLayout