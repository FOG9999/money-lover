import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Must be exported or Fast Refresh won't update the context
export function App() {
  console.log('xxx');
  const ctx = require.context('./app');
  console.log('yyy');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
console.log('zzz');
