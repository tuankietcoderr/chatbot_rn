import React, { createContext, useContext, useState } from "react";

export const ModalContext = createContext({
  isVisible: false,
  onModalClose: () => {},
  onModalOpen: () => {},
});

export const ModalProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const onModalOpen = () => {
    setIsVisible(true);
  };

  const onModalClose = () => {
    setIsVisible(false);
  };

  const value = {
    isVisible,
    onModalClose,
    onModalOpen,
  };
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModalContext = () => {
  return useContext(ModalContext);
};
