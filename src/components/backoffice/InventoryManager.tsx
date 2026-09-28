import React from 'react';
import { Package, AlertCircle, Plus, Minus, Check } from 'lucide-react';
import { SupplyItem } from '../../types/nailStudio';
import { storage } from '../../services/storage';

interface Props {
  supplies: SupplyItem[];
}

export const InventoryManager: React.FC<Props> = ({ supplies }) => {
  const handleUpdate = (id: string, current: number, delta: number) => {
    storage.updateSupplyStock(id, current + delta);
  };

  const lowStockCount = supplies.filter(s => s.currentStock <= s.minStockAlert).length;

  return (
    <div className="animate-fade-in">
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem',
        background: 'var(--bg-surface)',
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--brand-espresso)' }}>Control de Insumos Críticos de Manicuría</h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Supervisa químicos, geles de estructura y descartables para evitar paradas operativas
          </p>
        </div>

        {lowStockCount > 0 ? (
          <div style={{
            background: 'var(--status-alert-bg)',
            color: 'var(--status-alert)',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            <AlertCircle size={16} /> {lowStockCount} insumo(s) por debajo del stock mínimo
          </div>
        ) : (
          <div style={{
            background: 'var(--status-confirmed-bg)',
            color: 'var(--status-confirmed)',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            <Check size={16} /> Stock en niveles óptimos
          </div>
        )}
      </div>

      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
          padding: '0.85rem 1.25rem',
          background: 'var(--bg-card)',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>Insumo / Producto</div>
          <div>Categoría</div>
          <div>Marca</div>
          <div>Nivel de Stock</div>
          <div style={{ textAlign: 'center' }}>Acciones</div>
        </div>

        <div>
          {supplies.map((item) => {
            const isLow = item.currentStock <= item.minStockAlert;
            return (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
                  padding: '1rem 1.25rem',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: isLow ? '#FFFBF8' : 'transparent',
                  fontSize: '0.85rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--brand-espresso)' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alerta mínima: {item.minStockAlert} {item.unit}</div>
                </div>

                <div style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                  {item.category.replace('_', ' ')}
                </div>

                <div style={{ fontWeight: 600, color: 'var(--brand-terracotta)' }}>
                  {item.brand}
                </div>

                <div>
                  <span style={{
                    fontWeight: 800,
                    fontSize: '1rem',
                    color: isLow ? 'var(--status-alert)' : 'var(--status-confirmed)'
                  }}>
                    {item.currentStock}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.3rem' }}>
                    {item.unit}
                  </span>
                  {isLow && (
                    <span className="badge-luxury" style={{ display: 'block', background: 'var(--status-alert-bg)', color: 'var(--status-alert)', width: 'fit-content', marginTop: '0.2rem', fontSize: '0.65rem' }}>
                      Reponer Urgente
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => handleUpdate(item.id, item.currentStock, -1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-strong)',
                      background: 'var(--bg-surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={() => handleUpdate(item.id, item.currentStock, 1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-strong)',
                      background: 'var(--bg-surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
