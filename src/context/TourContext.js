"use client";

import { createContext, useContext, useState } from "react";

const TourContext = createContext();

export function ToursProvider({ toursData, children }) {
  const [tours, setTours] = useState(toursData || []);
  return <TourContext.Provider value={{ tours, setTours }}>{children}</TourContext.Provider>;
}

export function useTours() {
  return useContext(TourContext);
}
