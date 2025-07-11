import React from "react";
import axios from "./../../utils/axios";
import { useDateStore } from "../../store/useDateStore";

interface ApodState {
  title: string;
  image: string;
  explanation: string;
}

interface ApodProps {
  setLoading: (val: boolean) => void
}

const Apod: React.FC<ApodProps> = ({setLoading}) => {

  const [data, setData] = React.useState<ApodState | null>(null);
  const { dateFrom } = useDateStore();

  React.useEffect(()=>{
    
    setLoading(true);
    axios.get("nasa/apod",{
      params: {
        dateFrom
      }
    })
    .then(res => {
      if(res.data){
        setData({
          title: res.data.title,
          image: res.data.hdurl,
          explanation: res.data.explanation
        });
      }
    })
    .catch(err => {
      // TO DO show error with toast
    })
    .finally(() => {
      setLoading(false);
    });

  }, [dateFrom]);

  if(data === null){
    return null;
  }else{
    return (
      <div className="max-w-xl mx-auto px-4 py-6 text-center">
        <div className="w-full h-64 rounded-lg shadow-md mb-6 apod-img" style={{backgroundImage: "url('"+data.image+"')"}}></div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{data.title}</h2>
        <p className="text-base text-gray-700 leading-relaxed text-justify">
          {data.explanation}
        </p>
      </div>
    );
  }

};

export default Apod;