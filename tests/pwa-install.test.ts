import { test } from "node:test";
import assert from "node:assert/strict";
import { shouldOfferInstall } from "../src/lib/pwa-install";

test("installation promotion requires a secure, uninstalled, undismissed visit", () => {
  assert.equal(shouldOfferInstall(true, false, false), true);
  assert.equal(shouldOfferInstall(false, false, false), false);
  assert.equal(shouldOfferInstall(true, true, false), false);
  assert.equal(shouldOfferInstall(true, false, true), false);
});

test('browser install event is deferred until a user action and installation hides the prompt', async () => {
  const names = ['window','navigator','sessionStorage'];
  const descriptors = names.map(name=>Object.getOwnPropertyDescriptor(globalThis,name));
  const values = new Map<string,string>();
  const display = Object.assign(new EventTarget(),{matches:false});
  const win = Object.assign(new EventTarget(),{isSecureContext:true,matchMedia:()=>display});
  let prompts=0;
  try {
    Object.defineProperty(globalThis,'window',{configurable:true,value:win});
    Object.defineProperty(globalThis,'navigator',{configurable:true,value:{userAgent:'Test browser',platform:'Test',maxTouchPoints:0}});
    Object.defineProperty(globalThis,'sessionStorage',{configurable:true,value:{getItem:(key:string)=>values.get(key)||null,setItem:(key:string,value:string)=>values.set(key,value)}});
    const module = await import(new URL('../src/lib/pwa-install.ts?browser-unit-test',import.meta.url).href);
    const store=module.installStore;
    assert.equal(store.getSnapshot().open,true);
    const event=Object.assign(new Event('beforeinstallprompt',{cancelable:true}),{prompt:async()=>{prompts++;},userChoice:Promise.resolve({outcome:'accepted'})});
    win.dispatchEvent(event);
    assert.equal(event.defaultPrevented,true);
    assert.equal(store.getSnapshot().native,true);
    assert.equal(prompts,0);
    await store.install();
    assert.equal(prompts,1);
    assert.equal(store.getSnapshot().installed,false);
    assert.equal(values.get('izzy-install-dismissed'),'1');
    win.dispatchEvent(new Event('appinstalled'));
    assert.equal(store.getSnapshot().installed,true);
    assert.equal(store.getSnapshot().open,false);
    assert.deepEqual([...values.keys()],['izzy-install-dismissed']);
  } finally {
    names.forEach((name,index)=>{const previous=descriptors[index];if(previous)Object.defineProperty(globalThis,name,previous);else Reflect.deleteProperty(globalThis,name);});
  }
});
