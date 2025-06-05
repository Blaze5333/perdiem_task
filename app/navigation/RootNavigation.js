import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const navigate = (name, params) => {
  if (navigationRef.current && navigationRef.current.isReady()) {
    navigationRef.current.navigate(name, params);
  } else {
    // Store navigation for when it's ready
    global.pendingNavigation = {name, params};
  }
};

export const reset = state => {
  if (navigationRef.current && navigationRef.current.isReady()) {
    navigationRef.current.reset(state);
  }
};