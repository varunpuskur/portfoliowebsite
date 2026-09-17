import Link from 'next/link';
import type { Metadata } from 'next';
import { Download } from 'lucide-react';
import { Header, Footer, PrintButton } from '@/components/site-shell';
export const metadata: Metadata = { title: 'Résumé', description: 'Varun Puskur — Virginia Tech computer science, ValueLabs, Rava AI, and selected software projects.' };
export default function Resume() {
  return <><Header /><main id="main" className="wrap"><article className="resume-sheet">
    <div className="resume-top"><div className="resume-title"><h1>Varun Puskur</h1><p>Houston, TX · (346) 971-9272</p><p className="resume-contact"><a href="mailto:puskurvarun@gmail.com">puskurvarun@gmail.com</a><a href="https://www.linkedin.com/in/varunpuskur/">LinkedIn</a><a href="https://github.com/varunpuskur">GitHub</a><Link href="/">Portfolio</Link></p></div><div className="resume-actions no-print"><a className="button button-dark" href="/Varun_Puskur_Resume.pdf" download><Download size={16} /> Download PDF</a><PrintButton /></div></div>
    <section className="resume-section"><h2>EDUCATION</h2><div className="resume-entry-heading"><h3>Virginia Tech · B.S. Computer Science</h3><span>Expected May 2028</span></div><p>Coursework: Data Structures (CS 2114), Computer Organization I (CS 2505), Problem Solving (CS 2104). In progress: Computer Organization II (CS 2506).</p></section>
    <section className="resume-section"><h2>TECHNICAL SKILLS</h2><p><strong>Languages:</strong> Python, C, SQL, HTML/CSS</p><p><strong>Libraries &amp; frameworks:</strong> Flask, Pandas, NumPy, Matplotlib</p><p><strong>Tools:</strong> Git, SQLite, Linux, Jupyter Notebook, Excel</p></section>
    <section className="resume-section"><h2>EXPERIENCE</h2>
      <div className="resume-entry"><div className="resume-entry-heading"><h3>ValueLabs · Data Analyst Intern</h3><span>Jun-Aug 2024</span></div><div className="resume-subline">Hyderabad, India</div><ul><li>Developed Python scripts and SQL queries to clean and process 15,000+ clinical trial records for post-radiotherapy oncology research.</li><li>Created Excel dashboards and Matplotlib visualizations to summarize treatment trends for the clinical research team.</li><li>Collaborated with the Voiant Clinical data science team on ingestion and preparation for predictive modeling.</li></ul></div>
      <div className="resume-entry"><div className="resume-entry-heading"><h3>Rava AI · Product Development Intern</h3><span>Spring 2024</span></div><div className="resume-subline">Hyderabad, India</div><ul><li>Prepared a Speechify case-study presentation analyzing target users, accessibility features, product offering, and subscription plans.</li><li>Participated in startup meetings and followed the founder’s workflow across product planning and business development.</li></ul></div>
      <div className="resume-entry"><h3>Handshake AI · Fellowship</h3><ul><li>Evaluate AI assistant responses for accuracy, completeness, and instruction following; document the reasoning behind quality assessments.</li></ul></div>
    </section>
    <section className="resume-section"><h2>PROJECTS</h2>
      <div className="resume-entry"><h3>Encryptron · File Processing Web App</h3><div className="resume-subline">Python · Flask · SQLite · <a href="https://github.com/varunpuskur/securefileutility">Source code</a></div><ul><li>Built a Flask learning project with file upload/download flows, in-memory processing, and ZIP compression.</li><li>Implemented user authentication with salted password hashing and SQLite-backed file metadata and permission records.</li></ul></div>
      <div className="resume-entry"><h3>Original Personal Portfolio Website</h3><div className="resume-subline">HTML · CSS · AWS Amplify · Route 53 · <a href="https://varunpuskur.com/">Original website</a></div><ul><li>Built a responsive portfolio, deployed it on AWS Amplify, and configured a custom domain through Route 53.</li></ul></div>
    </section>
    <section className="resume-section"><h2>LEADERSHIP</h2><h3>Ignite Hackathon · Event Coordinator</h3><div className="resume-subline">Sreenidhi International School</div><ul><li>Coordinated a team of 40 to organize the school’s first 36-hour hackathon for 250+ participants and 20+ submitted projects.</li><li>Raised $4,500 in sponsorships and partnerships to fund event costs and prizes.</li></ul></section>
  </article></main><Footer /></>;
}
