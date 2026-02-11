const URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000') + '/api/segnalazioni';


export const getAllSegnalazioni = async () => {
  try {
    const res = await fetch(URL)

    if(!res.ok) return []

    return await res.json()
    } catch { return [] }
}

export const getSegnalazioneById = async (id) => {
  try {
    const res = await fetch(`${URL}/${id}`)

    if(!res.ok) return null

    return await res.json()
  } catch { return null }
}

export const createSegnalazione = async (info) => {
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

export const updateSegnalazione = async (id, info) => {
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
