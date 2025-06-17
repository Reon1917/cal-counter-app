import { StatusBar } from 'expo-status-bar';
import './global.css';
import CameraScreen from './screens/CameraScreen';

export default function App() {
  return (
    <>
      <CameraScreen />
      <StatusBar style="light" />
    </>
  );
}
