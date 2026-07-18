// Safe local storage and session storage wrapper for sandboxed/restricted iframe environments
const memoryStorage: Record<string, string> = {};

export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return memoryStorage[key] || null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      memoryStorage[key] = value;
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      delete memoryStorage[key];
    }
  },
  clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      for (const key in memoryStorage) {
        delete memoryStorage[key];
      }
    }
  }
};

const sessionMemoryStorage: Record<string, string> = {};

export const safeSessionStorage = {
  getItem(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      return sessionMemoryStorage[key] || null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      sessionMemoryStorage[key] = value;
    }
  },
  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      delete sessionMemoryStorage[key];
    }
  },
  clear(): void {
    try {
      sessionStorage.clear();
    } catch (e) {
      for (const key in sessionMemoryStorage) {
        delete sessionMemoryStorage[key];
      }
    }
  }
};
