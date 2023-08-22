import { IData } from "@/schema/server/data";
import { createContext, useContext, useState } from "react";

export const BotDataContext = createContext({
  chosenRelated: null as IData,
  setChosenRelated: (data: IData) => {},
  related: [] as string[],
  setRelated: (data: string[]) => {},
});

export const BotDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [chosenRelated, setChosenRelated] = useState<IData>(null);
  const [related, setRelated] = useState<string[]>([]);

  const value = {
    chosenRelated,
    setChosenRelated,
    related,
    setRelated,
  };
  return (
    <BotDataContext.Provider value={value}>{children}</BotDataContext.Provider>
  );
};

export const useBotDataContext = () => {
  return useContext(BotDataContext);
};
