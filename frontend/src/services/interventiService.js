const URL = 'http://localhost:3000/api/interventi';


export const getAllInterventi = async () => {
  try {
    const res = await fetch(URL)

    if(!res.ok) return []

    return await res.json()
    } catch { return [] }
}

export const getInterventoById = async (id) => {
  try {
    const res = await fetch(`${URL}/${id}`)
    
    if(!res.ok) return null

    return await res.json()
  } catch { return null }
}

export const createIntervento = async (info) => {
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

export const updateIntervento = async (id, info) => {
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

export const deleteIntervento = async (id) => {
  try {
    await fetch(`${URL}/${id}`, {
      method: 'DELETE',
    })

    return true
  } catch { return false }
}