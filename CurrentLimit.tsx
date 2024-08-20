// CurrentLimit.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CurrentLimit: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Current Limit Settings</Text>
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

export default CurrentLimit;
