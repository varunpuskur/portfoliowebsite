import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Header, Footer } from '@/components/site-shell';
import { HeroArtwork } from '@/components/art-lens';
import { SketchPad } from '@/components/sketch-pad';
import { ProjectFlow } from '@/components/project-flow';

export default function Home() {
  return <>
    <Header />
    <main id="main">
      <section className="hero wrap" aria-labelledby="intro-title">
        <div className="hero-copy">
          <h1 id="intro-title">Varun<br />Puskur</h1>
          <p className="hero-role">Computer science at Virginia Tech</p>
          <p className="hero-description">I work with Python and SQL, and I’m learning more about backend development. I also draw, mostly portraits, wildlife, and cars.</p>
          <div className="hero-actions"><Link className="button button-dark" href="/work">Explore my work</Link><Link className="text-link" href="/resume">View résumé</Link></div>
          <div className="hero-note"><p>Open to software engineering internships for <strong>Summer 2027.</strong></p></div>
        </div>
        <HeroArtwork />
      </section>
      <div className="identity-strip wrap"><span>Python · C · SQL</span><span>Blacksburg, Virginia <span className="strip-cross">/</span> Class of 2028</span></div>
      <section id="work" className="section wrap">
        <div className="section-heading"><h2>Case studies</h2></div>
        <div className="selected-projects">
          <article className="software-project">
            <Link href="/work/encryptron" className="project-visual-link" aria-label="Read the Encryptron case study"><ProjectFlow /></Link>
            <div className="selected-project-copy"><p className="project-kind">Python, Flask, SQLite</p><Link href="/work/encryptron"><h3>Encryptron</h3></Link><p>A Flask project for uploading and processing files. I built sign-in, permission records, and a workflow that handles the uploaded content in memory.</p><div className="project-links"><Link className="text-link" href="/work/encryptron">Read the case study</Link><a className="text-link muted-link" href="https://github.com/varunpuskur/securefileutility" target="_blank" rel="noreferrer">Source code <ArrowUpRight size={16} /></a></div></div>
          </article>
          <article className="design-project">
            <Link href="/work/quickcart" className="quickcart-visual" aria-label="Read the QuickCart design case study"><span className="prototype-screen screen-first"><img src="/images/qc-lofi.webp" width="705" height="1532" alt="Detail from the original QuickCart wireframe" loading="lazy" /></span><span className="prototype-screen screen-second"><img src="/images/qc-hifi.webp" width="705" height="1532" alt="Detail from the original QuickCart grocery shopping prototype" loading="lazy" /></span><span className="prototype-visual-label">The wireframe and the next iteration</span></Link>
            <div className="selected-project-copy"><p className="project-kind">UX design capstone</p><Link href="/work/quickcart"><h3>QuickCart</h3></Link><p>A grocery-shopping prototype for people short on time. The case study follows the research, wireframes, and changes I made after usability feedback.</p><div className="project-links"><Link className="text-link" href="/work/quickcart">Read the case study</Link></div></div>
          </article>
        </div>
        <p className="more-studies">More projects coming soon.</p>
      </section>
      <section id="experience" className="section experience-section wrap">
        <div className="experience-intro"><h2>Experience</h2><Link href="/resume" className="text-link">Full résumé</Link></div>
        <div className="experience-list">
          <article className="experience-item"><h3>ValueLabs</h3><p className="experience-role">Data Analyst Intern</p><p>I wrote Python scripts and SQL queries to clean and process 15,000+ clinical trial records for oncology research. I also built Excel dashboards and Matplotlib visuals for the clinical research team.</p><p className="experience-detail">Worked with the Voiant Clinical data science team on ingestion and preparation for predictive modeling.</p></article>
          <article className="experience-item"><h3>Rava AI</h3><p className="experience-role">Product Development Intern</p><p>I researched competing products, including Speechify, comparing their target users, features, and pricing. I presented the findings in a case study and took part in product planning and business development discussions.</p></article>
        </div>
      </section>
      <SketchPad />
      <section id="about" className="section about-section wrap"><div><h2>A bit more<br />{' '}about me</h2></div><div className="about-copy"><p>I’m interested in backend software and AI. This semester, I’m working with C and RISC-V in Computer Organization II at Virginia Tech.</p><div className="education-line"><span>Virginia Tech</span><strong>B.S. Computer Science</strong><span>Expected May 2028</span></div></div></section>
    </main>
    <Footer />
  </>;
}
