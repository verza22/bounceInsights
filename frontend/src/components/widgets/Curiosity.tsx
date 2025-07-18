import React, { forwardRef, useEffect, useState, useCallback, useImperativeHandle } from "react";
import axios from "./../../utils/axios";
import { useDateStore } from "../../store/useDateStore";
import { useTranslation } from "react-i18next";
import { formatLocalizedDate } from "../../utils/utils";

interface MarsPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  camera: {
    full_name: string;
  };
}

interface CuriosityProps {
  setLoading: (val: boolean) => void,
  setError: (msg: string) => void
}

export interface CuriosityRef {
  getCuriosityData: (dateFrom: string) => void
}

const Curiosity = forwardRef<CuriosityRef, CuriosityProps>(({setLoading, setError}, ref) => {

  const [photos, setPhotos] = useState<MarsPhoto[]>([]);
  const [index, setIndex] = useState(0);
  const { dateFrom } = useDateStore();
  const { t } = useTranslation();

  useEffect(() => {
    getCuriosityData(dateFrom);
  }, [dateFrom]);

  const getCuriosityData = useCallback((dateFrom: string)=>{
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
        setError("error.400-001");
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

  useImperativeHandle(ref, ()=> ({
    getCuriosityData
  }));

  const nextPhoto = () => {
    setIndex((prev) => (prev + 1 < photos.length ? prev + 1 : 0));
  };

  const prevPhoto = () => {
    setIndex((prev) => (prev - 1 >= 0 ? prev - 1 : photos.length - 1));
  };

  if (photos.length === 0) return null;

  const currentPhoto = photos[index];

  return (
    <div className="px-4 py-6 text-center h-full w-full flex flex-col">
      <div className="relative w-full bg-gray-200 rounded-lg overflow-hidden mb-4 shadow-md flex-1">
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
        <strong>{t('camera')}:</strong> {currentPhoto.camera.full_name} <br />
        <strong>{t('dateEarth')}:</strong> {formatLocalizedDate(currentPhoto.earth_date)} <br />
        <strong>{t('image')} {index + 1} {t('of')} {photos.length}</strong>
      </p>
    </div>
  );
});

export default Curiosity;