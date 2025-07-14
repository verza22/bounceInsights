import React, { useState, useImperativeHandle, forwardRef, useCallback } from "react";
import Icon from "@mdi/react";
import { mdiLoading, mdiTrashCan } from "@mdi/js";
import { useTranslation } from "react-i18next";
import { ERROR_TIMEOUT } from "../../config/config";

import { useAppStore } from "../../store/useAppStore";
import ErrorBoundary from "../ErrorBoundary";

export interface WidgetRef {
  refresh: () => void;
  unmountWidget: () => void;
  setLoading: (val: boolean) => void;
}

interface WidgetProps {
  id: number;
  removeWidget: (id: number) => void;
  children: (props: {
    loading: boolean;
    setLoading: (val: boolean) => void;
    setError: (msg: string) => void;
  }) => React.ReactNode;
}

const Widget = forwardRef<WidgetRef, WidgetProps>(
  ({ children, id, removeWidget }, ref) => {
    const [mount, setMount] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setErrorState] = useState<string | null>(null);
    const { editMode } = useAppStore();
    const { t } = useTranslation();

    const refresh = useCallback(() => {
      setMount(false);
      setTimeout(() => setMount(true), 0);
    }, []);

    const unmountWidget = useCallback(() => {
      setMount(false);
    }, []);

    const setError = useCallback((msg: string) => {
      const localized = msg.startsWith("error.") ? t(msg) : msg;
      setErrorState(localized);
    
      setTimeout(() => {
        setErrorState(null);
      }, ERROR_TIMEOUT);
    }, [t]);

    useImperativeHandle(ref, () => ({
      refresh,
      setLoading,
      unmountWidget,
      setError
    }));

    return (
      <div className="template relative">
        <ErrorBoundary>
          {loading && (
            <div className="loading-widget absolute inset-0 z-10 bg-white bg-opacity-50 flex justify-center items-center">
              <Icon path={mdiLoading} size={2} className="animate-spin" />
            </div>
          )}

          {editMode && (
            <div className="edit-mode-widget absolute top-2 right-2 z-20">
              <div
                className="cursor-pointer"
                title="Remove widget"
                onClick={() => removeWidget(id)}
              >
                <Icon path={mdiTrashCan} size={1.5} />
              </div>
            </div>
          )}

          {mount ? children({ loading, setLoading, setError }) : null}
        </ErrorBoundary>

        {error && (
          <div className="absolute right-4 bg-red-200 text-black px-4 py-3 rounded shadow-lg z-50 flex items-start w-80">
            <div className="flex-grow">
              {error}
            </div>
            <button
              className="ml-4 font-bold text-black hover:text-red-700"
              onClick={() => setErrorState(null)}
            >
              ×
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default Widget;