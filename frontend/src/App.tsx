import * as React from "react";
import { useState, useRef, useEffect } from "react";

import Header from "./components/Header";
import Dashboard, { DashboardRef } from "./components/Dashboard";
import WebSocket from "./components/Websocket";
import { useAppStore } from "./store/useAppStore";

const App: React.FC = () => {

    const dashboardRef = useRef<DashboardRef>(null);
    const { initializeLang } = useAppStore();

    const addWidgetToLayout = (widget: Widget) => {
        dashboardRef.current?.addWidgetToLayout(widget);
    }

    React.useEffect(() => {
      initializeLang();
    }, []);
   
    return <>
        <div id='edit_target' className="control-section">
            <Header addWidgetToLayout={addWidgetToLayout} />
            <Dashboard ref={dashboardRef} />
        </div>
        
        <WebSocket/>
    </>;
};

export default App;