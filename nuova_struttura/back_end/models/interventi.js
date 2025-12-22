/**
 * MODELLO DATI: Interventi
 * Questo file definisce la struttura standard di un intervento di manutenzione.
 * 
 * Riferimento ai Requisiti: RF4 (Pianificazione interventi), User Story 4 e 5.
 */

const InterventoSchema = {
    // ID del parco a cui si riferisce (deve corrispondere a un ID nella collezione 'parchi')
    parcoId: "ObjectId", 
    
    // Tipologia di lavoro
    // Valori ammessi: "potatura", "pulizia", "riparazione", "illuminazione", "altro"
    tipologia: "string", 
    
    // Data prevista per l'intervento (formato ISO Date)
    dataPrevista: "date", 
    
    // Stato attuale dell'intervento
    // Valori: "pianificato" (default), "in corso", "completato"
    stato: "string", 
    
    // Note aggiuntive dell'operatore comunale
    note: "string", 
    
    // Nome dell'operatore o della ditta responsabile
    responsabile: "string",

    // Gestione Rinnovo Automatico (User Story 5)
    rinnovo: {
        isAutomatico: "boolean", // true o false
        frequenza: "string"      // es: "mensile", "trimestrale", "annuale"
    },

    // Timestamp di creazione (automatico)
    createdAt: "date"
};

/**
 * ESEMPIO DI OGGETTO INTERVENTO (da usare come riferimento per i test):
 * {
 *   "parcoId": "6584f...", 
 *   "tipologia": "potatura",
 *   "dataPrevista": "2024-03-15T09:00:00Z",
 *   "stato": "pianificato",
 *   "note": "Potatura primaverile alberi zona nord",
 *   "responsabile": "Ufficio Verde Trento",
 *   "rinnovo": { "isAutomatico": false, "frequenza": "" }
 * }
 */

module.exports = InterventoSchema;