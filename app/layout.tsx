import type { Metadata } from 'next';
import './globals.css';
import './play.css';
import './refinements.css';
export const metadata: Metadata = { title: {default:'Varun Puskur — Software, Design & Art',template:'%s · Varun Puskur'}, description:'Computer science student at Virginia Tech exploring software, AI and product design. Selected projects, experience and original graphite artwork by Varun Puskur.', icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
