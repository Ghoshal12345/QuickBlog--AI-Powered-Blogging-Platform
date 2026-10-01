import ImageKit from '@imagekit/nodejs';

const imageKitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    timeout: 30000,
    maxRetries: 0,
});

export default imageKitClient;