
import { NativeModules } from 'react-native';

const { ReactNativeInvokeApp } = NativeModules;

export default (data = {}) => {
    ReactNativeInvokeApp.invokeApp(typeof data !== 'object' ? {} : data);
};
