import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { Header, Footer } from '@/components/site-shell';
import { ArtGallery } from '@/components/art-gallery';
import './art.css';
export const metadata:Metadata={title:'Art — Graphite & Digital Works',description:'Explore original graphite portraits, wildlife, cars and digital art by Varun Puskur.'};
export default function Art(){return <><Header/><main className="wrap drawing-page" id="main"><section className="page-hero"><Link className="back-link" href="/"><ArrowLeft size={16}/> Back to home</Link><div className="gallery-intro"><div><h1>Drawings</h1></div><p>Portraits, wildlife, and things that catch my eye. Mostly graphite, with a few digital studies.</p></div></section><ArtGallery/></main><Footer/></>}
