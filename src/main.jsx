import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './location.css'
import './chat.css'
import './footer.css'
import './procedure-icons.css'
import './carousel.css'
import './procedure-stage.css'
import './procedures-theme.css'
import './doctor-photo.css'
import './ios-hero.css'
import './mobile-overflow.css'
import './language.css'

const WA_MESSAGE = 'Hola Dr. Rivera, vengo desde su Web Page y quiero información sobre una consulta. / Hi Dr. Rivera, I am visiting from your website and would like information about a consultation.'
const WA = `https://api.whatsapp.com/send?phone=18299447001&text=${encodeURIComponent(WA_MESSAGE)}`

const Arrow = () => <span aria-hidden="true">↗</span>
const ChatIcon = () => <span className="whatsapp-chat-icon" aria-hidden="true"><i /></span>
const SocialIcon = ({ network }) => <span className={`social-icon social-icon-${network}`} aria-hidden="true" />
const LocationIcon = () => <span className="location-arrow-icon" aria-hidden="true" />
const ScalpelIcon = () => <span className="scalpel-icon" aria-hidden="true" />

function Reveal({ children, from = 'up', className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    const enterObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || !node) return
      node.classList.add('is-visible')
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' })
    const exitObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting || !node) return
      node.classList.remove('is-visible')
    }, { threshold: 0, rootMargin: '150px 0px 150px 0px' })
    if (node) {
      enterObserver.observe(node)
      exitObserver.observe(node)
    }
    return () => {
      enterObserver.disconnect()
      exitObserver.disconnect()
    }
  }, [])
  return <div ref={ref} className={`reveal reveal-${from} ${className}`}>{children}</div>
}

const content = {
  es: {
    procedures: [
      ['Lipoescultura', 'Contornos más definidos, diseñados para tu anatomía.'],
      ['Mommy makeover', 'Un plan integral y personalizado para sentirte tú otra vez.'],
      ['Cirugía mamaria', 'Aumento, reducción o levantamiento con proporción natural.'],
      ['Rinoplastia', 'Equilibrio facial sin perder aquello que te hace única.'],
      ['Glúteos', 'Volumen y forma con una evaluación médica responsable.'],
    ],
    praise: ['Me encanta su trabajo, cada resultado se ve tan natural.', '¡Qué belleza de resultado! Se nota el cuidado en cada detalle.', 'Pronto será mi momento. Ya estoy soñando con dar ese paso.', 'Su trabajo inspira muchísima confianza, doctor.', 'Admiro cómo resalta la belleza de cada paciente sin cambiar su esencia.'],
  },
  en: {
    procedures: [
      ['Liposculpture', 'More defined contours, designed around your anatomy.'],
      ['Mommy makeover', 'A comprehensive, personalized plan to help you feel like yourself again.'],
      ['Breast surgery', 'Augmentation, reduction, or lift with natural proportions.'],
      ['Rhinoplasty', 'Facial balance without losing what makes you unique.'],
      ['Buttock enhancement', 'Shape and volume guided by a responsible medical assessment.'],
    ],
    praise: ['I love his work. Every result looks so natural.', 'What a beautiful result! You can see the care in every detail.', 'Soon it will be my turn. I am already dreaming of taking that step.', 'Your work inspires so much confidence, doctor.', 'I admire how you enhance each patient’s beauty without changing her essence.'],
  },
}

const procedureImages = ['/img/icons/lipoescultura.png', '/img/icons/mommy-makeover.png', '/img/icons/cirugia-mamaria.png', '/img/icons/rinoplastia.png', '/img/icons/gluteos.png']

