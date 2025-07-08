import React from "react";
import axios from "axios";

interface ApodState {
  title: string;
  image: string;
  explanation: string;
}

const Apod: React.FC = () => {

  const [data, setData] = React.useState<ApodState | null>(null);

  React.useEffect(()=>{

    axios.get("http://localhost:3001/nasa/apod")
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
      console.error("Error al obtener datos de la NASA:", err);
    });

  }, []);

  if(data === null){
    return null;
  }else{
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 text-center">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-auto rounded-lg shadow-md mb-6"
        />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{data.title}</h2>
        <p className="text-base text-gray-700 leading-relaxed text-justify">
          {data.explanation}
        </p>
      </div>
    );
  }

};

export default Apod;