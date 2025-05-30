const localStorageHelper = {
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`localStorage set error for key "${key}":`, error);
      return null;
    }
  },

  get(key) {
    try {
      const serialized = localStorage.getItem(key);
      return serialized ? JSON.parse(serialized) : null;
    } catch (error) {
      console.error(`localStorage get error for key "${key}":`, error);
      return null;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`localStorage remove error for key "${key}":`, error);
      return null;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error(`localStorage clear error:`, error);
      return null;
    }
  }
};

export default localStorageHelper;
