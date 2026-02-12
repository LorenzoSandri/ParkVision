const URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000') + '/api/parchi';


export const getAllParchi = async () => {
  try {
    const res = await fetch(URL)

    if(!res.ok) return []

    return await res.json()
  } catch { return [] }
}

export const createParco = async (info) => {
  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    })

    if(!res.ok) return null

    return await res.json()
  } catch { return null }
}

export const updateParco = async (id, info) => {
  try {
    const res = await fetch(`${URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    })
    
    if(!res.ok) return null

    return await res.json()
  } catch { return null }
}

export const deleteParco = async (id) => {
  try {
    await fetch(`${URL}/${id}`, {
      method: 'DELETE',
    })

    return true
  } catch { return false }
}