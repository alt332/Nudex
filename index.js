/**
 * @format
 */

require('react-native').unstable_enableLogBox();
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
const {App} = require('./src/index');
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
