import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AndroidApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FinalTestApp Android App</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, title: { fontSize: 24 } });
