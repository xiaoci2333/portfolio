import React, { useEffect, useRef, useState } from 'react';
import { projects, roles, skills, workflow } from './data.js';
import VideoHero from './VideoHero.jsx';
import useMotion from './useMotion.js';

const filters = [ ['all', '全部作品'], ['amazon', '亚马逊产品视觉'], ['video', '产品短视频'], ['social', 'TikTok / 社媒'] ];

function Artwork({ image, ...props }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [image.src]);
  if (failed) return <span className="image-fallback" role="img" aria-label={image.alt}>画面暂时无法显示<span>欢迎联系我查看作品</span></span>;
  return <img src={image.src} alt={image.alt} decoding="async" onError={() => setFailed(true)} {...props} />;
}

function SectionHeading({ number, title, note }) {
  return <div className="section-heading"><div><span className="section-index">{number}</span><h2>{title}</h2></div>{note && <p>{note}</p>}</div>;
}

function Gallery({ project, onClose }) {
  const dialog = useRef(null);
  const [index, setIndex] = useState(0);
  const images = project.images;
  const move = (step) => setIndex(i => (i + step + images.length) % images.length);

  useEffect(() => {
    const element = dialog.current;
    const previous = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; if (element.open) element.close(); };
  }, []);

  return <dialog ref={dialog} className={`gallery ${project.coverLayout === 'amazon' ? 'gallery-amazon' : ''}`} aria-labelledby="gallery-title" onCancel={onClose} onClick={e => {
    if (e.target !== dialog.current) return;
    const rect = dialog.current.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) onClose();
  }} onKeyDown={e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
  }}>
    <div className="gallery-header"><div><span className="eyebrow">{project.categoryLabel}</span><h2 id="gallery-title">{project.coverLayout === 'amazon' ? '耳夹式耳机 · 六图展示' : project.title}</h2></div><button className="close-button" onClick={onClose} aria-label="关闭作品预览">关闭 ×</button></div>
    <div className="gallery-stage"><Artwork image={images[index]} /></div>
    <div className="gallery-footer"><div><p>{images[index].alt}</p>{images[index].note && <p className="gallery-note">{images[index].note}</p>}</div>{images.length > 1 && <div className="gallery-controls"><button onClick={() => move(-1)} aria-label="上一张">←</button><span aria-live="polite">{index + 1} / {images.length}</span><button onClick={() => move(1)} aria-label="下一张">→</button></div>}</div>
    {project.coverLayout === 'amazon' && <div className="gallery-thumbnails" role="group" aria-label="选择商品图">{images.map((image, i) => <button key={image.src} aria-label={`查看第${i+1}张：${image.alt}`} aria-pressed={i === index} className={i === index ? 'selected' : ''} onClick={() => setIndex(i)}><img src={image.src} alt="" /><span>0{i+1}</span></button>)}</div>}
  </dialog>;
}

function ProjectCard({ project, index, onOpen }) {
  return <article className="project-card">
    <button className={`project-image ${project.coverLayout === 'amazon' ? 'amazon-cover' : project.images.length > 1 ? 'contact-sheet' : ''}`} onClick={() => onOpen(project)} aria-label={`查看${project.title}作品画面`}>
      <span className="project-pictures">{(project.coverLayout === 'amazon' ? project.images.slice(0, 3) : project.images).map(image => <Artwork key={image.src} image={image} loading="lazy" />)}</span>
      <span className="image-label">{project.categoryLabel}</span><span className="image-action">{project.coverLayout === 'amazon' ? '查看完整 6 张图 ↗' : '查看画面 ↗'}</span>
    </button>
    <div className="project-heading"><h3><button onClick={() => onOpen(project)}>{project.title}</button></h3><span>{String(index + 1).padStart(2, '0')}</span></div>
    <p className="project-subtitle">{project.subtitle}</p>
    <p className="project-description">{project.description}</p>
    <ul className="tags">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
  </article>;
}

