<template>
  <div class="row wrap justify-center">
    <button @click="scanQR">Scan QR Code</button>
  </div>
</template>

<script setup lang="ts">
import { Camera, CameraResultType } from '@capacitor/camera';
import Quagga from 'quagga';

const scanQR = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: 'CAMERA',
    });

    const img = new Image();
    img.src = image.webPath;
    img.onload = () => {
      Quagga.decodeSingle(
        {
          src: img.src,
          numOfWorkers: 0,
          locate: true,
          inputStream: {
            size: img.naturalWidth,
          },
          decoder: {
            readers: ['qrcode_reader'],
          },
        },
        (result) => {
          if (result && result.codeResult) {
            console.log('QR code data:', result.codeResult.code);
          } else {
            console.error('No QR code found in the image.');
          }
        }
      );
    };
  } catch (error) {
    console.error('Error capturing photo:', error);
  }
};
</script>
