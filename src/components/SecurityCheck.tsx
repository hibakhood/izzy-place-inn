import { useEffect, useRef, useState } from 'react';

declare global { interface Window { turnstile?: {render:(node:HTMLElement,options:Record<string,unknown>)=>string; remove:(id:string)=>void}; } }
let scriptPromise: Promise<void> | undefined;
function loadWidget() {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) scriptPromise = new Promise<void>((resolve,reject)=>{
    const script=document.createElement('script');
    script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async=true; script.onload=()=>resolve(); script.onerror=()=>{scriptPromise=undefined;reject(new Error('Unavailable'));}; document.head.append(script);
  });
  return scriptPromise;
}
export default function SecurityCheck({action,onVerify}:{action:'booking'|'contact';onVerify:(token:string)=>void}) {
  const node=useRef<HTMLDivElement>(null);
  const [failed,setFailed]=useState(false);
  const key=import.meta.env.VITE_TURNSTILE_SITE_KEY;
  useEffect(()=>{
    onVerify(''); if(!key) return;
    let cancelled=false; let widget:string|undefined;
    loadWidget().then(()=>{if(!cancelled&&node.current&&window.turnstile) widget=window.turnstile.render(node.current,{sitekey:key,action,size:'flexible',theme:'light',callback:(token:string)=>{setFailed(false);onVerify(token);},'expired-callback':()=>onVerify(''),'error-callback':()=>{onVerify('');setFailed(true);}});}).catch(()=>{if(!cancelled)setFailed(true);});
    return()=>{cancelled=true;if(widget&&window.turnstile)window.turnstile.remove(widget);};
  },[key,action,onVerify]);
  return <div className="my-4 max-w-full"><div ref={node}/>{(!key||failed)&&<p role="status" className="text-sm text-muted">Online requests are temporarily unavailable. Please call reception for help.</p>}</div>;
}
