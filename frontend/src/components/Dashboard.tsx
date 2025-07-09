import * as React from "react";
import { useState, useRef, useEffect } from "react";

import { DashboardLayoutComponent, PanelsDirective, PanelDirective, ResizeArgs } from "@syncfusion/ej2-react-layouts";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { DialogComponent } from '@syncfusion/ej2-react-popups';

import DateRangeSelector from "./DateRangeSelector";
import Apod from "./widgets/Apod";
import Neo from "./widgets/Neo";
import Cme from "./widgets/Cme";
import Gst from "./widgets/Gst";
import InSight from "./widgets/InSight";
import Curiosity from "./widgets/Curiosity";

const Dashboard: React.FC = () => {
    const btnobj = useRef<ButtonComponent>(null);
    const dashboardObj = useRef<DashboardLayoutComponent>(null);
    const lineObj = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isResizing, setResizing] = useState<boolean>(false);
    const [btnContent, setBtnContent] = useState<string>('Edit');
    const [icon, setIcon] = useState<string>('edit');
    const [display, setDisplay] = useState<'none' | 'block'>('none');
    const [isVisible, setIsVisible] = useState<boolean>(false);

    let count = 4;
    const cellSpacing: [number, number] = [10, 10];
    const loc = window.location;

    const btnClick = () => {
        if (btnobj.current?.element.classList.contains('e-active')) {
            setIsDragging(true);
            setResizing(true);
            setBtnContent("Save");
            setIcon("save");
            setDisplay("block");
        } else {
            setIsDragging(false);
            setResizing(false);
            setBtnContent("Edit");
            setIcon("edit");
            setDisplay("none");
        }
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

    const dlgClick = () => {
        setIsVisible(true);
        if (lineObj.current) {
            lineObj.current.onclick = () => {
                const countValue = count.toString();
                const panel = [{
                    id: '_layout' + countValue,
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    header: '<div>Apod</div>',
                    content: apodTemplate
                }];
                count = count + 1;
                dashboardObj.current?.addPanel(panel[0]);
                setIsVisible(false);
                setTimeout(() => {
                    const chart = document.getElementById("_layout" + countValue)?.querySelector(".e-control.e-chart") as any;
                    chart?.ej2_instances?.[0]?.refresh();
                }, 20);
            };
        }
    };

    const content = () => (
        <div id="dialogcontent">
            <div>
                <div id="apodtemplate" ref={lineObj}>
                    <p className="dialog-text">Linechart (1x1)</p>
                </div>
            </div>
        </div>
    );

    const apodTemplate = () => {
        return (
            <div className="template">
                <Apod/>
            </div>
        );
    };

    const neoTemplate = () => {
        return (
            <div className="template">
                <Neo/>
            </div>
        );
    };

    const cmeTemplate = () => {
        return (
            <div className="template">
                <Cme/>
            </div>
        );
    };

    const gstTemplate = () => {
        return (
            <div className="template">
                <Gst/>
            </div>
        );
    };

    const inSightTemplate = () => {
        return (
            <div className="template">
                <InSight/>
            </div>
        );
    };

    const curiosityTemplate = () => {
        return (
            <div className="template">
                <Curiosity/>
            </div>
        );
    };

    return (
        <div>
            <div id='edit_target' className="control-section">
                <div>
                    <div className="flex">
                        <DateRangeSelector/>
                        <ButtonComponent
                            id="togglebtn"
                            cssClass='e-outline e-flat e-primary'
                            ref={btnobj}
                            iconCss={icon}
                            isToggle={true}
                            onClick={btnClick}
                        >
                            {btnContent}
                        </ButtonComponent>
                    </div>
                    <div style={{ padding: "5px", marginBottom: "5px", textAlign: "end" }}>
                        <div
                            id="dialogBtn"
                            className="add-widget-button e-control e-btn e-lib"
                            style={{ display: display }}
                            onClick={dlgClick}
                        >
                            Add New Widget
                        </div>
                    </div>
                </div>
                <DashboardLayoutComponent
                    id="edit_dashboard"
                    columns={2}
                    cellSpacing={cellSpacing}
                    ref={dashboardObj}
                    // resizeStop={onPanelResize}
                    allowResizing={isResizing}
                    allowDragging={isDragging}
                >
                    <PanelsDirective>
                        <PanelDirective
                            sizeX={1}
                            sizeY={1}
                            row={0}
                            col={0}
                            content={apodTemplate}
                            header={'<div class="text-center">Astronomy Picture of the Day</div>'}
                        />
                        <PanelDirective
                            sizeX={1}
                            sizeY={1}
                            row={0}
                            col={1}
                            content={neoTemplate}
                            header={'<div class="text-center">Near Earth Object</div>'}
                        />
                        <PanelDirective
                            sizeX={1}
                            sizeY={1}
                            row={1}
                            col={0}
                            content={cmeTemplate}
                            header={'<div class="text-center">Coronal Mass Ejection</div>'}
                        />
                        <PanelDirective
                            sizeX={1}
                            sizeY={1}
                            row={1}
                            col={1}
                            content={gstTemplate}
                            header={'<div class="text-center">GST</div>'}
                        />
                        <PanelDirective
                            sizeX={1}
                            sizeY={1}
                            row={2}
                            col={0}
                            content={inSightTemplate}
                            header={'<div class="text-center">InSight</div>'}
                        />
                        <PanelDirective
                            sizeX={1}
                            sizeY={1}
                            row={2}
                            col={1}
                            content={curiosityTemplate}
                            header={'<div class="text-center">Curiosity</div>'}
                        />
                    </PanelsDirective>
                </DashboardLayoutComponent>
            </div>
            <DialogComponent
                id="listdialog"
                width="500px"
                height="260px"
                visible={isVisible}
                header={"Add a widget"}
                showCloseIcon={true}
                animationSettings={{ effect: 'Zoom' }}
                isModal={true}
                target='#edit_target'
                content={content}
            />
        </div>
    );
};

export default Dashboard;