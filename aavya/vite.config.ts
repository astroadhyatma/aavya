import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig(() => ({plugins:[react(),tailwindcss(),VitePWA({registerType:'autoUpdate',includeAssets:['icon.svg'],manifest:{id:'/',name:'AAVYA Mental Wellbeing Platform',short_name:'AAVYA',description:'Enterprise-grade mental wellbeing and personal growth platform for schools and colleges.',theme_color:'#1E3F32',background_color:'#FAFAF7',display:'standalone',start_url:'/',scope:'/',icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any maskable'}]},devOptions:{enabled:true}})],resolve:{alias:{'@':path.resolve(__dirname,'.')}},server:{hmr:process.env.DISABLE_HMR!=='true',watch:process.env.DISABLE_HMR==='true'?null:{}}}));
