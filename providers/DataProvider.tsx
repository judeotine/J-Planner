import React from 'react';
import { useDataState } from '../hooks/useData';
import { DataContext } from '../contexts/DataContext';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const data = useDataState();

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};