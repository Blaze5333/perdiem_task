import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function Divider({text}) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  text: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#94a3b8',
  },
});
