import React from "react";
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

import { DashboardLayoutComponent } from "@syncfusion/ej2-react-layouts";

import { useWidgetStore } from "../store/useWidgetStore";
import { useAppStore } from "../store/useAppStore";

import Header from "./widgets/Header";
import ErrorBoundary from "./ErrorBoundary";
import Widget, { WidgetRef } from "./widgets/Widget";

import Apod, { ApodRef } from "./widgets/Apod";
import Neo from "./widgets/Neo";
import Cme from "./widgets/Cme";
import Gst from "./widgets/Gst";
import InSight from "./widgets/InSight";
import Curiosity, { CuriosityRef } from "./widgets/Curiosity";
import Quiz, { QuizRef } from "./widgets/Quiz";

export interface DashboardRef {
    addWidgetToLayout: (widget: Widget) => void;
}

const Dashboard = forwardRef<DashboardRef>((_, ref) => {

    const { widgets, removeWidget } = useWidgetStore();
    const { editMode } = useAppStore(); 

    const widgetRefMap = useRef<Record<number, React.RefObject<WidgetRef | null>>>({});
    const apodRefMap = useRef<Record<number, React.RefObject<ApodRef | null>>>({});
    const curiosityRefMap = useRef<Record<number, React.RefObject<CuriosityRef | null>>>({});
    const quizRefMap = useRef<Record<number, React.RefObject<QuizRef | null>>>({});

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

    const addWidgetToLayout = React.useCallback((widget: Widget) => {
        const panel = {
            id: '_layout' + widget.id,
            sizeX: widget.sizeX,
            sizeY: widget.sizeY,
            row: widget.row,
            col: widget.col,
            header: () => <Header id={widget.id} onClick={refreshWidget} type={widget.type}/>,
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
                if (!apodRefMap.current[id]) {
                    apodRefMap.current[id] = React.createRef<ApodRef>();
                }
                content = ({ setLoading }) => (
                    <Apod setLoading={setLoading} ref={apodRefMap.current[id]} />
                );
            break;
            case "neo":
                content = ({ setLoading }) => (
                    <Neo id={id} setLoading={setLoading} changeDateFrom={changeDateFrom} />
                );
            break;
            case "cme":
                content = ({ setLoading }) => (
                    <Cme id={id} setLoading={setLoading} />
                );
            break;
            case "gst":
                content = ({ setLoading }) => (
                    <Gst id={id} setLoading={setLoading} changeDateFrom={changeDateFrom} />
                );
            break;
            case "insight":
                content = ({ setLoading }) => (
                    <InSight id={id} setLoading={setLoading} />
                );
            break;
            case "curiosity":
                if (!curiosityRefMap.current[id]) {
                    curiosityRefMap.current[id] = React.createRef<CuriosityRef>();
                }
                content = ({ setLoading }) => (
                    <Curiosity setLoading={setLoading} ref={curiosityRefMap.current[id]} />
                );
            break;
            case "quiz":
                if (!quizRefMap.current[id]) {
                    quizRefMap.current[id] = React.createRef<QuizRef>();
                }
                content = ({ setLoading }) => (
                    <Quiz setLoading={setLoading} ref={quizRefMap.current[id]} />
                );
            break;
        }
    
        return <Widget 
            id={id} 
            ref={widgetRefMap.current[id]}
            removeWidget={deleteWidget}
        >{content}</Widget>;
    };

    const deleteWidget = React.useCallback((id: number) => {
        removeWidget(id);//remove from store
        widgetRefMap.current[id]?.current?.unmountWidget();//unmount widget
        dashboardObj.current?.removePanel('_layout' + id);//remove from layout
    }, []);

    const refreshWidget = (id: number) => {
        widgetRefMap.current[id]?.current?.refresh();
    };

    const changeDateFrom = React.useCallback((dateFrom: string) => {
        for (const ref of Object.values(apodRefMap.current)) {
            if (ref?.current) {
                ref.current?.getApodData(dateFrom);
            }
        }
        for (const ref of Object.values(curiosityRefMap.current)) {
            if (ref?.current) {
                ref.current?.getCuriosityData(dateFrom);
            }
        }
        for (const ref of Object.values(quizRefMap.current)) {
            if (ref?.current) {
                ref.current?.getQuizData(dateFrom);
            }
        }
    }, []);

    // const onPanelResize = (args: ResizeArgs) => {
    //     const chartEl = args.element?.querySelector('.e-panel-container .e-panel-content div div') as any;
    //     const chartObj = chartEl?.ej2_instances?.[0] as ChartComponent;
    //     if (chartObj) {
    //         chartObj.height = '95%';
    //         chartObj.width = '100%';
    //         chartObj.refresh();
    //     }
    // };

    return <ErrorBoundary>
        <DashboardLayoutComponent
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
    </ErrorBoundary>
});

export default Dashboard;