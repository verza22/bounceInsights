import React, { useRef, useEffect, forwardRef, useImperativeHandle, useCallback, createRef } from "react";

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
import i18n from "../i18n";

export interface DashboardRef {
    addWidgetToLayout: (widget: Widget) => void,
    changeLayout: (widgetsAux: Widget[]) => void
}

const Dashboard = forwardRef<DashboardRef>((_, ref) => {

    const { widgets, removeWidget, updateWidgets } = useWidgetStore();
    const { editMode } = useAppStore(); 

    const widgetRefMap = useRef<Record<number, React.RefObject<WidgetRef | null>>>({});
    const apodRefMap = useRef<Record<number, React.RefObject<ApodRef | null>>>({});
    const curiosityRefMap = useRef<Record<number, React.RefObject<CuriosityRef | null>>>({});
    const quizRefMap = useRef<Record<number, React.RefObject<QuizRef | null>>>({});

    const dashboardObj = useRef<DashboardLayoutComponent>(null);

    const cellSpacing: [number, number] = [10, 10];
    const isFirstRun = useRef(true);

    useEffect(()=> {
        //add widgets first load
        widgets.map((widget: Widget) =>{
            addWidgetToLayout(widget);
        });
    }, []);

    useEffect(() => {
        //refresh all widget when change lang
        if (isFirstRun.current) {
          isFirstRun.current = false;
          return;
        }

        widgets.map((widget: Widget) =>{
            refreshWidget(widget.id);
        });
      }, [i18n.language]);

    useImperativeHandle(ref, () => ({
        addWidgetToLayout,
        changeLayout
    }));

    const changeLayout = useCallback((widgetsAux: Widget[]) => {
        //remove old widgets
        widgets.map((widget: Widget) =>{
            deleteWidget(widget.id);
        });

        //add to store
        updateWidgets(widgetsAux);

        //add to layout
        widgetsAux.map((widget: Widget) =>{
            addWidgetToLayout(widget);
        });
    }, []);

    const addWidgetToLayout = useCallback((widget: Widget) => {
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
            widgetRefMap.current[id] = createRef<WidgetRef>();
        }        
    
        let content: (props: { setLoading: (val: boolean) => void, setError: (msg: string) => void }) => React.ReactNode;

        switch (type) {
            default:
            case "apod":
                if (!apodRefMap.current[id]) {
                    apodRefMap.current[id] = createRef<ApodRef>();
                }
                content = ({ setLoading, setError }) => (
                    <Apod setLoading={setLoading} setError={setError} ref={apodRefMap.current[id]} />
                );
            break;
            case "neo":
                content = ({ setLoading, setError }) => (
                    <Neo id={id} setLoading={setLoading} setError={setError} changeDateFrom={changeDateFrom} />
                );
            break;
            case "cme":
                content = ({ setLoading, setError }) => (
                    <Cme id={id} setLoading={setLoading} setError={setError} />
                );
            break;
            case "gst":
                content = ({ setLoading, setError }) => (
                    <Gst id={id} setLoading={setLoading} setError={setError} changeDateFrom={changeDateFrom} />
                );
            break;
            case "insight":
                content = ({ setLoading, setError }) => (
                    <InSight id={id} setLoading={setLoading} setError={setError} />
                );
            break;
            case "curiosity":
                if (!curiosityRefMap.current[id]) {
                    curiosityRefMap.current[id] = createRef<CuriosityRef>();
                }
                content = ({ setLoading, setError }) => (
                    <Curiosity setLoading={setLoading} setError={setError} ref={curiosityRefMap.current[id]} />
                );
            break;
            case "quiz":
                if (!quizRefMap.current[id]) {
                    quizRefMap.current[id] = createRef<QuizRef>();
                }
                content = ({ setLoading, setError }) => (
                    <Quiz setLoading={setLoading} setError={setError} ref={quizRefMap.current[id]} />
                );
            break;
        }
    
        return <Widget 
            id={id} 
            ref={widgetRefMap.current[id]}
            removeWidget={deleteWidget}
        >{content}</Widget>;
    };

    const deleteWidget = useCallback((id: number) => {
        removeWidget(id);//remove from store
        widgetRefMap.current[id]?.current?.unmountWidget();//unmount widget
        dashboardObj.current?.removePanel('_layout' + id);//remove from layout
    }, []);

    const refreshWidget = (id: number) => {
        widgetRefMap.current[id]?.current?.refresh();
    };

    const changeDateFrom = useCallback((dateFrom: string) => {
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

    const onChange = () => {
        //update widgets size and position
        let widgetsAux = [...widgets];
        widgetsAux.map(w => {
            const i = dashboardObj.current?.panels.findIndex(x=> x.id === '_layout' + w.id);
            if(typeof i === "number" && i >= 0 && dashboardObj.current?.panels[i]){
                const widgetLayout = dashboardObj.current?.panels[i];

                w.col = widgetLayout.col ?? 0;
                w.row = widgetLayout.row ?? 0;
                w.sizeX = widgetLayout.sizeX ?? 2;
                w.sizeY = widgetLayout.sizeY ?? 2;
            }
        });

        updateWidgets(widgetsAux);
    };

    return <ErrorBoundary>
        <DashboardLayoutComponent
            columns={4}
            cellSpacing={cellSpacing}
            ref={dashboardObj}
            allowResizing={editMode}
            allowDragging={editMode}
            showGridLines={editMode}
            allowFloating={false}
            dragStop={onChange}
            resizeStop={onChange}
        >
        </DashboardLayoutComponent>
    </ErrorBoundary>
});

export default Dashboard;