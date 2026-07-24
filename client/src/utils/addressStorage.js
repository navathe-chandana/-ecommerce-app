const getKey = (userId) => `addresses_${userId}`;

export const getAddresses = (userId) => {
  try {
    return JSON.parse(localStorage.getItem(getKey(userId))) || [];
  } catch {
    return [];
  }
};

const saveAddresses = (userId, addresses) => {
  localStorage.setItem(getKey(userId), JSON.stringify(addresses));
};

export const addAddress = (userId, address) => {
  const list = getAddresses(userId);
  const isFirst = list.length === 0;
  const newAddr = { ...address, id: Date.now().toString(), isDefault: isFirst || address.isDefault };
  const updated = newAddr.isDefault
    ? [...list.map((a) => ({ ...a, isDefault: false })), newAddr]
    : [...list, newAddr];
  saveAddresses(userId, updated);
  return updated;
};

export const updateAddress = (userId, id, data) => {
  let list = getAddresses(userId).map((a) => (a.id === id ? { ...a, ...data, id } : a));
  if (data.isDefault) {
    list = list.map((a) => ({ ...a, isDefault: a.id === id }));
  }
  saveAddresses(userId, list);
  return list;
};

export const deleteAddress = (userId, id) => {
  const list = getAddresses(userId).filter((a) => a.id !== id);
  saveAddresses(userId, list);
  return list;
};

export const setDefaultAddress = (userId, id) => {
  const list = getAddresses(userId).map((a) => ({ ...a, isDefault: a.id === id }));
  saveAddresses(userId, list);
  return list;
};