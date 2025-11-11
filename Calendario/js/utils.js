/* utils.js - funciones auxiliares (expuestas en window.Utils) */
window.Utils = (function(){
  function escapeHtml(str){
    if(str === undefined || str === null) return '';
    return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
  }
  function labelCat(c){
    const map = { 'manga':'Manga','nocturna':'Nocturna','cata':'Cata/Barista','cafe':'Café','cerveza':'Cerveza' };
    if(!c) return '';
    return map[c] || (String(c).charAt(0).toUpperCase() + String(c).slice(1));
  }
  function fmtDate(d){
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
  }
  function parseYmd(ymd){
    // y-m-d -> Date (local)
    const [y,m,d] = String(ymd).split('-').map(Number);
    return new Date(y, m-1, d);
  }
  function formatMoneyARS(num){
    try{
      return new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'}).format(Number(num||0));
    }catch(e){ return String(num) }
  }
  function googleLink(e){
    const start = e.date.replace(/-/g,'');
    const endDate = new Date(e.date);
    endDate.setDate(endDate.getDate()+1);
    const end = [endDate.getFullYear(), String(endDate.getMonth()+1).padStart(2,'0'), String(endDate.getDate()).padStart(2,'0')].join('').replace(/-/g,'');
    const text = encodeURIComponent(e.title||'Evento');
    const details = encodeURIComponent(e.description||'');
    const location = encodeURIComponent(e.location||'');
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
  }

  return { escapeHtml, labelCat, fmtDate, parseYmd, formatMoneyARS, googleLink };
})();
