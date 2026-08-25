import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './chat.css'
import './footer.css'
import './language.css'
import './mobile-overflow.css'
import './about.css'

const WA_MESSAGE = 'Hola Dr. Rivera, vengo desde su Web Page y quiero información sobre una consulta. / Hi Dr. Rivera, I am visiting from your website and would like information about a consultation.'
const WA = `https://api.whatsapp.com/send?phone=18299447001&text=${encodeURIComponent(WA_MESSAGE)}`
const Arrow = () => <span aria-hidden="true">↗</span>
const ChatIcon = () => <span className="whatsapp-chat-icon" aria-hidden="true"><i /></span>
const SocialIcon = ({ network }) => <span className={`social-icon social-icon-${network}`} aria-hidden="true" />

function Reveal({ children, from = 'up', className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    const enter = new IntersectionObserver(([entry]) => entry.isIntersecting && node?.classList.add('is-visible'), { threshold: .12, rootMargin: '0px 0px -6% 0px' })
    const exit = new IntersectionObserver(([entry]) => !entry.isIntersecting && node?.classList.remove('is-visible'), { rootMargin: '150px 0px' })
    if (node) { enter.observe(node); exit.observe(node) }
    return () => { enter.disconnect(); exit.disconnect() }
  }, [])
  return <div ref={ref} className={`reveal reveal-${from} ${className}`}>{children}</div>
}

const copy = {
  es: {
    back: 'Volver al inicio', kicker: 'CONOCE A TU CIRUJANO', title1: 'Ciencia, precisión.', title2: 'Cuidado humano.', intro: 'Una trayectoria construida sobre preparación constante, decisiones responsables y una relación honesta con cada paciente.',
    storyKicker: 'DR. RAFAEL RIVERA', storyTitle1: 'Una visión', storyTitle2: 'profundamente personal.',
    paragraphs: ['Estoy comprometido con ofrecer resultados naturales y armoniosos, priorizando siempre la seguridad y el bienestar de mis pacientes. Cada plan nace de una evaluación individual y de escuchar con atención.', 'Mi formación se mantiene en movimiento. He participado en encuentros médicos en México, Guatemala y Costa Rica, incorporando técnicas y avances que fortalecen una práctica segura y de alto estándar.', 'Mi filosofía se basa en la confianza y la comunicación clara. El objetivo no es transformar quién eres, sino acompañarte a sentirte mejor contigo misma sin perder tu esencia.'],
    principles: [['01', 'Preparación constante', 'Técnica, actualización médica y criterio aplicado a cada decisión.'], ['02', 'Honestidad clínica', 'Expectativas claras, alternativas reales y seguridad por encima de todo.'], ['03', 'Resultados con identidad', 'Armonía y proporción respetando aquello que te hace única.']],
    credentials: 'FORMACIÓN Y MEMBRESÍAS', media: 'CONVERSACIONES SOBRE CIRUGÍA', mediaTitle: 'Conoce su manera de', mediaEm: 'pensar y cuidar.', ready: 'CUANDO ESTÉS LISTA', cta: 'Tu próxima conversación puede empezar hoy.', contact: 'Iniciemos una conversación', footer: 'Tu transformación merece una conversación honesta, una visión experta y un cuidado profundamente humano.', home: 'Inicio', procedures: 'Procedimientos', doctor: 'Trayectoria', follow: 'Síguenos', rights: 'Todos los derechos reservados.'
  },
  en: {
    back: 'Back to home', kicker: 'MEET YOUR SURGEON', title1: 'Science, precision.', title2: 'Human care.', intro: 'A career built on continuous preparation, responsible decisions, and an honest relationship with every patient.',
    storyKicker: 'DR. RAFAEL RIVERA', storyTitle1: 'A deeply', storyTitle2: 'personal vision.',
    paragraphs: ['I am committed to natural, harmonious results while always prioritizing patient safety and well-being. Every plan begins with an individual assessment and careful listening.', 'My education is always evolving. I have participated in medical meetings in Mexico, Guatemala, and Costa Rica, incorporating techniques and advances that strengthen a safe, high-standard practice.', 'My philosophy is grounded in trust and clear communication. The goal is not to change who you are, but to help you feel better while preserving your essence.'],
    principles: [['01', 'Continuous preparation', 'Technique, medical education, and sound judgment behind every decision.'], ['02', 'Clinical honesty', 'Clear expectations, real alternatives, and safety above everything.'], ['03', 'Results with identity', 'Harmony and proportion that respect what makes you unique.']],
    credentials: 'EDUCATION AND MEMBERSHIPS', media: 'CONVERSATIONS ABOUT SURGERY', mediaTitle: 'Discover how he', mediaEm: 'thinks and cares.', ready: 'WHEN YOU ARE READY', cta: 'Your next conversation can begin today.', contact: 'Let’s start a conversation', footer: 'Your transformation deserves an honest conversation, expert vision, and deeply human care.', home: 'Home', procedures: 'Procedures', doctor: 'Career', follow: 'Follow us', rights: 'All rights reserved.'
  }
}

