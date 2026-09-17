'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArtLens } from '@/components/art-lens';

const artworks=[
 {id:'lion',name:'Lion',medium:'Graphite on paper',width:1000,height:1291,alt:'A lion on a rock surrounded by forest foliage, rendered in graphite'},
 {id:'porsche',name:'Porsche',medium:'Graphite on paper',width:1600,height:1076,alt:'A Porsche sports car on a winding mountain road, drawn in graphite'},
 {id:'senna',name:'Ayrton Senna',medium:'Graphite on paper',width:1024,height:782,alt:'Graphite portrait of Ayrton Senna wearing his racing helmet'},
 {id:'leopard',name:'Leopard',medium:'Graphite on paper',width:750,height:1034,alt:'Detailed graphite drawing of a leopard'},
 {id:'tom-cruise',name:'Tom Cruise',medium:'Graphite on paper',width:765,height:1135,alt:'Graphite portrait of Tom Cruise'},
 {id:'coco',name:'Coco',medium:'Graphite on paper',width:685,height:883,alt:'Coco, a long-haired dog drawn in graphite by Varun Puskur'},
 {id:'gandhi',name:'Mahatma Gandhi',medium:'Graphite on paper',width:1555,height:2000,alt:'Graphite portrait of Mahatma Gandhi'},
 {id:'sreeko',name:'Sreeko',medium:'Graphite on paper',width:750,height:1118,alt:'Sreeko, an original graphite drawing by Varun Puskur'},
 {id:'thathamma',name:'Thathamma',medium:'Graphite on paper',width:750,height:1019,alt:'Thathamma, an original graphite portrait by Varun Puskur'},
 {id:'eiffel-tower',name:'Eiffel Tower',medium:'Graphite on paper',width:750,height:987,alt:'Graphite drawing of the Eiffel Tower'},
 {id:'lola',name:'Lola',medium:'Graphite on paper',width:750,height:1068,alt:'Lola, an original graphite drawing by Varun Puskur'},
 {id:'digital-1',name:'Untitled · I',medium:'Digital',width:2000,height:1500,alt:'Untitled digital artwork by Varun Puskur, first study'},
 {id:'digital-2',name:'Untitled · II',medium:'Digital',width:750,height:563,alt:'Untitled digital artwork by Varun Puskur, second study'},
 {id:'digital-6',name:'Untitled · III',medium:'Digital',width:750,height:770,alt:'Untitled digital artwork by Varun Puskur, third study'},
 {id:'digital-5',name:'Untitled · IV',medium:'Digital',width:750,height:563,alt:'Untitled digital artwork by Varun Puskur, fourth study'}
];

export function ArtGallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const [lastViewed, setLastViewed] = useState(0);
  const opener = useRef<HTMLButtonElement | null>(null);
  const thumbnails = useRef<Array<HTMLButtonElement | null>>([]);
  const artwork = artworks[selected ?? lastViewed];
  const index = selected ?? lastViewed;

  function select(next: number) {
    setSelected(next);
    setLastViewed(next);
    // Keep the active thumbnail visible without moving focus away from the controls.
    const rail = thumbnails.current[next]?.parentElement;
    const thumbnail = thumbnails.current[next];
    if (rail && thumbnail) {
      rail.scrollTo({ left: thumbnail.offsetLeft - rail.clientWidth / 2 + thumbnail.clientWidth / 2, behavior: 'instant' });
    }
  }

  return <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
    <div className="drawing-gallery">
      {artworks.map((a, i) => <article className={'drawing-piece' + (i < 2 ? ' drawing-featured' : '')} id={a.id} key={a.id}>
        <button className="drawing-open" aria-label={'View ' + a.name + ', ' + a.medium + ' in full'}
          onClick={event => { opener.current = event.currentTarget; select(i); }}>
          <div className="drawing-mat">
            <img src={'/images/' + a.id + '.webp'} width={a.width} height={a.height} alt={a.alt} loading={i < 2 ? 'eager' : 'lazy'} />
            <span className="drawing-enlarge" aria-hidden="true"><Expand size={17} /><span>View drawing</span></span>
          </div>
          <div className="drawing-caption"><strong>{a.name}</strong><span>{a.medium}</span></div>
        </button>
      </article>)}
    </div>
    <DialogContent className="drawing-viewer" showCloseButton={false}
      onOpenAutoFocus={event => {
        // The selected thumbnail is a useful, stable keyboard starting point.
        event.preventDefault();
        thumbnails.current[index]?.focus({ preventScroll: true });
        thumbnails.current[index]?.scrollIntoView({ block: 'nearest', inline: 'center' });
      }}
      onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus({ preventScroll: true }); }}
      onKeyDown={event => {
        if (event.defaultPrevented || (event.target as HTMLElement).closest('[data-art-magnifier]')) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + artworks.length) % artworks.length;
          select(next);
          if ((event.target as HTMLElement).closest('.drawing-thumbnail')) {
            thumbnails.current[next]?.focus({ preventScroll: true });
          }
        }
      }}>
      <div className="drawing-viewer-header">
        <div><DialogTitle>{artwork.name}</DialogTitle><DialogDescription>{artwork.medium}</DialogDescription></div>
        <DialogClose className="drawing-close" aria-label="Close drawing viewer"><X size={20} /></DialogClose>
      </div>
      <div className="drawing-viewer-stage" key={artwork.id}>
        <ArtLens src={'/images/' + artwork.id + '.webp'} alt={artwork.alt} width={artwork.width} height={artwork.height} medium={artwork.medium} priority inViewer />
      </div>
      <div className="drawing-viewer-navigation">
        <button type="button" onClick={() => select((index - 1 + artworks.length) % artworks.length)} aria-label="Previous drawing"><ArrowLeft size={18} /><span>Previous</span></button>
        <p role="status" aria-live="polite" aria-atomic="true"><span className="sr-only">{artwork.name}. Drawing </span>{String(index + 1).padStart(2, '0')}<span className="drawing-count-divider"> / </span>{artworks.length}</p>
        <button type="button" onClick={() => select((index + 1) % artworks.length)} aria-label="Next drawing"><span>Next</span><ArrowRight size={18} /></button>
      </div>
      <div className="drawing-thumbnails" role="group" aria-label="Choose a drawing">
        {artworks.map((a, i) => <button key={a.id} ref={el => { thumbnails.current[i] = el; }} className="drawing-thumbnail" type="button" aria-label={'Show ' + a.name} aria-pressed={i === index} onClick={() => select(i)}>
          <img src={'/images/' + a.id + '.webp'} alt="" width={a.width} height={a.height} loading="lazy" />
        </button>)}
      </div>
    </DialogContent>
  </Dialog>;
}
