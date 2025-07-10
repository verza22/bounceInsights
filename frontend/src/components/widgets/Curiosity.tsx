import React from "react";
import axios from "./../../utils/axios";
import { useDateStore } from "../../store/useDateStore";

interface MarsPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  camera: {
    full_name: string;
  };
}

interface CuriosityProps {
  setLoading: (val: boolean) => void
}

const Curiosity: React.FC<CuriosityProps> = ({setLoading}) => {
  const [photos, setPhotos] = React.useState<MarsPhoto[]>([]);
  const [index, setIndex] = React.useState(0);
  const { dateFrom } = useDateStore();

  React.useEffect(() => {

    setLoading(true);
    axios.get("nasa/curiosity",{
      params: {
        dateFrom
      }
    })
    .then(res => {
      if (res.data && Array.isArray(res.data.photos)) {
        setPhotos(res.data.photos);
      } else {
        console.error("Datos inesperados:", res.data);
      }
    })
    .catch(err => {
      console.error("Error al obtener fotos del Curiosity:", err);
    })
    .finally(() => {
      setLoading(false);
    });

  }, [dateFrom]);

  const nextPhoto = () => {
    setIndex((prev) => (prev + 1 < photos.length ? prev + 1 : 0));
  };

  const prevPhoto = () => {
    setIndex((prev) => (prev - 1 >= 0 ? prev - 1 : photos.length - 1));
  };

  if (photos.length === 0) return null;

  const currentPhoto = photos[index];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 text-center">
      <div className="relative w-full h-72 md:h-96 bg-gray-200 rounded-lg overflow-hidden mb-4 shadow-md">
        <img
          src={currentPhoto.img_src}
          alt={`Foto de la cámara ${currentPhoto.camera.full_name}`}
          className="w-full h-full object-contain"
        />
        <button
          onClick={prevPhoto}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 px-3 py-1 rounded hover:bg-opacity-100"
        >
          ⬅
        </button>
        <button
          onClick={nextPhoto}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 px-3 py-1 rounded hover:bg-opacity-100"
        >
          ➡
        </button>
      </div>
      <p className="text-sm text-gray-600">
        <strong>Cámara:</strong> {currentPhoto.camera.full_name} <br />
        <strong>Fecha en la Tierra:</strong> {currentPhoto.earth_date} <br />
        <strong>Imagen {index + 1} de {photos.length}</strong>
      </p>
    </div>
  );
};

export default Curiosity;