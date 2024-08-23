import {ReactNode} from "react";


const ToolbarDropdown = ({isActive, children}: {isActive?: boolean, children: ReactNode})=>{
    if (!isActive) {
        return undefined;
    }
    return (
        <div className="toolbar-params-dropdown">
            {children}
        </div>
    );
};

export default ToolbarDropdown;
