import React from "react";
import { useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from "react";

import { DashboardLayoutComponent } from "@syncfusion/ej2-react-layouts";

import { useWidgetStore } from "../store/useWidgetStore";

import Header from "./widgets/Header";
import Apod from "./widgets/Apod";
import Neo from "./widgets/Neo";
import Cme from "./widgets/Cme";
import Gst from "./widgets/Gst";
import InSight from "./widgets/InSight";
import Curiosity from "./widgets/Curiosity";
import Widget, { WidgetRef } from "./widgets/Widget";
import { useAppStore } from "../store/useAppStore";

export interface DashboardRef {
    addWidgetToLayout: (widget: Widget) => void;
}

const Dashboard = forwardRef<DashboardRef>((_, ref) => {

    const { widgets, removeWidget } = useWidgetStore();
    const { editMode } = useAppStore(); 

    const widgetRefMap = useRef<Record<number, React.RefObject<WidgetRef | null>>>({});
    const dashboardObj = useRef<DashboardLayoutComponent>(null);

    const cellSpacing: [number, number] = [10, 10];

    useEffect(()=> {
        //add widgets first load
        widgets.map((widget: Widget) =>{
            addWidgetToLayout(widget);
        });
    }, []);

    useImperativeHandle(ref, () => ({
        addWidgetToLayout
    }));

    const addWidgetToLayout = useCallback((widget: Widget) => {
        const panel = {
            id: '_layout' + widget.id,
            sizeX: widget.sizeX,
            sizeY: widget.sizeY,
            row: widget.row,
            col: widget.col,
            header: () => <Header id={widget.id} onClick={refreshWidget} title={widget.title}/>,
            content: () => widgetTemplate(widget.id, widget.type)
        };
        dashboardObj.current?.addPanel(panel);
    }, []);

    const widgetTemplate = (id: number, type: WidgetType) => {

        if (!widgetRefMap.current[id]) {
            widgetRefMap.current[id] = React.createRef<WidgetRef>();
        }        
    
        let content: (props: { setLoading: (val: boolean) => void }) => React.ReactNode;

        switch (type) {
            default:
            case "apod":
            content = ({ setLoading }) => (
                <Apod setLoading={setLoading} />
            );
            break;
            case "neo":
            content = ({ setLoading }) => (
                <Neo id={id} setLoading={setLoading} />
            );
            break;
            case "cme":
            content = ({ setLoading }) => (
                <Cme id={id} setLoading={setLoading} />
            );
            break;
            case "gst":
            content = ({ setLoading }) => (
                <Gst id={id} setLoading={setLoading} />
            );
            break;
            case "insight":
            content = ({ setLoading }) => (
                <InSight id={id} setLoading={setLoading} />
            );
            break;
            case "curiosity":
            content = ({ setLoading }) => (
                <Curiosity setLoading={setLoading} />
            );
            break;
        }
    
        return <Widget 
            id={id} 
            ref={widgetRefMap.current[id]}
            removeWidget={deleteWidget}
        >{content}</Widget>;
    };

    const deleteWidget = (id: number) => {
        removeWidget(id);//remove from store
        widgetRefMap.current[id]?.current?.unmountWidget();//unmount widget
        dashboardObj.current?.removePanel('_layout' + id);//remove from layout
    };

    const refreshWidget = (id: number) => {
        widgetRefMap.current[id]?.current?.refresh();
    };

    // const onPanelResize = (args: ResizeArgs) => {
    //     const chartEl = args.element?.querySelector('.e-panel-container .e-panel-content div div') as any;
    //     const chartObj = chartEl?.ej2_instances?.[0] as ChartComponent;
    //     if (chartObj) {
    //         chartObj.height = '95%';
    //         chartObj.width = '100%';
    //         chartObj.refresh();
    //     }
    // };

    return <DashboardLayoutComponent
        id="edit_dashboard"
        columns={4}
        cellSpacing={cellSpacing}
        ref={dashboardObj}
        // resizeStop={onPanelResize}
        allowResizing={editMode}
        allowDragging={editMode}
        showGridLines={editMode}
    >
    </DashboardLayoutComponent>
});

export default Dashboard;