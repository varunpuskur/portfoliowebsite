import type { Metadata } from 'next';
import { Header, Footer } from '@/components/site-shell';
import { WorkIndex } from '@/components/work-index';
import './work.css';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Explore Encryptron’s file workflow and the evolution of QuickCart, then read the full case studies.',
};

export default function Work() {
  return <><Header /><main id="main" className="wrap work-index">
    <div className="work-intro"><h1>Work</h1><p>A file-processing app and a grocery-shopping concept.<br />{' '}A closer look at how each came together.</p></div>
    <WorkIndex />
    <p className="work-next">More projects coming soon.</p>
  </main><Footer /></>;
}
