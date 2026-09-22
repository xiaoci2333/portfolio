import React, { useEffect, useRef, useState } from 'react';

const base = import.meta.env.BASE_URL;

export default function VideoHero() {
  const section = useRef(null);
  const videos = useRef([]);
  const activeVideo = useRef(0);
  const [visibleVideo, setVisibleVideo] = useState(0);
  const [enabled, setEnabled] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setEnabled(!preference.matches);
    preference.addEventListener('change', change);
    return () => preference.removeEventListener('change', change);
  }, []);

  useEffect(() => {
    let inView = true;
    let fading = false;
    let disposed = false;
    let fadeTimer;
    // Keep the mounted elements for cleanup; React clears callback refs first.
    const players = [...videos.current];

    const stop = () => {
      clearTimeout(fadeTimer);
      fading = false;
      players.forEach(video => video.pause());
    };
    const resume = () => {
      if (!enabled || failed || !inView || document.hidden) { stop(); return; }
      players[activeVideo.current].play().catch(() => {
        if (!disposed) setEnabled(false);
      });
    };
    const crossfade = async (event) => {
      const current = players[activeVideo.current];
      if (event.target !== current || fading || current.paused || !Number.isFinite(current.duration)) return;
      if (current.duration - current.currentTime > 1.2) return;
      fading = true;
      const nextIndex = 1 - activeVideo.current;
      const next = players[nextIndex];
      next.currentTime = 0;
      try {
        await next.play();
        if (disposed || !enabled || !inView || document.hidden) { next.pause(); fading = false; return; }
        activeVideo.current = nextIndex;
        setVisibleVideo(nextIndex);
        fadeTimer = setTimeout(() => { current.pause(); current.currentTime = 0; fading = false; }, 900);
      } catch {
        // The current video's native loop remains available if the next decoder is unavailable.
        fading = false;
      }
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; resume(); }, { threshold: 0 });
    observer.observe(section.current);
    players.forEach(video => video.addEventListener('timeupdate', crossfade));
    document.addEventListener('visibilitychange', resume);
    resume();
    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', resume);
      players.forEach(video => video.removeEventListener('timeupdate', crossfade));
    };
  }, [enabled, failed]);

  return <section ref={section} className={`hero ${enabled ? '' : 'motion-paused'}`} aria-labelledby="hero-title">
    <div className="hero-media" aria-hidden="true">
      <img className="hero-poster" src={`${base}images/earbuds-video.webp`} alt="" fetchPriority="high" />
      {[0, 1].map(index => <video
        key={index}
        ref={element => { videos.current[index] = element; }}
        className={`hero-video ${visibleVideo === index && !failed ? 'is-visible' : ''}`}
        src={`${base}videos/earbuds-film.mp4`}
        poster={`${base}images/earbuds-video.webp`}
        preload={index === 0 ? 'auto' : 'metadata'}
        muted loop playsInline disablePictureInPicture tabIndex={-1}
        onError={() => { setFailed(true); setEnabled(false); }}
      />)}
    </div>
    <div className="hero-shade" aria-hidden="true" />
    <div className="fluid-atmosphere" aria-hidden="true"><i /><i /><i /><div className="fluid-ring" /></div>
    <div className="hero-layout container">
      <div className="hero-topline"><span>个人作品集 / 2026</span><span>视觉设计 · AI影像 · 海外内容</span></div>
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-rule" />姚振扬 · 跨境电商视觉设计师</p>
        <h1 id="hero-title">让产品出彩。<br /><em>让内容被记住。</em></h1>
        <div className="hero-intro"><p className="hero-description">从一张产品图，到一支品牌短片。<br />用AI与设计，完成面向海外市场的视觉内容。</p><a href="#works" className="button button-primary">探索我的作品 <span aria-hidden="true">↗</span></a></div>
      </div>
      <div className="hero-bottom">
        <div className="hero-stats"><div><strong>6<span>部</span></strong><p>海外AI短剧制作</p></div><div><strong>$14<span>万+</span></strong><p>参与作品累计营收</p></div><div><strong>30<span>%</span></strong><p>制作周期缩短</p></div></div>
        <div className="film-info"><div><span className="film-kicker">正在展示 / 产品短片</span><p>耳夹式蓝牙耳机</p></div><button className="film-toggle" onClick={() => setEnabled(value => !value)} disabled={failed} aria-label={enabled ? '暂停背景视频' : '播放背景视频'} aria-pressed={enabled}><span aria-hidden="true">{enabled ? 'Ⅱ' : '▷'}</span><span>{failed ? '静态封面' : enabled ? '暂停' : '播放'}</span></button></div>
      </div>
    </div>
  </section>;
}