function About() {
  const [language, setLanguage] = useState(() => localStorage.getItem('rr-language') || 'es')
  const t = copy[language]
  const isEnglish = language === 'en'
  useEffect(() => {
    localStorage.setItem('rr-language', language)
    document.documentElement.lang = language
    document.title = isEnglish ? 'Dr. Rafael Rivera | Career' : 'Dr. Rafael Rivera | Trayectoria'
  }, [language, isEnglish])

  return <main className="about-page">
    <a className="about-back" href="/"><span>←</span>{t.back}</a>
    <div className="language-switch" role="group" aria-label={isEnglish ? 'Select language' : 'Seleccionar idioma'}><button className={!isEnglish ? 'active' : ''} onClick={() => setLanguage('es')}>ES</button><span>|</span><button className={isEnglish ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button></div>

    <section className="about-hero">
      <video autoPlay muted loop playsInline preload="metadata"><source src="/multimedia/aboutMe.mp4" type="video/mp4"/></video><div className="about-hero-shade"/>
      <div className="about-hero-copy"><Reveal><p className="kicker">{t.kicker}</p></Reveal><Reveal from="left"><h1>{t.title1}<br/><em>{t.title2}</em></h1></Reveal><Reveal><p>{t.intro}</p></Reveal></div>
    </section>

    <section className="about-story section-pad">
      <div className="about-portrait"><img src="/img/galeria/DoctorWallBlack.png" alt="Dr. Rafael Rivera"/></div>
      <div className="about-story-copy"><Reveal from="right"><p className="kicker">{t.storyKicker}</p><h2>{t.storyTitle1}<br/><em>{t.storyTitle2}</em></h2></Reveal>{t.paragraphs.map((paragraph) => <Reveal key={paragraph}><p>{paragraph}</p></Reveal>)}</div>
    </section>

    <section className="about-principles section-pad"><Reveal><p className="kicker">{isEnglish ? 'A WAY OF PRACTICING MEDICINE' : 'UNA FORMA DE EJERCER LA MEDICINA'}</p></Reveal><div>{t.principles.map(([n, title, text], index) => <Reveal key={n} from={index % 2 ? 'right' : 'left'}><article><span>{n}</span><h3>{title}</h3><p>{text}</p></article></Reveal>)}</div></section>

    <section className="about-credentials section-pad"><Reveal><p className="kicker">{t.credentials}</p></Reveal><div>{['file-transparent.png','cdcp.png','cmd.png','filacp.png','ISAPS-transparent.png'].map(file => <img key={file} src={`/img/instituciones/${file}`} alt="" loading="lazy"/>)}</div></section>

    <section className="about-media section-pad"><Reveal><p className="kicker">{t.media}</p><h2>{t.mediaTitle}<br/><em>{t.mediaEm}</em></h2></Reveal><div className="about-videos">{['O6WKKU2BP4w','6gmneIi80GE'].map(id => <Reveal key={id}><iframe src={`https://www.youtube.com/embed/${id}`} title="Dr. Rafael Rivera" loading="lazy" allowFullScreen/></Reveal>)}</div></section>

    <section className="about-cta section-pad"><Reveal from="left"><p className="kicker">{t.ready}</p><h2>{t.cta}</h2></Reveal><Reveal from="right"><a className="conversation-cta" href={WA} target="_blank" rel="noreferrer"><span>{t.contact}</span><ChatIcon/></a></Reveal></section>

    <footer className="site-footer about-footer"><div className="footer-lead"><div className="footer-identity"><img src="/img/logo.png" alt=""/><div><strong>Dr. Rafael Rivera</strong><span>Cirugía plástica, reconstructiva y estética</span></div></div><p>{t.footer}</p><a className="footer-contact" href={WA} target="_blank" rel="noreferrer"><span>{t.contact}</span><ChatIcon/></a></div><div className="footer-columns"><nav className="footer-column"><p>{isEnglish ? 'Explore' : 'Explorar'}</p><a href="/">{t.home}</a><a href="/#procedimientos">{t.procedures}</a><a href="/nosotros.html">{t.doctor}</a></nav><div className="footer-column"><p>{isEnglish ? 'Contact' : 'Contacto'}</p><a href="tel:+18299447001">+1 (829) 944-7001</a><a href="mailto:info@rafaelrivera.do">info@rafaelrivera.do</a><address>CECILIP<br/>Santo Domingo 10510</address></div><div className="footer-column footer-social-column"><p>{t.follow}</p><div className="footer-social-links"><a href="https://www.instagram.com/dr.rafaelriverard"><SocialIcon network="instagram"/><span>Instagram</span></a><a href="https://www.tiktok.com/@dr.rafaelriverard"><SocialIcon network="tiktok"/><span>TikTok</span></a><a href="https://youtube.com/@drrafaelriverard"><SocialIcon network="youtube"/><span>YouTube</span></a></div></div></div><div className="footer-bottom"><small>© {new Date().getFullYear()} Dr. Rafael Rivera. {t.rights}</small><div><a href="/">{t.home}</a><a href="#top">{isEnglish ? 'Back to top ↑' : 'Volver arriba ↑'}</a></div></div></footer>
  </main>
}

createRoot(document.getElementById('about-root')).render(<About/>)
