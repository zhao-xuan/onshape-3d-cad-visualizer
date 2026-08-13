'use client'; 
import React, { useState } from 'react';  

export interface CadComponentSimple { 
  id?: string;   
  name?: string; 
} 

export function ComponentListPanel({id,cadData}:{id:any;cadData:any}){  
 return <div className="p-4"><h2 className="text-base font-bold mb-3">{cadData?.name??'No assembly loaded'}</h2>    { cadData?.components.map((c:any)=>(<button key={String(c.id)}className={`px-3 py-2 rounded ${id === c.id ? 'bg-blue-600':''}`}onClick={()=> console.log('clicked',c.id)}>{c.name ?? 'Unnamed'}{c.partNumber? `(${c.partNumber})`:' '} </button>))}</div>; 
}

export function AssemblyViewerComponent({cadData,selectedId}:{cadData:any;selectedId:any}) {
 const selComp= cadData?.components.find((c:any)=> String(c.id)===String(selectedId));  
 return <><section className="p-4"><h3>Selected: {selComp?.name??'None'}</h3></section></>;    
}
