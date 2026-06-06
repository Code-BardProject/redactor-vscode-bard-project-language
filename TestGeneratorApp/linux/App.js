import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LinuxApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TestGeneratorApp Linux App</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, title: { fontSize: 24 } });
