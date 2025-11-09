"use client";

import { createContext, useContext, useState } from "react";

const DestinationContext = createContext();

export function DestinationProvider({ destinationsData, children }) {
  const [destinations, setDestinations] = useState(destinationsData || []);

  return (
    <DestinationContext.Provider value={{ destinations, setDestinations }}>
      {children}
    </DestinationContext.Provider>
  );
}

export function useDestinations() {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error("useDestinations must be used within a DestinationProvider");
  }
  return context;
}
