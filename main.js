// =====================
//  STATE
// =====================
const state = {
    goal: '',
    goalKey: '',   // 'profesional' | 'estudios' | 'empresa' | 'otro'
    missions: [],
    chatHistory: [],
    msgCount: 0,
  };
  
  // =====================
  //  NAVIGATION
  // =====================
  function goTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) screen.classList.add('active');
  }
  
  // =====================
  //  GOAL SELECTION
  // =====================
  function selectGoal(btn, goalName, goalKey) {
    document.querySelectorAll('.goal-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.goal = goalName;
    state.goalKey = goalKey;
    document.getElementById('otro-input-wrapper').classList.add('hidden');
    document.getElementById('otro-input').value = '';
    showContinueBtn();
  }
  
  function toggleOtro(btn) {
    document.querySelectorAll('.goal-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.goalKey = 'otro';
    const wrapper = document.getElementById('otro-input-wrapper');
    wrapper.classList.remove('hidden');
    document.getElementById('otro-input').focus();
    hideContinueBtn();
  }
  
  function updateOtroGoal() {
    const val = document.getElementById('otro-input').value.trim();
    state.goal = val || '';
    val.length > 0 ? showContinueBtn() : hideContinueBtn();
  }
  
  function showContinueBtn() {
    document.getElementById('btn-continue-goal').classList.remove('hidden');
  }
  function hideContinueBtn() {
    document.getElementById('btn-continue-goal').classList.add('hidden');
  }
  
  function continueToChat() {
    if (!state.goal) return;
    document.getElementById('chat-goal-label').textContent = `Meta: ${state.goal}`;
    state.chatHistory = [];
    state.msgCount = 0;
    document.getElementById('chat-messages').innerHTML = '';
    goTo('screen-chat');
    aiGreeting();
  }
  
  // =====================
  //  RESPUESTAS SIN API
  // =====================
  
  const RESPONSES = {
    profesional: {
      greeting: [
        `¡Hola! Soy vos, pero del futuro 👋 Ya soy profesional y te puedo decir que el camino valió cada segundo. El primer paso es el más importante — estás acá, eso ya dice mucho. ¿Qué te preocupa más ahora mismo?`,
      ],
      motivacion: [
        `Acordate: cada hora que estudiás hoy es una inversión que el futuro vos va a agradecer. Yo lo viví. Seguí. 💪`,
        `Los días difíciles son los que más te forman. Cuando me sentía igual que vos ahora, seguí de todas formas. Eso marcó la diferencia.`,
        `Vas bien. Mejor de lo que creés. No te compares con los demás, comparate con quien eras ayer.`,
      ],
      consejo: [
        `Enfocate en una sola cosa a la vez. La multitarea es una trampa — yo lo aprendí a las malas. Bloques de 25 minutos, sin el celu.`,
        `Buscá un mentor, alguien que ya esté donde querés llegar. Abrevi años de errores de esa manera.`,
        `No esperes sentirte "listo/a". Empezá con lo que tenés hoy. La claridad llega en el camino, no antes.`,
      ],
      duda: [
        `Es normal dudar. Yo también dudé. Pero te digo algo: la incertidumbre no desaparece esperando, desaparece actuando. ¿Qué podés hacer hoy, aunque sea pequeño?`,
        `Todas esas dudas que tenés las tuve yo también. Y acá estoy. La clave fue seguir un día a la vez.`,
      ],
      default: [
        `Entiendo lo que me decís. En mi experiencia, la clave fue consistencia — no perfección. ¿Querés que te cuente cómo lo manejé yo?`,
        `Buena pregunta. Cuando estaba en tu lugar me pregunté lo mismo. Lo que me ayudó fue enfocarse en el proceso, no solo en el resultado. 🎯`,
        `Eso que sentís es parte del camino. Hablame más, ¿qué es lo que más te traba ahora?`,
      ],
    },
    estudios: {
      greeting: [
        `¡Ey! Soy vos del futuro — y te digo que mejorar tus estudios fue la mejor decisión que tomé. No fue fácil, pero tengo todas las herramientas que necesitaba. ¿Por dónde querés empezar?`,
      ],
      motivacion: [
        `Una materia a la vez. Una semana a la vez. Así fue como yo lo hice y funcionó. Vos podés. 📚`,
        `Cuando sientas que no podés más, acordate por qué empezaste. Esa razón es tu motor.`,
        `El esfuerzo de hoy es el resultado de mañana. Lo vi con mis propios ojos. Confiá en el proceso.`,
      ],
      consejo: [
        `Usá la técnica Pomodoro: 25 min de estudio, 5 de descanso. Tu cerebro retiene mucho más así. Yo la usé para prepararme para exámenes.`,
        `Estudiá activo, no pasivo. No resubrays nada — hacé resúmenes con tus palabras y practicá con preguntas. Eso es lo que realmente queda.`,
        `Organizá la semana los domingos a la noche. 10 minutos planificando te ahorran horas de confusión.`,
      ],
      duda: [
        `Las dudas son normales. Pero fijate: si estuvieras en el camino equivocado, no estarías acá buscando mejorar. Eso es una señal importante.`,
        `Yo me sentí así muchas veces. Lo que me sacó del pozo fue hacer una cosa pequeña y concreta ese mismo día.`,
      ],
      default: [
        `Eso me pasó a mí también. Lo resolví buscando ayuda — ya sea un compañero, un profesor o un video. No hay mérito en sufrir solo/a.`,
        `Muy buena reflexión. En mi caso, lo que cambió todo fue entender cómo aprendo mejor. ¿Ya sabés si sos más visual, auditivo o kinestésico?`,
        `Seguí haciéndote esas preguntas — eso es lo que te diferencia. ¿Qué materia o tema te tiene más trabado/a ahora?`,
      ],
    },
    empresa: {
      greeting: [
        `¡Hola emprendedor/a! 🚀 Soy vos del futuro — y sí, la empresa que soñabas existe. Fue duro, fue hermoso. El camino empieza con una pregunta: ¿qué problema querés resolver?`,
      ],
      motivacion: [
        `Cada "no" que recibí me acercó más al "sí" que cambió todo. El rechazo es información, no un veredicto.`,
        `Las startups no mueren por falta de ideas — mueren por falta de consistencia. Aparecé todos los días, aunque sea 1 hora.`,
        `Yo también sentí que era imposible. Después de un año de trabajo constante, todo cambió. Vos también podés llegar ahí.`,
      ],
      consejo: [
        `Antes de construir, hablá con 10 personas que tengan el problema que querés resolver. Eso me ahorró meses de trabajo en la dirección equivocada.`,
        `Empezá pequeño y validá rápido. Una landing page y un formulario ya te dicen si tu idea tiene mercado. No esperes tener el producto perfecto.`,
        `Rodeate de personas que ya hicieron lo que querés hacer. Un mentor vale más que un año de cursos.`,
      ],
      duda: [
        `El miedo a fallar es normal. Pero el peor fracaso es no intentarlo. Yo lo intenté, fallé en cosas, y aprendí más de esos errores que de cualquier éxito.`,
        `Dudar es sano. Lo que te digo es: actuá igual. La claridad viene después de empezar, no antes.`,
      ],
      default: [
        `Muy buena observación. En el mundo emprendedor eso se llama "aprendizaje validado". ¿Ya tenés identificado tu cliente ideal?`,
        `Exacto. Cuando yo estaba en tu lugar, lo que más me ayudó fue escribir todo — mis ideas, miedos, planes. ¿Tenés algún registro de tus avances?`,
        `Interesante. Eso que describís es un problema que muchos emprendedores tienen. ¿Querés que te cuente cómo lo resolví en su momento?`,
      ],
    },
    otro: {
      greeting: [
        `¡Hola! Soy tu versión del futuro ✨ Ya llegué a donde vos querés llegar con "${state.goal}", y fue un viaje increíble. Acá estoy para guiarte. ¿Cómo te sentís con tu meta hoy?`,
      ],
      motivacion: [
        `Cada pequeño paso cuenta más de lo que creés. Yo lo viví. Seguí adelante. 🌟`,
        `Los días que más creés que no avanzás son los que más te forman. Confía en el proceso.`,
        `Ya elegiste una meta — eso te pone por delante de la mayoría que nunca lo hace.`,
      ],
      consejo: [
        `Dividí tu meta grande en pasos pequeños semanales. Lo abrumador se vuelve manejable. Así empecé yo.`,
        `Celebrá los avances chicos. El cerebro aprende que vale la pena seguir cuando reconocés el progreso.`,
        `Revisá tu meta cada semana. A veces hay que ajustar el rumbo — eso no es fracasar, es ser inteligente.`,
      ],
      duda: [
        `Las dudas son parte del camino. Lo importante es no dejar que te paralicen. Yo también las tuve y seguí de todas formas.`,
        `Dudar no significa que estás equivocado/a. Significa que te importa. Eso es buena señal.`,
      ],
      default: [
        `Entiendo. Cuando yo estaba donde estás vos, lo que me ayudó fue hablar con alguien que ya había pasado por eso. ¿Tenés referentes en lo que querés lograr?`,
        `Muy buena reflexión. Seguí haciéndote esas preguntas — es la base del crecimiento real. ¿Qué es lo que más te traba hoy?`,
        `Eso que sentís es completamente válido. La clave es no quedarse ahí. ¿Qué es lo mínimo que podrías hacer hoy para avanzar aunque sea un poco?`,
      ],
    },
  };
  
  const MISSIONS_DB = {
    profesional: [
      { icon: '📖', text: 'Leé 20 páginas de un libro de tu área' },
      { icon: '💼', text: 'Actualizá tu LinkedIn con una habilidad nueva' },
      { icon: '🎯', text: 'Contactá a un profesional del sector para hacer networking' },
      { icon: '✏️', text: 'Escribí 3 cosas que aprendiste esta semana' },
      { icon: '🖥️', text: 'Completá una lección de un curso online' },
      { icon: '📝', text: 'Revisá y mejorá tu CV' },
      { icon: '🔍', text: 'Investigá 3 empresas donde te gustaría trabajar' },
      { icon: '💡', text: 'Practicá 15 min de inglés profesional' },
    ],
    estudios: [
      { icon: '📖', text: 'Estudiá 45 minutos sin distracciones' },
      { icon: '✏️', text: 'Hacé un resumen de lo que estudiaste hoy' },
      { icon: '🎯', text: 'Resolvé 5 ejercicios de práctica' },
      { icon: '📅', text: 'Organizá tu semana de estudio para los próximos 7 días' },
      { icon: '🤝', text: 'Formá o uníte a un grupo de estudio' },
      { icon: '❓', text: 'Repasá los temas donde más dudas tenés' },
      { icon: '🖥️', text: 'Mirá una clase grabada que te quedó pendiente' },
      { icon: '💤', text: 'Dormí 8 horas — el descanso es parte del estudio' },
    ],
    empresa: [
      { icon: '💡', text: 'Escribí el problema que tu idea resuelve en 2 oraciones' },
      { icon: '🔍', text: 'Investigá 2 competidores y anotá sus puntos débiles' },
      { icon: '🤝', text: 'Hablá con un potencial cliente sobre su problema' },
      { icon: '📊', text: 'Creá o actualizá tu modelo de negocio en 1 hoja' },
      { icon: '📱', text: 'Diseñá el flujo básico de tu producto o servicio' },
      { icon: '💰', text: 'Calculá cuánto costaría lanzar una versión mínima' },
      { icon: '📣', text: 'Publicá algo sobre tu emprendimiento en redes' },
      { icon: '📖', text: 'Leé un caso de éxito de una startup similar' },
    ],
    otro: [
      { icon: '🎯', text: 'Definí cuál es el primer paso concreto hacia tu meta' },
      { icon: '📖', text: 'Dedicá 30 min a aprender algo relacionado con tu objetivo' },
      { icon: '✏️', text: 'Escribí 3 avances que tuviste esta semana' },
      { icon: '💪', text: 'Hacé una tarea que venías postergando' },
      { icon: '🤝', text: 'Hablá con alguien que ya logró lo que vos querés' },
      { icon: '📅', text: 'Planificá el próximo paso para mañana' },
      { icon: '🌟', text: 'Anotá por qué esta meta es importante para vos' },
      { icon: '🔍', text: 'Investigá recursos que te ayuden con tu objetivo' },
    ],
  };
  
  function getKey() {
    return state.goalKey || 'otro';
  }
  
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  function classifyMessage(text) {
    const t = text.toLowerCase();
    if (/no (puedo|pued)|cansa|rendir|renunc|dif[íi]cil|imposible|no s[eé]|perdid|agotad/.test(t)) return 'motivacion';
    if (/c[oó]mo|consejo|ayud|qu[eé] hago|qu[eé] me rec|tip|estrategia/.test(t)) return 'consejo';
    if (/dud|miedo|insegur|segur|vale la pena|sirve|funciona/.test(t)) return 'duda';
    return 'default';
  }
  
  function getFutureResponse(userText) {
    const key = getKey();
    const bank = RESPONSES[key] || RESPONSES.otro;
    const category = classifyMessage(userText);
    const pool = bank[category] || bank.default;
    
    // Avoid repeating last message
    const lastMsg = state.chatHistory.filter(m => m.role === 'assistant').slice(-1)[0]?.content;
    let candidates = pool.filter(r => r !== lastMsg);
    if (candidates.length === 0) candidates = pool;
    
    // Add occasional missions nudge
    const nudge = state.msgCount > 0 && state.msgCount % 3 === 0
      ? '\n\n👉 Acordate de revisar tus misiones del día — cada tarea completada te acerca más.'
      : '';
  
    return pickRandom(candidates) + nudge;
  }
  
  // =====================
  //  CHAT UI
  // =====================
  function addMsg(text, isAi) {
    const el = document.createElement('div');
    el.className = isAi ? 'msg msg-ai' : 'msg msg-user';
    el.textContent = text;
    const container = document.getElementById('chat-messages');
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }
  
  function showTyping() {
    const el = document.createElement('div');
    el.className = 'msg msg-ai msg-typing';
    el.id = 'typing-indicator';
    el.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    document.getElementById('chat-messages').appendChild(el);
    document.getElementById('chat-messages').scrollTop = 99999;
  }
  
  function hideTyping() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
  }
  
  function aiGreeting() {
    const key = getKey();
    const bank = RESPONSES[key] || RESPONSES.otro;
    showTyping();
    setTimeout(() => {
      hideTyping();
      const msg = bank.greeting[0].replace('${state.goal}', state.goal);
      addMsg(msg, true);
      state.chatHistory.push({ role: 'assistant', content: msg });
    }, 900);
  }
  
  function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMsg(text, false);
    state.chatHistory.push({ role: 'user', content: text });
    state.msgCount++;
  
    showTyping();
    const delay = 700 + Math.random() * 600;
    setTimeout(() => {
      hideTyping();
      const reply = getFutureResponse(text);
      addMsg(reply, true);
      state.chatHistory.push({ role: 'assistant', content: reply });
    }, delay);
  }
  
  // =====================
  //  MISSIONS
  // =====================
  function goToMissions() {
    document.getElementById('missions-goal-text').textContent = state.goal || '—';
    if (state.missions.length === 0) generateMissions();
    else renderMissions();
    goTo('screen-missions');
  }
  
  function generateMissions() {
    const key = getKey();
    const pool = [...(MISSIONS_DB[key] || MISSIONS_DB.otro)];
    // Shuffle and pick 4
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    state.missions = pool.slice(0, 4).map(m => ({ ...m, done: false }));
    renderMissions();
    renderMap();
  }
  
  function renderMissions() {
    const list = document.getElementById('missions-list');
    list.innerHTML = '';
    state.missions.forEach((m, i) => {
      const el = document.createElement('div');
      el.className = 'mission-item' + (m.done ? ' done' : '');
      el.style.animationDelay = `${i * 0.08}s`;
      el.innerHTML = `
        <span class="mission-icon">${m.icon}</span>
        <span class="mission-text">${m.text}</span>
        <div class="mission-check">${m.done ? '✓' : ''}</div>
      `;
      el.onclick = () => toggleMission(i);
      list.appendChild(el);
    });
  }
  
  function toggleMission(index) {
    state.missions[index].done = !state.missions[index].done;
    renderMissions();
    renderMap();
  }
  
  // =====================
  //  MAP  (SVG mejorado)
  // =====================
  // Posiciones en porcentaje del viewBox 400x260
  const NODES = [
    { cx: 72,  cy: 200 },
    { cx: 168, cy: 110 },
    { cx: 264, cy: 175 },
    { cx: 338, cy: 72  },
  ];
  
  function cubicBezierPath(pts) {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].cx} ${pts[0].cy}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cp1x = prev.cx + (curr.cx - prev.cx) * 0.45;
      const cp1y = prev.cy;
      const cp2x = prev.cx + (curr.cx - prev.cx) * 0.55;
      const cp2y = curr.cy;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.cx} ${curr.cy}`;
    }
    return d;
  }
  
  function renderMap() {
    const svg = document.getElementById('map-svg');
    svg.innerHTML = '';
  
    const doneCount = state.missions.filter(m => m.done).length;
  
    // Glow filter
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glow-strong">
        <feGaussianBlur stdDeviation="5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <linearGradient id="path-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.15)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.5)"/>
      </linearGradient>
      <linearGradient id="path-done-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(130,240,170,0.6)"/>
        <stop offset="100%" stop-color="rgba(80,210,120,0.9)"/>
      </linearGradient>
    `;
    svg.appendChild(defs);
  
    // Background full path (dashed)
    const bgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bgPath.setAttribute('d', cubicBezierPath(NODES));
    bgPath.setAttribute('fill', 'none');
    bgPath.setAttribute('stroke', 'url(#path-grad)');
    bgPath.setAttribute('stroke-width', '3');
    bgPath.setAttribute('stroke-dasharray', '8 5');
    svg.appendChild(bgPath);
  
    // Progress path (solid, green for done nodes)
    if (doneCount > 0) {
      const progressPts = NODES.slice(0, doneCount + 1);
      const progressPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      progressPath.setAttribute('d', cubicBezierPath(progressPts));
      progressPath.setAttribute('fill', 'none');
      progressPath.setAttribute('stroke', 'url(#path-done-grad)');
      progressPath.setAttribute('stroke-width', '4');
      progressPath.setAttribute('stroke-linecap', 'round');
      progressPath.setAttribute('filter', 'url(#glow)');
      svg.appendChild(progressPath);
    }
  
    // Draw nodes
    NODES.forEach((pos, i) => {
      const mission = state.missions[i];
      const isDone = mission ? mission.done : false;
      const isActive = mission && !mission.done && (i === 0 || state.missions[i - 1]?.done);
  
      // Outer glow for active
      if (isActive) {
        const glowCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glowCircle.setAttribute('cx', pos.cx);
        glowCircle.setAttribute('cy', pos.cy);
        glowCircle.setAttribute('r', '28');
        glowCircle.setAttribute('fill', 'rgba(255,255,255,0.12)');
        glowCircle.setAttribute('filter', 'url(#glow-strong)');
        svg.appendChild(glowCircle);
      }
  
      // Node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', pos.cx);
      circle.setAttribute('cy', pos.cy);
      circle.setAttribute('r', '22');
      circle.setAttribute('fill', isDone ? 'rgba(100,220,140,0.9)' : isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)');
      circle.setAttribute('stroke', isDone ? 'rgba(100,220,140,1)' : 'rgba(255,255,255,0.7)');
      circle.setAttribute('stroke-width', isActive ? '2.5' : '1.5');
      circle.style.cursor = 'pointer';
      circle.onclick = () => { if (mission) toggleMission(i); };
      svg.appendChild(circle);
  
      // Icon / check inside node
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', pos.cx);
      label.setAttribute('y', pos.cy + 1);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'middle');
      label.setAttribute('font-size', isDone ? '14' : '11');
      label.setAttribute('fill', isDone ? '#1a4d2a' : isActive ? '#5e17eb' : 'rgba(255,255,255,0.7)');
      label.setAttribute('font-family', 'Poppins, sans-serif');
      label.setAttribute('font-weight', '700');
      label.textContent = isDone ? '✓' : `${i + 1}`;
      label.style.cursor = 'pointer';
      label.onclick = () => { if (mission) toggleMission(i); };
      svg.appendChild(label);
  
      // Label below node
      const tag = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tag.setAttribute('x', pos.cx);
      tag.setAttribute('y', pos.cy + 34);
      tag.setAttribute('text-anchor', 'middle');
      tag.setAttribute('font-size', '7.5');
      tag.setAttribute('fill', 'rgba(255,255,255,0.6)');
      tag.setAttribute('font-family', 'Poppins, sans-serif');
      tag.setAttribute('font-weight', '600');
      tag.setAttribute('letter-spacing', '0.5');
      const shortText = mission ? (mission.text.length > 14 ? mission.text.slice(0, 13) + '…' : mission.text) : `OBJ ${i+1}`;
      tag.textContent = shortText;
      svg.appendChild(tag);
    });
  
    // Star node at the end
    const starNode = document.getElementById('star-end');
    const allDone = state.missions.length > 0 && state.missions.every(m => m.done);
    starNode.style.opacity = allDone ? '1' : '0.3';
    starNode.style.filter = allDone ? 'drop-shadow(0 0 10px gold)' : 'none';
  }
  
  // =====================
  //  INIT
  // =====================
  document.addEventListener('DOMContentLoaded', () => {
    renderMap();
  });