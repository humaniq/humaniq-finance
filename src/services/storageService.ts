export class StorageService {
  setItem(itemName: string, value: string) {
    localStorage.setItem(itemName, value);
  }

  getItem(itemName: string): string {
    return localStorage.getItem(itemName) || "";
  }

  clearItem(itemName: string) {
    localStorage.removeItem(itemName);
  }

  clearAll() {
    localStorage.clear();
  }
}
