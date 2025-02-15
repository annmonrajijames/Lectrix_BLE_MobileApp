import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';

const App = () => {
  const [range, setRange] = useState(40);
  const [pickup, setPickup] = useState(4);
  const [topSpeed, setTopSpeed] = useState(85);
  const [slope, setSlope] = useState(14);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{"< David 1"}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Parameters at 100% Battery</Text>

        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Range</Text>
          <View style={styles.sliderValueContainer}>
            <Text style={styles.sliderValue}>{range} km</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={range}
            onValueChange={value => setRange(value)}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#888888"
            thumbTintColor="#FFFFFF"
          />
        </View>

        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Pick-up</Text>
          <View style={styles.sliderValueContainer}>
            <Text style={styles.sliderValue}>0-40 kmph in {pickup.toFixed(1)}s</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={2}
            maximumValue={8}
            step={0.1}
            value={pickup}
            onValueChange={value => setPickup(value)}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#888888"
            thumbTintColor="#FFFFFF"
          />
        </View>

        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Top speed</Text>
          <View style={styles.sliderValueContainer}>
            <Text style={styles.sliderValue}>{topSpeed} kmph Max</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={50}
            maximumValue={150}
            step={1}
            value={topSpeed}
            onValueChange={value => setTopSpeed(value)}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#888888"
            thumbTintColor="#FFFFFF"
          />
        </View>

        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Slope</Text>
          <View style={styles.sliderValueContainer}>
            <Text style={styles.sliderValue}>{slope}° with single rider</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={30}
            step={1}
            value={slope}
            onValueChange={value => setSlope(value)}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#888888"
            thumbTintColor="#FFFFFF"
          />
        </View>
        <Text style={styles.saveText}>Changes made will need to be saved and pushed to vehicle</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    
  },
   header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    marginTop: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
   sliderValueContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    
  },
  sliderValue: {
    color: '#fff',
    fontSize: 14,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  saveText: {
      color: '#fff',
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 20
  },
  saveButton: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;