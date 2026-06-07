import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import VisualCard from './components/VisualCard';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TestProject Mobile App</Text>
      <VisualCard title="Добро пожаловать" description="Автогенерированный компонент" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 }
});
