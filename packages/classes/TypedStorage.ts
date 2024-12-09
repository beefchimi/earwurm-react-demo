export class TypedStorage<T extends Record<string, unknown>> {
  private registeredKeys = new Set<string>();

  setItem<K extends keyof T>(key: K, value: T[K]) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(String(key), serializedValue);
      this.registeredKeys.add(String(key));
    } catch (error) {
      console.error(`Failed to set item with key "${String(key)}":`, error);
    }
  }

  getItem<K extends keyof T>(key: K) {
    try {
      const item = localStorage.getItem(String(key));
      // It is possible we could consider some custom validator to be set
      // when calling `setItem/getItem` that allows for stronger typing.
      return item ? (JSON.parse(item) as T[K]) : null;
    } catch (error) {
      console.error(`Failed to get item with key "${String(key)}":`, error);
      return null;
    }
  }

  removeItem<K extends keyof T>(key: K) {
    try {
      localStorage.removeItem(String(key));
      this.registeredKeys.delete(String(key));
    } catch (error) {
      console.error(`Failed to remove item with key "${String(key)}":`, error);
    }
  }

  clear() {
    try {
      this.registeredKeys.forEach((key) => {
        localStorage.removeItem(key);
      });
      this.registeredKeys.clear();
    } catch (error) {
      console.error(
        'Failed to clear registered items from localStorage:',
        error,
      );
    }
  }
}

/*
// Usage example:

interface MyLocalStorageEntries {
  userSettings: { theme: string; language: string };
  sessionId: string;
}

const myLocalStorage = new TypedStorage<MyLocalStorageEntries>();

myLocalStorage.setItem('userSettings', { theme: 'dark', language: 'en' });
myLocalStorage.setItem('sessionId', 'abc123');
*/
