import React from 'react';
import { SafeAreaView, StyleSheet, Button, Alert, Text } from 'react-native';
import { NativeModules } from 'react-native';

const { FileSaveModule } = NativeModules;

const App = () => {
  const handleSaveFile = () => {
    // Example content to be saved in a CSV file
    const csvContent = "name,age\nAlice,25\nBob,30";

    // Calling the native module function to save the file
    FileSaveModule.saveFile(csvContent)
      .then((result: string) => {
        Alert.alert('Success', 'File saved successfully at: ' + result);
      })
      .catch((error: { message: string; }) => {
        console.error(error);
        Alert.alert('Error', 'Failed to save file: ' + error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.instructions}>
        Press the button below to save a CSV file using the native file picker.
      </Text>
      <Button title="Save CSV File" onPress={handleSaveFile} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  }
});

export default App;
