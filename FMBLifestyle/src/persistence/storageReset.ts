export interface StorageResetService {
  resetAllData(): Promise<void>;
}

export const storageResetService: StorageResetService = {
  async resetAllData() {
    localStorage.clear();
  },
};
