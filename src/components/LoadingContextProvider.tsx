import React, {createContext, useState, ReactNode} from 'react';
import {View, Dimensions, ActivityIndicator} from 'react-native';

interface LoadingContextValue {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoadingContext = createContext<LoadingContextValue | undefined>(
  undefined,
);

interface LoadingContextProviderProps {
  children: ReactNode;
}

const LoadingContextProvider: React.FC<LoadingContextProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDisabled, setLoadingDisabled] = useState<boolean>(false);

  return (
    <LoadingContext.Provider value={{loading, setLoading, setLoadingDisabled}}>
      {children}
      {loading && !loadingDisabled && <LoadingView />}
    </LoadingContext.Provider>
  );
};

export default LoadingContextProvider;

const dimensions = Dimensions.get(`screen`);

const LoadingView = () => {
  return (
    <View
      style={{
        position: `absolute`,
        width: dimensions.width,
        height: dimensions.height,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        backgroundColor: `#3535358d`,
      }}>
      <ActivityIndicator size={`large`} color={`white`} />
    </View>
  );
};
