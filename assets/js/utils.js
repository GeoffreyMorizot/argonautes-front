export function formDataToJson(formData) {
  const plainFormData = Object.fromEntries(formData.entries());
  return JSON.stringify(plainFormData);
}

export async function apiFetch(endpoint, options = {}) {
  options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...options,
  };
  try {
    const response = await fetch(endpoint, options);
    return await response.json();
  } catch (err) {
    return err;
  }
}