function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem('rr-language') || 'es')
  const [activeProcedure, setActiveProcedure] = useState(0)
  const [hasExploredProcedures, setHasExploredProcedures] = useState(false)
  const [procedureDrag, setProcedureDrag] = useState(0)
  const [procedureStageWidth, setProcedureStageWidth] = useState(1)
  const [procedureSettling, setProcedureSettling] = useState(false)
  const procedureTouchStart = useRef(0)
  const procedureDragging = useRef(false)
  const procedureDragValue = useRef(0)
  const procedureWidthValue = useRef(1)
  const procedureLastPoint = useRef({ x: 0, time: 0 })
  const procedureVelocity = useRef(0)
  const doctorPhoto = useRef(null)
  const isEnglish = language === 'en'
  const procedures = content[language].procedures.map(([name, text], index) => ({ name, text, image: procedureImages[index] }))
  const praise = content[language].praise

  useEffect(() => {
    localStorage.setItem('rr-language', language)
    document.documentElement.lang = language
    document.title = isEnglish ? 'Dr. Rafael Rivera | Plastic Surgery' : 'Dr. Rafael Rivera | Cirugía Plástica'
  }, [language, isEnglish])

  useEffect(() => {
    let frame
    const updateDoctorZoom = () => {
      frame = undefined
      const image = doctorPhoto.current
      if (!image) return
      const section = image.closest('.doctor')
      const rect = section.getBoundingClientRect()
      const viewport = window.innerHeight
      const progress = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport + rect.height)))
      const zoom = 1.06 + Math.sin(progress * Math.PI) * .1
      image.style.setProperty('--doctor-scroll-zoom', zoom.toFixed(4))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateDoctorZoom)
    }
    updateDoctorZoom()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const goToProcedure = (index) => {
    const target = (index + procedures.length) % procedures.length
    setActiveProcedure(target)
    setHasExploredProcedures(true)
  }

  const startProcedureSwipe = (event) => {
    if (procedureSettling) return
    const copyViewport = event.currentTarget.querySelector('.procedure-copy-viewport')
    const width = copyViewport?.clientWidth || event.currentTarget.clientWidth
    procedureDragging.current = true
    procedureTouchStart.current = event.clientX
    procedureDragValue.current = 0
    procedureVelocity.current = 0
    procedureWidthValue.current = width
    procedureLastPoint.current = { x: event.clientX, time: performance.now() }
    setProcedureStageWidth(width)
    setProcedureDrag(0)
    setHasExploredProcedures(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const moveProcedureSwipe = (event) => {
    if (!procedureDragging.current || procedureSettling) return
    const now = performance.now()
    const elapsed = Math.max(1, now - procedureLastPoint.current.time)
    const instantVelocity = (event.clientX - procedureLastPoint.current.x) / elapsed
    procedureVelocity.current = procedureVelocity.current * .65 + instantVelocity * .35
    procedureLastPoint.current = { x: event.clientX, time: now }
    const distance = event.clientX - procedureTouchStart.current
    const width = procedureWidthValue.current
    const nextDrag = Math.max(-width * .94, Math.min(width * .94, distance))
    procedureDragValue.current = nextDrag
    setProcedureDrag(nextDrag)
  }

  const finishProcedureSwipe = () => {
    if (!procedureDragging.current || procedureSettling) return
    procedureDragging.current = false
    const drag = procedureDragValue.current
    const width = procedureWidthValue.current
    const completed = Math.abs(drag) > Math.min(90, width * .14) || Math.abs(procedureVelocity.current) > .42
    if (!completed) {
      setProcedureSettling(true)
      procedureDragValue.current = 0
      setProcedureDrag(0)
      window.setTimeout(() => setProcedureSettling(false), 460)
      return
    }
    const motion = Math.abs(procedureVelocity.current) > .42 ? procedureVelocity.current : drag
    const direction = motion < 0 ? 1 : -1
    const destination = direction > 0 ? -width : width
    setProcedureSettling(true)
    procedureDragValue.current = destination
    setProcedureDrag(destination)
    window.setTimeout(() => {
      setActiveProcedure((current) => (current + direction + procedures.length) % procedures.length)
      procedureDragValue.current = 0
      setProcedureDrag(0)
      setProcedureSettling(false)
    }, 500)
  }

  const dragDirection = procedureDrag < 0 ? 1 : -1
  const previewProcedure = (activeProcedure + dragDirection + procedures.length) % procedures.length
  const dragProgress = Math.min(1, Math.abs(procedureDrag) / Math.max(1, procedureStageWidth * .72))

  return <main>
    <div className="language-switch" role="group" aria-label={isEnglish ? 'Select language' : 'Seleccionar idioma'}>
      <button className={!isEnglish ? 'active' : ''} onClick={() => setLanguage('es')} aria-pressed={!isEnglish}>ES</button>
      <span aria-hidden="true">|</span>
      <button className={isEnglish ? 'active' : ''} onClick={() => setLanguage('en')} aria-pressed={isEnglish}>EN</button>
    </div>
    <section className="hero" id="inicio">
      <video autoPlay muted loop playsInline preload="auto"><source src="/multimedia/banner.mp4" type="video/mp4" /></video>
      <div className="hero-shade" />
      <div className="hero-copy">
        <Reveal><p className="eyebrow"><span/> {isEnglish ? 'Plastic surgery · Santo Domingo' : 'Cirugía plástica · Santo Domingo'}</p></Reveal>
        <Reveal from="left"><h1 className={isEnglish ? 'hero-title-en' : ''}><span>{isEnglish ? 'Your change.' : 'Tu cambio.'}</span><br/><em>{isEnglish ? 'Your essence.' : 'Tu esencia.'}</em></h1></Reveal>
        <Reveal><p className="hero-intro">{isEnglish ? 'Results that feel like you, with a plan designed around your goals and your safety.' : 'Resultados que se sienten tuyos, con un plan creado alrededor de ti y de tu seguridad.'}</p></Reveal>
        <Reveal><div className="hero-actions"><a className="button light" href={WA} target="_blank" rel="noreferrer">{isEnglish ? 'Let’s talk on WhatsApp' : 'Conversemos por WhatsApp'} <ChatIcon /></a><a href="#procedimientos" className="text-link">{isEnglish ? 'Explore procedures ↓' : 'Explorar procedimientos ↓'}</a></div></Reveal>
      </div>
      <div className="scroll-cue"><span>{isEnglish ? 'DISCOVER' : 'DESCUBRE'}</span><i/></div>
    </section>

    <section className="statement section-pad">
      <Reveal from="left"><p className="kicker">{isEnglish ? 'IT IS NOT ABOUT CHANGING WHO YOU ARE' : 'NO SE TRATA DE CAMBIAR QUIÉN ERES'}</p></Reveal>
      <Reveal from="right"><h2>{isEnglish ? 'It is about feeling' : 'Se trata de sentirte'}<br/><em>{isEnglish ? 'more like you.' : 'más tú.'}</em></h2></Reveal>
      <Reveal><p className="statement-copy">{isEnglish ? 'Every body tells a different story. That is why there are no formulas here: only an honest conversation, rigorous medical judgment, and a result designed for you.' : 'Cada cuerpo cuenta una historia diferente. Por eso aquí no existen fórmulas: existe una conversación honesta, un criterio médico riguroso y un resultado pensado para ti.'}</p></Reveal>
      <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
    </section>

    <section className="procedures-intro section-pad" id="procedimientos">
      <div className="section-head"><Reveal from="left"><p className="kicker">{isEnglish ? 'POSSIBILITIES' : 'POSIBILIDADES'}</p><h2 aria-label={isEnglish ? 'Choose how you want to feel.' : 'Elige cómo quieres sentirte.'}>{isEnglish ? 'Choose how you want' : 'Elige cómo quıeres'}<br/><em>{isEnglish ? 'to feel.' : 'sentirte.'}</em></h2></Reveal><Reveal from="right"><p>{isEnglish ? 'Discover some of our most requested procedures. Every decision begins with a personal assessment.' : 'Conoce algunos de los procedimientos más consultados. La decisión siempre comienza con una evaluación personal.'}</p></Reveal></div>
    </section>

    <section className="procedures procedures-dark" aria-label={isEnglish ? 'Explore procedures' : 'Explorar procedimientos'}>
      <Reveal className="procedure-stage-reveal">
        <div className={`procedure-stage ${procedureSettling ? 'is-settling' : ''}`} onPointerDown={startProcedureSwipe} onPointerMove={moveProcedureSwipe} onPointerUp={finishProcedureSwipe} onPointerCancel={finishProcedureSwipe} aria-live="polite" aria-label={`${isEnglish ? 'Procedure' : 'Procedimiento'}: ${procedures[activeProcedure].name}`}>
          {!hasExploredProcedures && <div className="swipe-hand" aria-hidden="true"><span>☞</span><small>{isEnglish ? 'SWIPE' : 'DESLIZA'}</small></div>}
          <div className="procedure-copy-viewport">
            <div className="procedure-drag-copy procedure-current-copy" style={{ transform: `translate3d(${procedureDrag}px, 0, 0)`, opacity: 1 - dragProgress * .35 }}>
              <h3>{procedures[activeProcedure].name}</h3>
              <p>{procedures[activeProcedure].text}</p>
            </div>
            <div className="procedure-drag-copy procedure-preview-copy" style={{ transform: `translate3d(calc(${dragDirection * 100}% + ${procedureDrag}px), 0, 0)`, opacity: dragProgress }}>
              <h3>{procedures[previewProcedure].name}</h3>
              <p>{procedures[previewProcedure].text}</p>
            </div>
          </div>
          <div className="procedure-stage-symbol">
            {procedures.map((procedure, index) => {
              const isCurrent = index === activeProcedure
              const isPreview = index === previewProcedure
              const opacity = isCurrent ? 1 - dragProgress : isPreview ? dragProgress : 0
              const scale = isCurrent ? 1 - dragProgress * .08 : isPreview ? .9 + dragProgress * .1 : .9
              return <img
                key={procedure.image}
                className={`procedure-icon-layer ${index === 0 || index === 3 ? 'procedure-icon-compact' : ''}`}
                src={procedure.image}
                alt={isCurrent ? `${isEnglish ? 'Symbol for' : 'Símbolo de'} ${procedure.name}` : ''}
                aria-hidden={!isCurrent}
                style={{ opacity, transform: `scale(${scale})`, zIndex: isPreview ? 3 : isCurrent ? 2 : 1 }}
              />
            })}
          </div>
        </div>
      </Reveal>
      <div className="carousel-controls">
        <div className="carousel-progress" aria-label={`${isEnglish ? 'Procedure' : 'Procedimiento'} ${activeProcedure + 1} ${isEnglish ? 'of' : 'de'} ${procedures.length}`}>
          <span className="carousel-count">0{activeProcedure + 1}</span>
          <div className="carousel-dots">{procedures.map((procedure, index) => <button key={procedure.name} className={index === activeProcedure ? 'active' : ''} onClick={() => goToProcedure(index)} aria-label={`${isEnglish ? 'View' : 'Ver'} ${procedure.name}`} aria-current={index === activeProcedure ? 'true' : undefined}/>)}</div>
          <span>0{procedures.length}</span>
        </div>
        <div className="carousel-arrows">
          <button onClick={() => goToProcedure(activeProcedure - 1)} aria-label={isEnglish ? 'Previous procedure' : 'Procedimiento anterior'}>←</button>
          <button onClick={() => goToProcedure(activeProcedure + 1)} aria-label={isEnglish ? 'Next procedure' : 'Procedimiento siguiente'}>→</button>
        </div>
      </div>
    </section>

    <section className="doctor" id="doctor">
      <div className="doctor-photo doctor-photo-black"><img ref={doctorPhoto} src="/img/galeria/DoctorWallBlack.png" alt={isEnglish ? 'Dr. Rafael Rivera, plastic surgeon' : 'Dr. Rafael Rivera, cirujano plástico'} loading="lazy"/><div className="photo-caption">{isEnglish ? 'Medical precision.' : 'Precisión médica.'}<br/>{isEnglish ? 'Human care.' : 'Trato humano.'}</div></div>
      <div className="doctor-copy section-pad"><Reveal from="right"><p className="kicker">{isEnglish ? 'MEET YOUR SURGEON' : 'CONOCE A TU CIRUJANO'}</p><h2>Dr. Rafael<br/><em>Rivera.</em></h2><p>{isEnglish ? 'A plastic surgeon committed to guiding you with honesty, attention to detail, and a deeply personalized vision of beauty.' : 'Cirujano plástico enfocado en acompañarte con honestidad, detalle y una visión profundamente personalizada de la belleza.'}</p></Reveal>
        <div className="principles"><Reveal><div><b>01</b><span><strong>{isEnglish ? 'Safety first' : 'Seguridad primero'}</strong>{isEnglish ? 'A certified environment and responsible medical decisions.' : 'Entorno certificado y decisiones médicas responsables.'}</span></div></Reveal><Reveal><div><b>02</b><span><strong>{isEnglish ? 'Natural results' : 'Resultados naturales'}</strong>{isEnglish ? 'Harmony, proportion, and respect for your essence.' : 'Armonía, proporción y respeto por tu esencia.'}</span></div></Reveal><Reveal><div><b>03</b><span><strong>{isEnglish ? 'Genuine support' : 'Acompañamiento real'}</strong>{isEnglish ? 'Clarity before, during, and after your procedure.' : 'Claridad antes, durante y después del procedimiento.'}</span></div></Reveal></div>
        <a className="line-link doctor-career-link" href="/nosotros.html">{isEnglish ? 'Discover his career' : 'Conoce su trayectoria'} <ScalpelIcon /></a>
      </div>
    </section>

    <section className="patient-love section-pad" aria-labelledby="patient-love-title">
      <Reveal><p className="kicker">{isEnglish ? 'WHAT THEY SAY' : 'LO QUE ELLAS DICEN'}</p><h2 id="patient-love-title">{isEnglish ? 'Messages that' : 'Mensajes que'}<br/><em>{isEnglish ? 'inspire us.' : 'nos inspiran.'}</em></h2></Reveal>
      <div className="chat-stream">
        {praise.map((message, index) => <Reveal key={message} from={index % 2 ? 'right' : 'left'} className={`chat-row ${index % 2 ? 'chat-right' : 'chat-left'}`}>
          <article className="chat-bubble">
            <div className="chat-meta"><span className="chat-avatar">{['M','A','L','C','S'][index]}</span><span>{isEnglish ? 'Patient' : 'Paciente'}</span><time>{isEnglish ? 'Now' : 'Ahora'}</time></div>
            <p>{message}</p>
          </article>
        </Reveal>)}
      </div>
      <Reveal><p className="love-note">{isEnglish ? 'Comments inspired by messages from our community.' : 'Comentarios inspirados en los mensajes de nuestra comunidad.'}</p></Reveal>
    </section>

    <section className="safety section-pad"><Reveal><span className="seal">R</span><p className="kicker">{isEnglish ? 'YOUR SAFETY IS NON-NEGOTIABLE' : 'TU SEGURIDAD NO ES NEGOCIABLE'}</p><h2>{isEnglish ? 'Informed decisions.' : 'Decisiones informadas.'}<br/><em>{isEnglish ? 'Responsible results.' : 'Resultados responsables.'}</em></h2><p>{isEnglish ? 'Every surgical procedure requires an individual medical assessment. During your consultation, we will speak transparently about expectations, alternatives, benefits, and risks.' : 'Todo procedimiento quirúrgico requiere evaluación médica individual. En consulta hablaremos con transparencia sobre expectativas, alternativas, beneficios y riesgos.'}</p><a className="button light" href={WA} target="_blank" rel="noreferrer">{isEnglish ? 'Request an assessment' : 'Solicitar evaluación'} <ChatIcon /></a></Reveal></section>

    <section className="final-cta section-pad"><Reveal from="left"><p className="kicker">{isEnglish ? 'WHEN YOU ARE READY' : 'CUANDO ESTÉS LISTA'}</p><h2>{isEnglish ? 'Your story can' : 'Tu historia puede'}<br/>{isEnglish ? 'begin ' : 'empezar '}<em>{isEnglish ? 'today.' : 'hoy.'}</em></h2></Reveal><Reveal from="right"><a className="conversation-cta" href={WA} target="_blank" rel="noreferrer"><span><small>{isEnglish ? 'Take the first step' : 'Da el primer paso'}</small>{isEnglish ? 'Let’s start a conversation' : 'Iniciemos una conversación'}</span><ChatIcon /></a></Reveal></section>

    <section className="location" aria-labelledby="location-title">
      <Reveal from="left" className="location-card">
        <p className="kicker">{isEnglish ? 'VISIT US' : 'VISÍTANOS'}</p>
        <h2 id="location-title">{isEnglish ? 'Find us in' : 'Estamos en'}<br/><em>Santo Domingo.</em></h2>
        <p>CECILIP · Calle Wifredo García #5<br/>Santo Domingo 10510</p>
        <a className="line-link location-link" href="https://www.google.com/maps/search/?api=1&query=CECILIP%2C%20Santo%20Domingo" target="_blank" rel="noreferrer">{isEnglish ? 'Get directions' : 'Cómo llegar'} <LocationIcon /></a>
      </Reveal>
      <div className="map-frame">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15135.270486304866!2d-69.9362214!3d18.4919185!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf8996a6ddd117%3A0x691ee987ede6f809!2sCECILIP!5e0!3m2!1ses!2sdo!4v1720407550337!5m2!1ses!2sdo"
          title={isEnglish ? 'CECILIP location in Santo Domingo' : 'Ubicación de CECILIP en Santo Domingo'}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>

    <footer className="site-footer">
      <div className="footer-lead">
        <div className="footer-identity"><img src="/img/logo.png" alt=""/><div><strong>Dr. Rafael Rivera</strong><span>{isEnglish ? 'Plastic, reconstructive, and aesthetic surgery' : 'Cirugía plástica, reconstructiva y estética'}</span></div></div>
        <p>{isEnglish ? 'Your transformation deserves an honest conversation, expert vision, and deeply human care.' : 'Tu transformación merece una conversación honesta, una visión experta y un cuidado profundamente humano.'}</p>
        <a className="footer-contact" href={WA} target="_blank" rel="noreferrer"><span>{isEnglish ? 'Schedule your assessment' : 'Agenda tu evaluación'}</span><ChatIcon /></a>
      </div>

      <div className="footer-columns">
        <nav className="footer-column" aria-label={isEnglish ? 'Explore' : 'Explorar'}>
          <p>{isEnglish ? 'Explore' : 'Explorar'}</p>
          <a href="#procedimientos">{isEnglish ? 'Procedures' : 'Procedimientos'}</a>
          <a href="#doctor">{isEnglish ? 'The doctor' : 'El doctor'}</a>
          <a href="/nosotros.html">{isEnglish ? 'Career' : 'Trayectoria'}</a>
        </nav>
        <div className="footer-column">
          <p>{isEnglish ? 'Contact' : 'Contacto'}</p>
          <a href="tel:+18299447001">+1 (829) 944-7001</a>
          <a href="mailto:info@rafaelrivera.do">info@rafaelrivera.do</a>
          <address>CECILIP<br/>Calle Wifredo García #5<br/>Santo Domingo 10510</address>
        </div>
        <div className="footer-column footer-social-column">
          <p>{isEnglish ? 'Follow us' : 'Síguenos'}</p>
          <div className="footer-social-links">
            <a href="https://www.instagram.com/dr.rafaelriverard" target="_blank" rel="noreferrer"><SocialIcon network="instagram"/><span>Instagram</span></a>
            <a href="https://www.tiktok.com/@dr.rafaelriverard" target="_blank" rel="noreferrer"><SocialIcon network="tiktok"/><span>TikTok</span></a>
            <a href="https://youtube.com/@drrafaelriverard" target="_blank" rel="noreferrer"><SocialIcon network="youtube"/><span>YouTube</span></a>
          </div>
        </div>
      </div>

      <div className="footer-note"><span>{isEnglish ? 'Responsible medical information' : 'Información médica responsable'}</span><p>{isEnglish ? 'Results vary for each patient. Every procedure requires an individual medical assessment and a clear conversation about benefits, alternatives, and risks.' : 'Los resultados varían según cada paciente. Todo procedimiento requiere una evaluación médica individual y una conversación clara sobre beneficios, alternativas y riesgos.'}</p></div>
      <div className="footer-bottom"><small>© {new Date().getFullYear()} Dr. Rafael Rivera. {isEnglish ? 'All rights reserved.' : 'Todos los derechos reservados.'}</small><div><a href="/contacto.html">{isEnglish ? 'Contact' : 'Contacto'}</a><button className="footer-language" onClick={() => setLanguage(isEnglish ? 'es' : 'en')}>{isEnglish ? 'Español' : 'English'}</button><a href="#inicio">{isEnglish ? 'Back to top ↑' : 'Volver arriba ↑'}</a></div></div>
    </footer>

  </main>
}

createRoot(document.getElementById('root')).render(<App />)
