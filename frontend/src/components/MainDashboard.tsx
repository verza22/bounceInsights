import * as React from "react";
import { useState, useRef, useEffect } from "react";

import Header from "./Header";
import Dashboard, { DashboardRef } from "./Dashboard";

const MainDashboard: React.FC = () => {

    const dashboardRef = useRef<DashboardRef>(null);

    const addWidgetToLayout = (widget: Widget) => {
        dashboardRef.current?.addWidgetToLayout(widget);
    }
   
    return (
        <div>
            <div id='edit_target' className="control-section">
                <Header addWidgetToLayout={addWidgetToLayout} />
                <Dashboard ref={dashboardRef} />
            </div>
            
        </div>
    );
};

export default MainDashboard;