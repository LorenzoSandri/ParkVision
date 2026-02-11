const URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000') + '/api/auth';


export const register = async (info) => {
  try {
    const res = await fetch(`${URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    })

    if(!res.ok) return null

    return await res.json()
  } catch { return null }
}

export const login = async (info) => {
  try {
    const res = await fetch(`${URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    })

    if(!res.ok) return null

    return await res.json()
  } catch { return null }
}
