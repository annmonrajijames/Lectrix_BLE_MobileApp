import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import { unparse } from 'papaparse';

const App = () => {
  // Function to generate and save CSV
  const saveDataAsCSV = () => {
    // Sample data
    const data = [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
    ];

    // Convert JSON to CSV
    const csv = unparse(data);

    // Define a path to save the file
    const path = RNFS.DocumentDirectoryPath + '/sample.csv';
    console.log("DEBUG path"+path);

    // Write the CSV file
    RNFS.writeFile(path, csv, 'utf8')
      .then(() => {
        console.log('FILE WRITTEN!');
        Alert.alert('Success', 'CSV file saved successfully!');
      })
      .catch((err) => {
        console.error(err.message);
        Alert.alert('Error', 'Failed to save CSV file.');
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Press the button to save data as CSV</Text>
      <Button title="Save CSV" onPress={saveDataAsCSV} />
    </View>
  );
};

export default App;
