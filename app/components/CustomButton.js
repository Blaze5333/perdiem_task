/*eslint-disable*/
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';

export default function CustomButton({
  title,
  onPress,
  type = 'primary',
  disabled = false,
  loading = false,
  icon = null,
  style = {},
  textStyle = {},
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        type === 'primary' ? styles.primaryButton : styles.secondaryButton,
        disabled || loading ? styles.disabledButton : {},
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={type === 'primary' ? '#fff' : '#3498db'} />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.buttonText,
              type === 'primary' ? styles.primaryText : styles.secondaryText,
              disabled ? styles.disabledText : {},
              textStyle,
            ]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  disabledButton: {
    backgroundColor: '#e2e8f0',
    borderColor: '#e2e8f0',
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#3498db',
  },
  disabledText: {
    color: '#94a3b8',
  },
  iconContainer: {
    marginRight: 10,
  },
});
