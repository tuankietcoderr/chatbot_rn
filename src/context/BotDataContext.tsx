import { IData } from "@/schema/server/data";
import { createContext, useContext, useState } from "react";

export const BotDataContext = createContext({
  chosenRelated: [] as IData[] | null,
  setChosenRelated: (data: IData[] | null) => {},
  relatedQ: [] as string[],
  setRelatedQ: (data: string[]) => {},
  relatedTthc: [] as string[],
  setRelatedTthc: (data: string[]) => {},
});

export const BotDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [chosenRelated, setChosenRelated] = useState<IData[] | null>(null);
  const [relatedQ, setRelatedQ] = useState<string[]>([]);
  const [relatedTthc, setRelatedTthc] = useState<string[]>([]);

  const value = {
    chosenRelated,
    setChosenRelated,
    relatedQ,
    setRelatedQ,
    relatedTthc,
    setRelatedTthc,
  };
  return (
    <BotDataContext.Provider value={value}>{children}</BotDataContext.Provider>
  );
};

export const useBotDataContext = () => {
  return useContext(BotDataContext);
};
