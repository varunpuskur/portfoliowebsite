'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const steps = [
  { id: 'file', name: 'Choose file', detail: 'Select a file to see its name, then continue. Reset clears the selection so you can choose another file.', code: 'File selection', note: 'The original interface separates file selection, passphrase entry, and submission.' },
  { id: 'passphrase', name: 'Passphrase', detail: 'The passphrase is hashed with SHA-256 to derive key material for a custom ten-round, Feistel-style cipher.', code: 'SHA-256 → custom cipher', note: 'The transformation works on 16-byte blocks. This is an educational experiment, not production cryptography.' },
  { id: 'download', name: 'Download', detail: 'Flask compresses and transforms the content in memory, records the file and its owner, then returns an .enc download.', code: 'BytesIO → send_file', note: 'Decryption checks the file record and user permissions. The cipher remains an educational experiment.' },
];

function FileWalkthrough() {
  const [step, setStep] = useState('file');
  const index = steps.findIndex(item => item.id === step);
  const current = steps[index];
  return <div className="file-walkthrough">
    <p className="preview-title">Explore the file workflow</p>
    <Tabs value={step} onValueChange={setStep} className="file-steps">
      <TabsList aria-label="File workflow" className="file-step-buttons" variant="line">
        {steps.map(item => <TabsTrigger value={item.id} key={item.id}>{item.name}</TabsTrigger>)}
      </TabsList>
      <div className="file-progress" aria-hidden="true"><span style={{ width: `${index * 50}%` }} /><i style={{ left: `${index * 50}%` }} /></div>
      {steps.map(item => <TabsContent value={item.id} key={item.id} className="file-step-content">
        <code>{item.code}</code><h3>{item.name}</h3><p>{item.detail}</p>
      </TabsContent>)}
    </Tabs>
    <p className="file-footnote">{current.note}</p>
  </div>;
}

function DesignComparison() {
  const [stage, setStage] = useState('wireframe');
  const revised = stage === 'prototype';
  return <div className="design-comparison">
    <div className="comparison-heading"><p className="preview-title">From wireframe to prototype</p>
      <ToggleGroup type="single" value={stage} onValueChange={value => value && setStage(value)} aria-label="QuickCart design stage" className="comparison-toggle">
        <ToggleGroupItem value="wireframe">Wireframe</ToggleGroupItem><ToggleGroupItem value="prototype">Prototype</ToggleGroupItem>
      </ToggleGroup>
    </div>
    <div className="comparison-stage"><figure className="comparison-figure" key={stage}>
      <div className="prototype-screen"><img src={revised ? '/images/qc-hifi.webp' : '/images/qc-lofi.webp'} width="705" height="1532" alt={revised ? 'QuickCart revised prototype with recent activity and bottom navigation' : 'QuickCart product-detail wireframe with an Add to Cart action and recommendations'} /></div>
      <figcaption>{revised ? 'Revised prototype' : 'Early wireframe'}</figcaption>
    </figure><p className="comparison-note" aria-live="polite">{revised ? 'The revised design adds recent activity and bottom navigation after usability feedback.' : 'The early product screen lays out item details, an Add to Cart action, and recommendations.'}</p></div>
  </div>;
}

export function WorkIndex() {
  const [project, setProject] = useState('encryptron');
  useEffect(() => {
    const sync = () => { const hash = window.location.hash.slice(1); if (hash === 'encryptron' || hash === 'quickcart') setProject(hash); };
    sync(); window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  return <Tabs value={project} onValueChange={value => { setProject(value); window.history.replaceState(null, '', '#' + value); }} className="project-index-tabs">
    <TabsList className="project-folders" aria-label="Choose a project">
      <TabsTrigger value="encryptron"><span>Encryptron</span><small>Software</small></TabsTrigger>
      <TabsTrigger value="quickcart"><span>QuickCart</span><small>UX design</small></TabsTrigger>
    </TabsList>
    <div className="project-folder-body">
    <TabsContent value="encryptron" className="project-folder-content">
      <div className="project-overview"><p className="project-stack">Python / Flask / SQLite</p><h2>Encryptron</h2><p>A file encryption prototype with a guided upload flow, user accounts, and sharing permissions.</p><p className="project-scope-note">From JavaScript form steps to in-memory processing and SQL access checks.</p><Link href="/work/encryptron" className="button button-dark">Read the case study</Link><a href="https://github.com/varunpuskur/securefileutility" className="text-link" target="_blank" rel="noreferrer">Source code <ArrowUpRight size={16} /></a></div>
      <FileWalkthrough />
    </TabsContent>
    <TabsContent value="quickcart" className="project-folder-content">
      <div className="project-overview"><p className="project-stack">Figma / Adobe XD</p><h2>QuickCart</h2><p>A grocery-shopping app concept for people short on time.</p><p className="project-scope-note">Research, wireframes, and usability feedback from my Google UX Design capstone.</p><Link href="/work/quickcart" className="button button-dark">Read the case study</Link><Link href="/work/quickcart#prototype" className="text-link">Watch the walkthrough</Link></div>
      <DesignComparison />
    </TabsContent>
    </div>
  </Tabs>;
}
