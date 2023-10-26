import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';

const useMmkv = () => {
    const storage = new MMKVLoader()
  .withEncryption() // Generates a random key and stores it securely in Keychain
  .initialize();

  const mmkvStorage = (key, initialValue = null) => {
    return useMMKVStorage(key, storage, initialValue)
  }

  return mmkvStorage;
}

export default useMmkv;