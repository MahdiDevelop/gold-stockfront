// localStorageUtils.js

// ذخیره state در Local Storage
export const saveToLocalStorage = (state) => {
    try {
      const serializedState = JSON.stringify(state); // تبدیل state به JSON
      localStorage.setItem('reduxState', serializedState); // ذخیره در Local Storage
    } catch (error) {
      console.error('Could not save state to Local Storage', error);
    }
  };
  
  // بازیابی state از Local Storage
  export const loadFromLocalStorage = () => {
    try {
      const serializedState = localStorage.getItem('reduxState'); // گرفتن داده از Local Storage
      if (serializedState === null) return undefined; // اگر چیزی نیست
      return JSON.parse(serializedState); // تبدیل به Object
    } catch (error) {
      console.error('Could not load state from Local Storage', error);
      return undefined;
    }
  };
  