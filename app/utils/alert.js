/*eslint-disable*/
import {Platform, Alert} from 'react-native';

export const showAlert = ({
  title = 'Error',
  message,
  buttons = [{text: 'OK'}],
  options = {},
}) => {
  if (Platform.OS === 'ios') {
    Alert.alert(title, message, buttons, options);
  } else {
    Alert.alert(title, message, buttons, {
      cancelable: true,
      ...options,
    });
  }
};

export const showError = (error, customMessage) => {
  const message =
    customMessage ||
    error?.message ||
    'Something went wrong. Please try again later.';

  showAlert({
    title: 'Error',
    message,
  });
};

export const showSuccess = message => {
  showAlert({
    title: 'Success',
    message,
  });
};