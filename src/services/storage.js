export const StorageService = {
  async load(key) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  },
  async save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) { console.error("Storage save failed:", e); }
  },
};

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
