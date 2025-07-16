import React, { forwardRef, useState, useEffect, useImperativeHandle, useCallback } from "react";
import i18n from "i18next";
import axios from "./../../utils/axios";
import { useDateStore } from "../../store/useDateStore";
import { useAppStore } from "../../store/useAppStore";
import { addReconnectListener, addWebSocketListener, removeReconnectListener, removeWebSocketListener } from "../../utils/websocket";
import { formatLocalizedDate } from "../../utils/utils";

interface ApodProps {
  setLoading: (val: boolean) => void,
  setError: (msg: string) => void
}

export interface ApodRef {
  getApodData: (dateFrom: string) => void
}

const Apod = forwardRef<ApodRef, ApodProps>(({setLoading, setError}, ref) => {

  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [explanation, setExplanation] = useState('');
  const { dateFrom } = useDateStore();
  const { clientId } = useAppStore();

  useEffect(() => {
    const onTitle = (payload: string) =>
      setTitle((prev) => (prev === "Loading..." ? payload : prev + payload));

    const onExplanation = (payload: string) =>
      setExplanation((prev) => (prev === "Loading..." ? payload : prev + payload));

    const registerListeners = () => {
      addWebSocketListener("apodTitle", onTitle);
      addWebSocketListener("apodExplanation", onExplanation);
    };

    registerListeners();
    addReconnectListener(registerListeners);

    return () => {
      removeWebSocketListener("apodTitle", onTitle);
      removeWebSocketListener("apodExplanation", onExplanation);
      removeReconnectListener(registerListeners);
    };
  }, []);

  useEffect(()=>{
    getApodData(dateFrom);
  }, [dateFrom]);

  const getApodData = useCallback((dateFrom: string)=>{
    setLoading(true);
    setTitle('Loading...');
    setExplanation('Loading...');

    const currentLang = i18n.language;
    axios.get("nasa/apod",{
      params: {
        dateFrom,
        clientId,
        currentLang
      }
    })
    .then(res => {
      if(res.data){
        setImage(res.data.hdurl);
        setDate(dateFrom);
      }
    })
    .catch(err => {
      const error = err?.response?.data?.error ? err.response.data.error : err.message;
      setError(error);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  useImperativeHandle(ref, () => ({
    getApodData
  }));

  if(image === null){
    return null;
  }else{
    return (
      <div className="px-4 py-6 text-center m-auto">
        <div className="text-center mb-2">{formatLocalizedDate(date)}</div>
        <div className="w-full h-64 rounded-lg shadow-md mb-6 apod-img" style={{backgroundImage: "url('"+image+"')"}}></div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="leading-relaxed text-justify">
          {explanation}
        </p>
      </div>
    );
  }

});

export default Apod;