import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AppToVCUFeatures: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>App to VCU Features Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default AppToVCUFeatures;
