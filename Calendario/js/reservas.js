/* reservas.js - lógica de reservas (localStorage) */
window.Reservas = (function(){
  const KEY = 'reservas_23experiencias_v1';
  const EVENTS_OVERRIDE = 'events_override_23exp_v1';

  function load(){
    try{ return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(e){ return {}; }
  }
  function save(obj){
    localStorage.setItem(KEY, JSON.stringify(obj));
  }

  function loadEventsOverride(){
    try{ return JSON.parse(localStorage.getItem(EVENTS_OVERRIDE) || 'null'); }catch(e){ return null; }
  }
  function saveEventsOverride(e){ localStorage.setItem(EVENTS_OVERRIDE, JSON.stringify(e)); }

  function resetAll(){
    localStorage.removeItem(KEY);
    localStorage.removeItem(EVENTS_OVERRIDE);
  }

  function getReservationsFor(eventId){
    const db = load();
    return db[eventId] || [];
  }

  function availableSeats(eventObj){
    if(!eventObj) return 0;
    const reservations = getReservationsFor(eventObj.id);
    // If events override exist (persisted available), use that; else compute from initial available
    const override = loadEventsOverride();
    if(override && override[eventObj.id] !== undefined){
      return Math.max(0, override[eventObj.id]);
    }
    // default: capacity - stored reservations length OR eventObj.available if provided
    if(typeof eventObj.available === 'number') {
      return Math.max(0, eventObj.available - (reservations.length || 0));
    }
    return Math.max(0, eventObj.capacity - (reservations.length || 0));
  }

  function reduceAvailable(eventId, qty){
    const override = loadEventsOverride() || {};
    override[eventId] = Math.max(0, (override[eventId] || findEventById(eventId).available || findEventById(eventId).capacity) - qty);
    saveEventsOverride(override);
  }

  function findEventById(id){
    return (window.EVENTS || []).find(e => e.id === id) || null;
  }

  function reserve(eventId, nombre, email, qty=1){
    if(!email || !nombre) return { ok:false, msg:'Nombre y email requeridos' };
    const event = findEventById(eventId);
    if(!event) return { ok:false, msg:'Evento no encontrado' };
    const seats = availableSeats(event);
    if(seats < qty) return { ok:false, msg:'No hay suficientes lugares disponibles' };

    const db = load();
    if(!db[eventId]) db[eventId] = [];
    // evitar duplicados por email
    if(db[eventId].some(r => r.email === email.toLowerCase())){
      return { ok:false, msg:'Ya existe una reserva con ese email para este evento' };
    }
    db[eventId].push({ nombre: String(nombre), email: String(email).toLowerCase(), qty: Number(qty), ts: Date.now() });
    save(db);
    reduceAvailable(eventId, qty);
    return { ok:true, msg:'Reserva confirmada' };
  }

  return { load, save, getReservationsFor, availableSeats, reserve, resetAll, findEventById };
})();
