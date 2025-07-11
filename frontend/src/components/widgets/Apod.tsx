import React from "react";
import i18n from "i18next";
import axios from "./../../utils/axios";
import { useDateStore } from "../../store/useDateStore";
import { useAppStore } from "../../store/useAppStore";
import { addWebSocketListener, removeWebSocketListener } from "../../utils/websocket";

interface ApodProps {
  setLoading: (val: boolean) => void
}

const Apod: React.FC<ApodProps> = ({setLoading}) => {

  const [image, setImage] = React.useState('');
  const [title, setTitle] = React.useState('');
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
      }
    })
    .catch(err => {
      // TO DO show error with toast
    })
    .finally(() => {
      setLoading(false);
    });

  }, [dateFrom]);

  if(image === null){
    return null;
  }else{
    return (
      <div className="max-w-xl mx-auto px-4 py-6 text-center">
        <div className="w-full h-64 rounded-lg shadow-md mb-6 apod-img" style={{backgroundImage: "url('"+image+"')"}}></div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-base text-gray-700 leading-relaxed text-justify">
          {explanation}
        </p>
      </div>
    );
  }

};

export default Apod;