export default function App() {
  const [filter, setFilter] = useState('all');
  useMotion(filter);
  const [selectedProject, setSelectedProject] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  const visibleProjects = projects.filter(p => filter === 'all' || p.category === filter);
  const selectedButton = useRef(null);
  function openProject(project) { selectedButton.current = document.activeElement; setSelectedProject(project); }
  function closeProject() { setSelectedProject(null); requestAnimationFrame(() => selectedButton.current?.focus()); }
  async function copyWechat() {
    try { await navigator.clipboard.writeText('18218738079'); setCopyStatus('微信号已复制：18218738079'); }
    catch { setCopyStatus('请选中复制微信号：18218738079'); }
  }

  return <>
    <a className="skip-link" href="#works">跳到作品</a>
    <header className="site-header"><nav className="container navigation" aria-label="主导航">
      <a className="brand" href="#top"><span className="brand-mark">YZ<span aria-hidden="true">+</span></span><span className="brand-name">姚振扬<span>视觉设计 / AI影像</span></span></a>
      <div className="nav-links"><a href="#about">关于我</a><a href="#roles">我的能力</a><a href="#works">作品案例</a><a className="nav-contact" href="#contact">联系我 <span aria-hidden="true">↗</span></a></div>
    </nav></header>

    <main id="top">
      <VideoHero />

      <section id="about" className="section container">
        <SectionHeading number="01 / 关于我" title="会用AI，也懂画面背后的内容。" />
        <div className="about-layout"><p className="about-intro">我参与过<strong>6部海外AI短剧</strong>及配套社媒内容制作，负责剪辑、节奏、字幕、配音与成片包装。现在，我把这份经验用在跨境电商视觉中，从脚本策划到产品精修、视频交付，把创意落到具体画面。</p><div className="skills-grid">{skills.map((skill, i) => <div className="skill" key={skill.title}><span className="small-number">0{i+1}</span><h3>{skill.title}</h3><p>{skill.text}</p></div>)}</div></div>
      </section>

      <section id="roles" className="section container"><SectionHeading number="02 / 我能做什么" title="围绕产品，完成不同形式的表达。" /><div className="roles-grid">{roles.map((role, i) => <article className="role-card" key={role.title}><span className="role-number">0{i + 1}</span><h3>{role.title}</h3><p>{role.text}</p></article>)}</div></section>

      <section id="works" className="section container"><SectionHeading number="03 / 作品案例" title="精选作品" note="产品图、品牌短片与海外社媒内容。" /><div className="works-toolbar"><div className="filters" role="group" aria-label="作品分类">{filters.map(([value, label]) => <button className={filter === value ? 'active' : ''} key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div><span className="works-count" aria-live="polite">{String(visibleProjects.length).padStart(2, '0')} 个作品</span></div><div className="projects-grid">{visibleProjects.map(project => <ProjectCard key={project.id} project={project} index={projects.indexOf(project)} onOpen={openProject} />)}</div></section>

      <section id="workflow" className="section container"><SectionHeading number="04 / 工作流程" title="从一个想法，到一次完整交付。" /><div className="workflow-grid">{workflow.map((step, i) => <article key={step.title}><span className="step-number">0{i+1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>

      <section id="contact" className="contact-section container"><div><span className="section-index">05 / 联系我</span><h2>聊聊下一份<br /><em>值得投入的工作。</em></h2><p>求职方向：亚马逊美工、AI视频制作、海外社媒内容与跨境品牌视觉。</p></div><div className="contact-details"><a href="mailto:1994970272@qq.com"><span>邮箱</span><strong>1994970272@qq.com</strong><span aria-hidden="true">↗</span></a><a href="tel:18218738079"><span>电话</span><strong>182 1873 8079</strong><span aria-hidden="true">↗</span></a><button onClick={copyWechat}><span>微信</span><strong>18218738079</strong><span className="copy-label">复制</span></button><p className="copy-status" role="status">{copyStatus}</p></div></section>
    </main>
    <footer className="container footer"><span>© 2026 姚振扬 · 个人作品集</span><a href="#top">回到顶部 ↑</a></footer>
    {selectedProject && <Gallery key={selectedProject.id} project={selectedProject} onClose={closeProject} />}
  </>;
}
