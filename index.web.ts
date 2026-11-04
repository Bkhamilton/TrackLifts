import '@expo/metro-runtime';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

// Skia captures CanvasKit when its modules are evaluated. Router and its route
// modules must therefore be imported only after CanvasKit has initialized.
LoadSkiaWeb({
  locateFile: (file) => `/${file}`,
})
  .then(() => import('expo-router/entry'))
  .catch((error: unknown) => {
    console.error('Unable to initialize web graphics', error);
    const message = document.createElement('p');
    message.setAttribute('role', 'alert');
    message.textContent = 'Unable to load graphics. Please reload the page to try again.';
    document.body.appendChild(message);
  });
