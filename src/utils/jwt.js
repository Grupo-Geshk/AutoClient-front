// src/utils/jwt.js
export const parseJwt = (token) => {
  try {
    const base64Payload = token.split('.')[1]
    const payload = atob(base64Payload)
    return JSON.parse(payload)
  } catch (err) {
    return null
  }
}

export const getSubdomainFromToken = () => {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const payloadBase64 = token.split('.')[1]
    const decodedPayload = JSON.parse(atob(payloadBase64))
    return decodedPayload?.subdomain || null
  } catch (err) {
    console.error("Token inválido:", err)
    return null
  }
}

