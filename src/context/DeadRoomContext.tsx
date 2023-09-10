import React, { createContext, useContext, useState } from "react";

interface IDeadRoomContext {
  dead: boolean;
  setDead: (dead: boolean) => void;
  currentRoomId: string;
  setCurrentRoomId: React.Dispatch<React.SetStateAction<string>>;
}

export const DeadRoomContext = createContext<IDeadRoomContext>({
  dead: false,
  setDead: () => {},
  currentRoomId: "",
  setCurrentRoomId: () => {},
});

export const DeadRoomProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dead, setDead] = useState<boolean>(false);
  const [currentRoomId, setCurrentRoomId] = useState<string>("");
  const value = {
    dead,
    setDead,
    currentRoomId,
    setCurrentRoomId,
  };
  return (
    <DeadRoomContext.Provider value={value}>
      {children}
    </DeadRoomContext.Provider>
  );
};

export const useDeadRoomContext = () => {
  return useContext(DeadRoomContext);
};
