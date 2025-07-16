import React from "react";
import i18n from "i18next";
import axios from "./../../utils/axios";
import { useDateStore } from "../../store/useDateStore";
import { useAppStore } from "../../store/useAppStore";
import { formatLocalizedDate } from "../../utils/utils";

interface QuizProps {
  setLoading: (val: boolean) => void,
  setError: (msg: string) => void
}

export interface QuizRef {
  getQuizData: (dateFrom: string) => void;
}

interface QuizItem {
  text: string;
  isTrue: boolean;
}

const Quiz = React.forwardRef<QuizRef, QuizProps>(({ setLoading, setError }, ref) => {
  const [date, setDate] = React.useState("");
  const [quizItems, setQuizItems] = React.useState<QuizItem[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const { dateFrom } = useDateStore();
  const { clientId } = useAppStore();

  React.useEffect(() => {
    getQuizData(dateFrom);
  }, [dateFrom]);

  const shuffleArray = (array: QuizItem[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getQuizData = React.useCallback((dateFrom: string) => {
    setLoading(true);

    const currentLang = i18n.language;
    axios
      .get("nasa/quiz", {
        params: {
          dateFrom,
          clientId,
          currentLang,
        },
      })
      .then((res) => {
        if (res.data && res.data.explanation) {
          const parts = res.data.explanation.split("|").map((s: string) => s.trim());
          if (parts.length === 3) {
            const items: QuizItem[] = [
              { text: parts[0], isTrue: true },
              { text: parts[1], isTrue: false },
              { text: parts[2], isTrue: false },
            ];
            const randomized = shuffleArray(items);
            setQuizItems(randomized);
            setDate(dateFrom);
            setSelectedIndex(null); // Reset on new quiz
          }
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
    getQuizData,
  }));

  if (quizItems.length === 0) return null;

  const handleClick = (index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    }
  };

  return (
    <div className="px-4 py-6 text-center m-auto">
      <div className="text-center mb-2">{formatLocalizedDate(date)}</div>
      <div className="space-y-4">
        {quizItems.map((item, index) => {
          const isSelected = selectedIndex === index;
          const wasSelected = selectedIndex !== null;
          const correct = item.isTrue;

          let bgColor = "bg-white hover:bg-gray-100 cursor-pointer";
          if (wasSelected) {
            if (correct) {
              bgColor = "bg-green-100";
            } else if (isSelected) {
              bgColor = "bg-red-100";
            } else {
              bgColor = "bg-white";
            }
          }

          return (
            <div
              key={index}
              onClick={() => handleClick(index)}
              className={`${bgColor} p-4 rounded-lg border border-gray-300 transition`}
            >
              <div>{item.text}</div>
              {isSelected && (
                <div className="mt-2 text-2xl">
                  {item.isTrue ? "😊" : "😞"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default Quiz;