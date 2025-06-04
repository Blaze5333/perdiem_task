/*eslint-disable*/
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
} from 'react-native';

export default function SocialSignInButton({ 
  title, 
  onPress, 
  iconSource, 
  style = {},
  disabled = false,
  loading = false,
}) {
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {React.isValidElement(iconSource) ? (
            // If iconSource is a React component, render it directly
            iconSource
          ) : (
            // If iconSource is an image source object, use Image component
            <Image source={iconSource} style={styles.icon} />
          )}
        </View>
        <Text style={styles.text}>{title}</Text>
        <View style={styles.spacer} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  spacer: {
    width: 24, // Same width as icon for balance
  },
});
