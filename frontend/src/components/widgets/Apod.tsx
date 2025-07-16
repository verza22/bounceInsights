import React from "react";
import i18n from "i18next";
import axios from "./../../utils/axios";
import { useDateStore } from "../../store/useDateStore";
import { useAppStore } from "../../store/useAppStore";
import { addWebSocketListener, removeWebSocketListener } from "../../utils/websocket";
import { formatLocalizedDate } from "../../utils/utils";

interface ApodProps {
  setLoading: (val: boolean) => void,
  setError: (msg: string) => void
}

export interface ApodRef {
  getApodData: (dateFrom: string) => void
}

const Apod = React.forwardRef<ApodRef, ApodProps>(({setLoading, setError}, ref) => {

  const [image, setImage] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState('');
  const [explanation, setExplanation] = React.useState('');
  const { dateFrom } = useDateStore();
  const { clientId } = useAppStore();

  React.useEffect(()=> {

    const onTitle = (payload: string) => setTitle(_title => {
      return _title === "Loading..." ? payload : _title+payload;
    });
    const onExplanation = (payload: string) => setExplanation(_explanation => {
      return _explanation === "Loading..." ? payload : _explanation+payload;
    });

    addWebSocketListener("apodTitle", onTitle);
    addWebSocketListener("apodExplanation", onExplanation);

    return () => {
      removeWebSocketListener("apodTitle", onTitle);
      removeWebSocketListener("apodExplanation", onExplanation);
    };
  }, []);

  React.useEffect(()=>{
    getApodData(dateFrom);
  }, [dateFrom]);

  const getApodData = React.useCallback((dateFrom: string)=>{
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

  React.useImperativeHandle(ref, () => ({
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