import React from "react";

const ContainerComponent = ({children}: {children?: React.ReactNode}) => {
    return (
        <div>{children}</div>
    )
};

export default ContainerComponent;
