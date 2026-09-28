import React, { useRef, useState, useEffect } from 'react';
import { Lock, RotateCcw, ChevronLeft, ChevronRight, Share, Plus, ShieldCheck } from 'lucide-react';

interface Props {
  children?: React.ReactNode;
  iframeSrc?: string;
  iframeRef?: React.RefObject<HTMLIFrameElement>;
  url?: string;
  className?: string;
}

export const MacBookMockup: React.FC<Props> = ({
  children,
  iframeSrc,
  iframeRef,
  url = 'ateliernails.com',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(680);

  // Target desktop virtual resolution (1280 x 800 WXGA / MacBook Retina ratio)
  const DESKTOP_WIDTH = 1280;
  const DESKTOP_HEIGHT = 820;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Measure the inner screen bezel width
        const width = containerRef.current.clientWidth;
        if (width > 0) {
          setContainerWidth(width);
        }
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const scale = Math.min(1, Math.max(0.3, containerWidth / DESKTOP_WIDTH));
  const scaledHeight = DESKTOP_HEIGHT * scale;

  return (
    <div className={`relative mx-auto flex flex-col items-center select-none w-full max-w-[860px] ${className}`}>
      {/* 1. MacBook Display Lid (Tapa Superior) */}
      <div className="relative w-full rounded-t-[20px] bg-gradient-to-b from-[#2e2e36] via-[#1f1f26] to-[#121216] p-[9px] pb-0 shadow-[0_25px_65px_-15px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.12)] ring-1 ring-black/60">
        
        {/* Screen Display Bezel */}
        <div className="relative w-full overflow-hidden rounded-t-[14px] bg-[#0c0c0e] ring-1 ring-black flex flex-col">
          
          {/* Top Bezel with Camera Notch & Green Indicator */}
          <div className="relative z-50 flex h-6 w-full items-center justify-center bg-[#0c0c0e]">
            {/* Center FaceTime HD Camera Notch */}
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#18181f]/80 ring-1 ring-white/5">
              <div className="size-2 rounded-full bg-[#050508] ring-1 ring-zinc-700/80 flex items-center justify-center">
                <div className="size-0.5 rounded-full bg-blue-500/80" />
              </div>
              <div className="size-1 rounded-full bg-emerald-500/80 shadow-[0_0_4px_#10b981]" />
            </div>
          </div>

          {/* macOS Safari Browser Chrome Bar */}
          <div className="relative z-40 flex h-9 w-full items-center justify-between border-b border-black/10 bg-[#f6f6f6] dark:bg-[#1a1719] px-3.5 py-1 text-xs text-zinc-600 dark:text-zinc-300">
            {/* Window Controls (Traffic Lights) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-2xs hover:opacity-80 transition-opacity" />
                <span className="size-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-2xs hover:opacity-80 transition-opacity" />
                <span className="size-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-2xs hover:opacity-80 transition-opacity" />
              </div>
              
              {/* Navigation Arrows */}
              <div className="hidden sm:flex items-center gap-1 ml-2 text-zinc-400">
                <ChevronLeft className="size-3.5 opacity-40 cursor-not-allowed" />
                <ChevronRight className="size-3.5 opacity-40 cursor-not-allowed" />
              </div>
            </div>

            {/* Safari URL Capsule */}
            <div className="flex items-center justify-between gap-2 rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-[#262124] px-3 py-1 shadow-2xs text-[11px] max-w-[340px] w-full mx-2">
              <div className="flex items-center gap-1.5 truncate">
                <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] text-zinc-400">https://</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-100 truncate">{url}</span>
              </div>
              <button
                onClick={() => {
                  if (iframeRef?.current?.contentWindow) {
                    iframeRef.current.contentWindow.location.reload();
                  }
                }}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors p-0.5"
                title="Recargar vista previa"
              >
                <RotateCcw className="size-2.5" />
              </button>
            </div>

            {/* Viewport Info / Window Actions */}
            <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-mono">
              <span className="hidden md:inline px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">1280×820 Retina</span>
              <Share className="size-3 opacity-60 hover:opacity-100 cursor-pointer" />
            </div>
          </div>

          {/* Scaled Desktop Web Content Area */}
          <div
            ref={containerRef}
            className="relative w-full bg-[#FFF7FA] overflow-hidden"
            style={{ height: `${scaledHeight}px` }}
          >
            <div
              className="absolute top-0 left-0 origin-top-left"
              style={{
                width: `${DESKTOP_WIDTH}px`,
                height: `${DESKTOP_HEIGHT}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              {iframeSrc ? (
                <iframe
                  ref={iframeRef}
                  src={iframeSrc}
                  title="Vista Previa Escritorio MacBook"
                  className="w-full h-full border-none bg-[#FFF7FA]"
                />
              ) : (
                <div className="w-full h-full overflow-y-auto bg-[#FFF7FA]">
                  {children}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 2. MacBook Aluminum Base Deck (Chasis Inferior) */}
      <div className="relative w-[101.5%] h-3.5 rounded-b-[14px] bg-gradient-to-r from-[#2c2c34] via-[#3a3a44] to-[#2c2c34] border-t border-zinc-700/80 shadow-[0_12px_28px_rgba(0,0,0,0.45)] flex items-start justify-center">
        {/* Center Display Thumb Notch */}
        <div className="w-24 h-1.5 rounded-b-md bg-[#18181c] shadow-inner" />
      </div>

      {/* 3. Subtle Ambient Table Reflection Glow */}
      <div className="w-[88%] h-2.5 mx-auto bg-black/30 blur-md rounded-full -mt-0.5" />
    </div>
  );
};
