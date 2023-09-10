import { AppCommon } from "@/constants/common";
import { createContext, useContext, useState } from "react";

export const TimeTickerContext = createContext({
  time: AppCommon.MAX_TIME_TO_LIVE,
  setTime: (time: number) => {},
});

export const TimeTickerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [time, setTime] = useState(AppCommon.MAX_TIME_TO_LIVE);
  const value = {
    time,
    setTime,
  };
  return (
    <TimeTickerContext.Provider value={value}>
      {children}
    </TimeTickerContext.Provider>
  );
};

export const useTimeTickerContext = () => {
  return useContext(TimeTickerContext);
};
