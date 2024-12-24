import React from 'react';
import { SafeAreaView, Button, NativeModules } from 'react-native';

const App = () => {
  const goToNativeCode = () => {
    NativeModules.OpenNativeModule.openNativeScreen();
  };

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button
        title="Go to Native Code File"
        onPress={goToNativeCode}
      />
    </SafeAreaView>
  );
};

export default App;
