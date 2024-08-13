import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DataTransfer: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Data Transfer Page</Text>
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

export default DataTransfer;