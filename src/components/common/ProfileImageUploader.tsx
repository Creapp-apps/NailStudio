import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UploadCloud, Camera, ZoomIn, ZoomOut, Check, X, RotateCcw } from 'lucide-react';

interface ProfileImageUploaderProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
}

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  value,
  onChange,
  label = 'Foto de Perfil'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [calibratingImage, setCalibratingImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen (PNG, JPG o WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setCalibratingImage(dataUrl);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPanning(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Crop & Export via HTML5 Canvas
  const handleApplyCrop = () => {
    if (!imageRef.current) return;
    const canvas = document.createElement('canvas');
    const size = 360; // 360x360 high quality avatar
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const img = imageRef.current;
    const viewSize = 260; // Size of circular viewport in the modal

    // Compute aspect ratio and scaled dimensions inside viewport
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let baseWidth = viewSize;
    let baseHeight = viewSize;

    if (imgAspect > 1) {
      baseWidth = viewSize * imgAspect;
    } else {
      baseHeight = viewSize / imgAspect;
    }

    const currentWidth = baseWidth * zoom;
    const currentHeight = baseHeight * zoom;

    // Viewport center
    const vpCenterX = viewSize / 2;
    const vpCenterY = viewSize / 2;

    // Image center relative to viewport
    const imgCenterX = vpCenterX + offset.x;
    const imgCenterY = vpCenterY + offset.y;

    // Image top-left relative to viewport
    const imgX = imgCenterX - currentWidth / 2;
    const imgY = imgCenterY - currentHeight / 2;

    // Scale to canvas coordinates
    const scaleFactor = size / viewSize;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    ctx.drawImage(
      img,
      imgX * scaleFactor,
      imgY * scaleFactor,
      currentWidth * scaleFactor,
      currentHeight * scaleFactor
    );

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onChange(croppedDataUrl);
    setCalibratingImage(null);
  };

  return (
    <div style={{ width: '100%' }}>
      <label style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        color: 'var(--brand-espresso)',
        display: 'block',
        marginBottom: '0.35rem'
      }}>
        {label}
      </label>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Dropzone & Preview Box */}
      {value ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '14px',
            border: '1.5px solid rgba(222, 115, 143, 0.35)',
            background: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(222, 115, 143, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
            <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
              <img
                src={value}
                alt="Avatar"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--brand-pink-dark)'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'var(--brand-pink-dark)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Camera size={9} />
              </div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-espresso)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>Foto calibrada</span>
                <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(66, 122, 91, 0.1)', color: '#2F5740', fontWeight: 700 }}>1:1 Lista</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Encuadre circular aplicado correctamente
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                background: 'rgba(222, 115, 143, 0.12)',
                border: 'none',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--brand-pink-dark)',
                cursor: 'pointer'
              }}
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              style={{
                padding: '0.35rem 0.6rem',
                borderRadius: '8px',
                background: 'transparent',
                border: '1px solid rgba(0,0,0,0.12)',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: isDragging
              ? '2px dashed var(--brand-pink-dark)'
              : '1.5px dashed rgba(222, 115, 143, 0.4)',
            borderRadius: '14px',
            padding: '0.85rem 1.15rem',
            background: isDragging
              ? 'rgba(222, 115, 143, 0.08)'
              : '#FAF6F8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(222, 115, 143, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-pink-dark)',
              flexShrink: 0
            }}>
              <UploadCloud size={22} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-espresso)' }}>
                Arrastra una foto o haz clic para subir
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Abre el calibrador de encuadre estilo Instagram (PNG, JPG o WebP)
              </div>
            </div>
          </div>

          <span style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '8px',
            background: '#FFFFFF',
            border: '1px solid rgba(222, 115, 143, 0.25)',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--brand-pink-dark)',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}>
            Explorar
          </span>
        </div>
      )}

      {/* Instagram-Style Image Calibrator Modal */}
      {calibratingImage && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            background: 'rgba(15, 8, 12, 0.88)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setCalibratingImage(null);
          }}
        >
          <div
            style={{
              background: '#1A1215',
              borderRadius: '20px',
              border: '1px solid rgba(222, 115, 143, 0.3)',
              width: '100%',
              maxWidth: '380px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              color: '#FFFFFF'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '0.85rem 1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                  Calibrar Foto de Perfil
                </h4>
                <span style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                  Arrastra y ajusta el zoom al estilo Instagram
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCalibratingImage(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Viewfinder Window (Circular Instagram Mask) */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '300px',
                background: '#0D0709',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
                overflow: 'hidden'
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Draggable Image */}
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                style={{
                  position: 'absolute',
                  cursor: isPanning ? 'grabbing' : 'grab',
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isPanning ? 'none' : 'transform 0.05s linear'
                }}
              >
                <img
                  ref={imageRef}
                  src={calibratingImage}
                  alt="Calibrating"
                  style={{
                    maxWidth: 'none',
                    maxHeight: 'none',
                    width: '260px',
                    height: 'auto',
                    display: 'block',
                    pointerEvents: 'none'
                  }}
                  draggable={false}
                />
              </div>

              {/* Viewport Dark Mask with Cutout Circle */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  boxShadow: '0 0 0 9999px rgba(10, 4, 7, 0.72)',
                  borderRadius: '50%',
                  width: '240px',
                  height: '240px',
                  margin: 'auto',
                  border: '2px solid rgba(222, 115, 143, 0.75)'
                }}
              />

              {/* Grid Guide Lines */}
              <div
                style={{
                  position: 'absolute',
                  width: '240px',
                  height: '240px',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  border: '1px dashed rgba(255, 255, 255, 0.25)'
                }}
              />
            </div>

            {/* Zoom Slider & Actions */}
            <div style={{ padding: '1rem 1.25rem', background: '#160E12' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <ZoomOut size={16} color="rgba(255, 255, 255, 0.5)" />
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    accentColor: 'var(--brand-pink-dark)',
                    cursor: 'pointer'
                  }}
                />
                <ZoomIn size={16} color="rgba(255, 255, 255, 0.5)" />
                <button
                  type="button"
                  title="Restablecer encuadre"
                  onClick={() => {
                    setZoom(1);
                    setOffset({ x: 0, y: 0 });
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    padding: '4px 6px',
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={13} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setCalibratingImage(null)}
                  style={{
                    flex: 1,
                    padding: '0.55rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'transparent',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleApplyCrop}
                  style={{
                    flex: 1.4,
                    padding: '0.55rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--brand-pink-satin, #DE738F) 0%, var(--brand-pink-dark, #C45774) 100%)',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 14px rgba(222, 115, 143, 0.35)'
                  }}
                >
                  <Check size={14} strokeWidth={2.5} />
                  <span>Aplicar Encuadre</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
