function convertFirestoreData(data) {
  if (!data || typeof data !== "object") return data;

  // Handle Firestore Timestamp
  if (data.seconds && data.nanoseconds) {
    return new Date(data.seconds * 1000).toISOString();
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(convertFirestoreData);
  }

  // Handle nested objects
  const plain = {};
  for (const key in data) {
    plain[key] = convertFirestoreData(data[key]);
  }
  return plain;
}
export default convertFirestoreData;