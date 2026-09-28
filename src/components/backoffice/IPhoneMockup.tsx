import React, { useRef } from 'react';
import { Wifi, Battery, RotateCcw, Share, BookOpen, Layers, Lock } from 'lucide-react';

interface Props {
  children?: React.ReactNode;
  iframeSrc?: string;
  iframeRef?: React.RefObject<HTMLIFrameElement>;
  url?: string;
  className?: string;
}

export const IPhoneMockup: React.FC<Props> = ({
  children,
  iframeSrc,
  iframeRef,
  url = 'ateliernails.com',
  className = ''
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={`relative mx-auto flex flex-col items-center select-none ${className}`}>
      {/* Outer Titanium Phone Shell with Side Buttons */}
      <div className="relative">
        {/* Left Side Buttons (Action button + Volume Up & Down) */}
        <div className="absolute -left-[14px] top-[100px] h-7 w-[4px] rounded-l-md bg-zinc-700/80 shadow-xs" />
        <div className="absolute -left-[14px] top-[145px] h-12 w-[4px] rounded-l-md bg-zinc-700/80 shadow-xs" />
        <div className="absolute -left-[14px] top-[205px] h-12 w-[4px] rounded-l-md bg-zinc-700/80 shadow-xs" />

        {/* Right Side Button (Power / Siri Button) */}
        <div className="absolute -right-[14px] top-[160px] h-16 w-[4px] rounded-r-md bg-zinc-700/80 shadow-xs" />

        {/* Main Phone Body */}
        <div className="relative w-[375px] sm:w-[393px] h-[780px] rounded-[52px] bg-[#1c1c1e] p-[10px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-black/40">
          
          {/* Inner Metallic Bezel Ring */}
          <div className="relative h-full w-full overflow-hidden rounded-[42px] bg-black ring-1 ring-white/10 flex flex-col">
            
            {/* 1. iOS Status Bar & Dynamic Island */}
            <div className="relative z-50 flex h-11 w-full items-center justify-between px-7 pt-1.5 text-[13px] font-semibold text-zinc-900 bg-white/80 backdrop-blur-md border-b border-black/5">
              {/* iOS Time */}
              <span className="font-semibold tracking-tight text-xs text-zinc-900">9:41</span>

              {/* Dynamic Island Capsule */}
              <div className="absolute left-1/2 top-2 -translate-x-1/2 flex h-[28px] w-[115px] items-center justify-between rounded-full bg-black px-2.5 shadow-md">
                {/* Camera Lens */}
                <div className="size-2.5 rounded-full bg-[#111116] ring-1 ring-zinc-800/80" />
                {/* FaceID Sensor dot */}
                <div className="size-2 rounded-full bg-[#0a0a0f] opacity-80" />
              </div>

              {/* iOS Status Icons (Wifi, 5G, Battery) */}
              <div className="flex items-center gap-1.5 text-zinc-900">
                <span className="text-[10px] font-bold tracking-tighter">5G</span>
                <Wifi className="size-3 text-zinc-900" />
                <div className="flex items-center">
                  <div className="h-2.5 w-5 rounded-[3px] border border-zinc-900 p-0.5 flex items-center">
                    <div className="h-full w-full rounded-[1px] bg-zinc-900" />
                  </div>
                  <div className="h-1 w-0.5 rounded-r-xs bg-zinc-900 ml-0.5" />
                </div>
              </div>
            </div>

            {/* 2. Scrollable Viewport Content Area */}
            <div className="flex-1 overflow-hidden bg-transparent flex flex-col relative">
              {iframeSrc ? (
                <iframe
                  ref={iframeRef}
                  src={iframeSrc}
                  title="Vista Previa Móvil iPhone"
                  className="w-full h-full border-none bg-transparent"
                />
              ) : (
                <div
                  ref={scrollContainerRef}
                  className="flex-1 overflow-y-auto overflow-x-hidden bg-transparent scroll-smooth"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {children}
                </div>
              )}
            </div>

            {/* 3. iOS Safari Floating Address Bar & Home Indicator */}
            <div className="relative z-40 flex flex-col items-center border-t border-black/5 bg-white/90 px-4 pt-2 pb-1.5 backdrop-blur-md shadow-lg">
              {/* Safari URL Pill */}
              <div className="flex h-8 w-full items-center justify-between rounded-xl bg-black/5 px-3 text-[11px] text-zinc-700">
                <div className="flex items-center gap-1.5 truncate">
                  <Lock className="size-2.5 text-zinc-500" />
                  <span className="font-medium truncate">{url}</span>
                </div>
                <button
                  onClick={() => {
                    if (iframeRef?.current?.contentWindow) {
                      iframeRef.current.contentWindow.location.reload();
                    } else if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="p-1 text-zinc-500 hover:text-zinc-900 transition-colors"
                  title="Recargar vista previa"
                >
                  <RotateCcw className="size-3" />
                </button>
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="mt-2.5 h-1 w-32 rounded-full bg-zinc-900/60" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
