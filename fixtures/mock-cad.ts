export default function MockCadProvider() { 
  return{getAssembly:async()=>({id:'test',name:'Test Assembly'}),getAllAssemblies:async()=>[]};   
} 
