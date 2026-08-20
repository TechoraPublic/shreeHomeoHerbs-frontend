import { createContext, useContext, useState, useCallback } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storage";

const USERS_KEY = "herbal-store-users";
const SESSION_KEY = "herbal-store-session";

const AuthContext = createContext(null);

function getUsers() {
  return loadFromStorage(USERS_KEY, []);
}

function saveUsers(users) {
  saveToStorage(USERS_KEY, users);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => loadFromStorage(SESSION_KEY, null));

  // Persist session
  function persistSession(user) {
    setCurrentUser(user);
    saveToStorage(SESSION_KEY, user);
  }

  const signup = useCallback(({ name, email, password, phone = "" }) => {
    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password, // NOTE: plain text — acceptable for static frontend demo only
      phone,
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const { password: _p, ...safeUser } = newUser;
    persistSession(safeUser);
    return { ok: true };
  }, []);

  const login = useCallback(({ email, password }) => {
    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, error: "Invalid email or password." };
    const { password: _p, ...safeUser } = user;
    persistSession(safeUser);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    saveToStorage(SESSION_KEY, null);
  }, []);

  const updateProfile = useCallback(({ name, phone }) => {
    const users = getUsers();
    const updated = users.map((u) =>
      u.id === currentUser.id ? { ...u, name, phone } : u
    );
    saveUsers(updated);
    const updatedUser = { ...currentUser, name, phone };
    persistSession(updatedUser);
    return { ok: true };
  }, [currentUser]);

  const addAddress = useCallback((address) => {
    const users = getUsers();
    const newAddr = { ...address, id: `addr-${Date.now()}` };
    const updated = users.map((u) =>
      u.id === currentUser.id
        ? { ...u, addresses: [...(u.addresses || []), newAddr] }
        : u
    );
    saveUsers(updated);
    const updatedUser = { ...currentUser, addresses: [...(currentUser.addresses || []), newAddr] };
    persistSession(updatedUser);
    return { ok: true, address: newAddr };
  }, [currentUser]);

  const updateAddress = useCallback((id, address) => {
    const users = getUsers();
    const updated = users.map((u) =>
      u.id === currentUser.id
        ? { ...u, addresses: u.addresses.map((a) => (a.id === id ? { ...a, ...address } : a)) }
        : u
    );
    saveUsers(updated);
    const updatedUser = {
      ...currentUser,
      addresses: currentUser.addresses.map((a) => (a.id === id ? { ...a, ...address } : a)),
    };
    persistSession(updatedUser);
  }, [currentUser]);

  const deleteAddress = useCallback((id) => {
    const users = getUsers();
    const updated = users.map((u) =>
      u.id === currentUser.id
        ? { ...u, addresses: u.addresses.filter((a) => a.id !== id) }
        : u
    );
    saveUsers(updated);
    const updatedUser = { ...currentUser, addresses: currentUser.addresses.filter((a) => a.id !== id) };
    persistSession(updatedUser);
  }, [currentUser]);

  const deleteAccount = useCallback(() => {
    const users = getUsers().filter((u) => u.id !== currentUser.id);
    saveUsers(users);
    logout();
  }, [currentUser, logout]);

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoggedIn: !!currentUser,
      signup,
      login,
      logout,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      deleteAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
