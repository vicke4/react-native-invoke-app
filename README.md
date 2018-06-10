
# React Native Invoke App

[![npm version](https://badge.fury.io/js/react-native-invoke-app.svg)](https://badge.fury.io/js/react-native-invoke-app)

[Headless JS](https://facebook.github.io/react-native/docs/headless-js-android.html) is a way to run background tasks in a React Native app. Sometimes we may want to open the app from background task (Headless JS). You can use this module to bring your app to foreground in all the following three cases.

- App is in foreground
- App is in background
- App is not running

## Installation

```
$ npm install --save react-native-invoke-app
$ react-native link react-native-invoke-app
```

## Usage
```javascript
import invokeApp from 'react-native-invoke-app';

// Within your headless function
invokeApp();
```

## Advanced usage

You can pass an object to `invokeApp` method to pick it from [DeviceEventEmitter](https://facebook.github.io/react-native/docs/native-modules-android.html#sending-events-to-javascript) by listening to `appInvoked` event.

Example:

```javascript
const yourObject = { route: 'Dashboard' };

invokeApp({
    data: yourObject,
})
```

### Use case

Let's say you want to navigate to dashboard screen of the app after a specific task is completed. You can acheive it like,

```javascript
import React, { Component } from 'react';
import { DeviceEventEmitter, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import invokeApp from 'react-native-invoke-app';

import Dashboard from './dashboard';

class App extends Component {
    componentWillMount() {
        DeviceEventEmitter.addListener('appInvoked', (data) => {
	    const { route } = data;
	    
	    // Using react-navigation library for navigation.
	    this.props.navigation.navigate(route);
	});
    }

    render() {
        return (
	    <View>
		<Text>
		    This is Home screen.
		</Text>
	    </View>
	)
    }
}

const appStack = () => {
    const Stack = createStackNavigator({
        App,
        Dashboard,
    });

    return <Stack />
}

const notificationActionHandler = async (data) => {
    // Your background task
    const yourObject = { route: 'Dashboard' };

    invokeApp({
	data: yourObject,
    })
}

AppRegistry.registerHeadlessTask(
    'RNPushNotificationActionHandlerTask', () => notificationActionHandler,
);

AppRegistry.registerComponent('testProject', () => appStack);

```

## Extra step needed when app is not running

Event listener will work fine when your app is in background or foreground. If it is not running, to capture the first event we need to do some extra work. Make the following changes in your `MainActivity.java` file of React Native app,

```diff
package com.yourpackage;

+import android.os.Bundle;
import com.facebook.react.ReactActivity;
+import com.codegulp.invokeapp.RNInvokeApp;

public class MainActivity extends ReactActivity {
    /**
    * Returns the name of the main component registered from JavaScript.
    * This is used to schedule rendering of the component.
    */
    @Override
    protected String getMainComponentName() {
    	return "testProject";
    }
    
+   @Override
+   protected void onCreate(Bundle savedInstanceState) {
+       super.onCreate(savedInstanceState);
+	RNInvokeApp.sendEvent();
+   }
}
```

### License

MIT
