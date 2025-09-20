// IndexedDB Service for Offline Data Storage
class IndexedDBService {
  constructor() {
    this.dbName = 'DoctorryDB';
    this.dbVersion = 1;
    this.db = null;
  }

  // Initialize the database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('IndexedDB failed to open:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB opened successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log('IndexedDB upgrade needed');

        // Create object stores
        if (!db.objectStoreNames.contains('appointments')) {
          const appointmentStore = db.createObjectStore('appointments', { keyPath: 'id', autoIncrement: true });
          appointmentStore.createIndex('patientId', 'patientId', { unique: false });
          appointmentStore.createIndex('doctorId', 'doctorId', { unique: false });
          appointmentStore.createIndex('date', 'date', { unique: false });
          appointmentStore.createIndex('status', 'status', { unique: false });
        }

        if (!db.objectStoreNames.contains('pendingAppointments')) {
          const pendingStore = db.createObjectStore('pendingAppointments', { keyPath: 'id', autoIncrement: true });
          pendingStore.createIndex('patientId', 'patientId', { unique: false });
          pendingStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('doctors')) {
          const doctorStore = db.createObjectStore('doctors', { keyPath: 'id', autoIncrement: true });
          doctorStore.createIndex('specialization', 'specialization', { unique: false });
          doctorStore.createIndex('status', 'status', { unique: false });
        }

        if (!db.objectStoreNames.contains('userProfile')) {
          db.createObjectStore('userProfile', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }

        console.log('IndexedDB object stores created');
      };
    });
  }

  // Generic method to add data to a store
  async add(storeName, data) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => {
        console.log(`Data added to ${storeName}:`, data);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`Error adding data to ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  // Generic method to get all data from a store
  async getAll(storeName) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`Error getting data from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  // Generic method to get data by key
  async get(storeName, key) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`Error getting data from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  // Generic method to update data
  async update(storeName, data) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => {
        console.log(`Data updated in ${storeName}:`, data);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`Error updating data in ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  // Generic method to delete data
  async delete(storeName, key) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => {
        console.log(`Data deleted from ${storeName}:`, key);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`Error deleting data from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  // Appointment-specific methods
  async saveAppointment(appointment) {
    return this.add('appointments', {
      ...appointment,
      synced: true,
      createdAt: new Date().toISOString()
    });
  }

  async getAppointments() {
    return this.getAll('appointments');
  }

  async getAppointmentsByPatient(patientId) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['appointments'], 'readonly');
      const store = transaction.objectStore('appointments');
      const index = store.index('patientId');
      const request = index.getAll(patientId);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getAppointmentsByDoctor(doctorId) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['appointments'], 'readonly');
      const store = transaction.objectStore('appointments');
      const index = store.index('doctorId');
      const request = index.getAll(doctorId);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Pending appointments for offline sync
  async savePendingAppointment(appointment) {
    return this.add('pendingAppointments', {
      ...appointment,
      synced: false,
      createdAt: new Date().toISOString()
    });
  }

  async getPendingAppointments() {
    return this.getAll('pendingAppointments');
  }

  async removePendingAppointment(id) {
    return this.delete('pendingAppointments', id);
  }

  // Doctor data methods
  async saveDoctors(doctors) {
    const transaction = this.db.transaction(['doctors'], 'readwrite');
    const store = transaction.objectStore('doctors');
    
    // Clear existing data
    await store.clear();
    
    // Add new data
    for (const doctor of doctors) {
      await store.add(doctor);
    }
  }

  async getDoctors() {
    return this.getAll('doctors');
  }

  async getDoctorsBySpecialization(specialization) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['doctors'], 'readonly');
      const store = transaction.objectStore('doctors');
      const index = store.index('specialization');
      const request = index.getAll(specialization);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // User profile methods
  async saveUserProfile(profile) {
    return this.update('userProfile', profile);
  }

  async getUserProfile() {
    const profiles = await this.getAll('userProfile');
    return profiles.length > 0 ? profiles[0] : null;
  }

  // Settings methods
  async saveSetting(key, value) {
    return this.update('settings', { key, value });
  }

  async getSetting(key) {
    const setting = await this.get('settings', key);
    return setting ? setting.value : null;
  }

  // Clear all data
  async clearAll() {
    if (!this.db) await this.init();
    
    const storeNames = ['appointments', 'pendingAppointments', 'doctors', 'userProfile', 'settings'];
    
    for (const storeName of storeNames) {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      await store.clear();
    }
  }

  // Check if IndexedDB is supported
  static isSupported() {
    return 'indexedDB' in window;
  }
}

// Create a singleton instance
const indexedDBService = new IndexedDBService();

export default indexedDBService;
