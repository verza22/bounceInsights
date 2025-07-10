import React, { useState, useImperativeHandle, forwardRef, useCallback } from "react";
import Icon from '@mdi/react';
import { mdiLoading, mdiTrashCan } from '@mdi/js';

import { useAppStore } from "../../store/useAppStore";

export interface WidgetRef {
  refresh: () => void;
  unmountWidget: () => void;
}

interface WidgetProps {
  id: number,
  removeWidget: (id: number) => void,
  children: (props: { loading: boolean; setLoading: (val: boolean) => void }) => React.ReactNode;
}

  const Widget = forwardRef<WidgetRef, WidgetProps>(({ children, id, removeWidget }, ref) => {
    const [mount, setMount] = useState(true);
    const [loading, setLoading] = useState(false);
    const { editMode } = useAppStore();
  
    const refresh = useCallback(() => {
      setMount(false);
      setTimeout(() => setMount(true), 0);
    }, []);

    const unmountWidget = useCallback(() => {
      setMount(false);
    }, []);
  
    useImperativeHandle(ref, () => ({
      refresh,
      setLoading,
      unmountWidget
    }));
  
    return (
      <div className="template">
        {
          loading && 
          <div className="loading-widget">
            <div className="m-auto">
              <Icon path={mdiLoading} size={2} className="animate-spin"/>
            </div>
          </div>
        }
        {
          editMode && 
          <div className="edit-mode-widget">
            <div className="m-auto cursor-pointer" title="Remove widget" onClick={()=> removeWidget(id)}>
              <Icon path={mdiTrashCan} size={2} />
            </div>
          </div>
        }
        {mount ? children({ loading, setLoading }) : null}
      </div>
    );
  });

export default Widget;