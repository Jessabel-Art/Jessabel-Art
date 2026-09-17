import { getSettings, seedIfNeeded } from '../services/storage';
import { setCurrencySymbol } from '../utils/format';

export interface AppInitializer {
  initialize(): Promise<void>;
}

export const appInitializer: AppInitializer = {
  async initialize() {
    seedIfNeeded();
    setCurrencySymbol(getSettings().currencySymbol);
  },
};
