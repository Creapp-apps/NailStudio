import React, { useState } from 'react';
import { Package, AlertCircle, Plus, Minus, Check, Trash2, Sparkles } from 'lucide-react';
import { SupplyItem } from '../../types/nailStudio';
import { storage } from '../../services/storage';

interface Props {
  supplies: SupplyItem[];
}

export const InventoryManager: React.FC<Props> = ({ supplies }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SupplyItem['category']>('geles_bases');
  const [brand, setBrand] = useState('');
  const [currentStock, setCurrentStock] = useState(10);
  const [minStockAlert, setMinStockAlert] = useState(3);
  const [unit, setUnit] = useState('unidades');

  const handleUpdate = (id: string, current: number, delta: number) => {
    storage.updateSupplyStock(id, current + delta);
  };

  const handleDelete = (id: string, itemName: string) => {
    if (confirm(`¿Estás segura de eliminar "${itemName}" del inventario?`)) {
      storage.deleteSupply(id);
    }
  };

  const handleCreateSupply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    storage.addSupply({
      name: name.trim(),
      category,
      brand: brand.trim() || 'Genérico Pro',
      currentStock: Number(currentStock) || 0,
      minStockAlert: Number(minStockAlert) || 2,
      unit: unit || 'unidades'
    });

    setIsModalOpen(false);
    setName('');
    setBrand('');
    setCurrentStock(10);
    setMinStockAlert(3);
    setUnit('unidades');
  };

  // Seed standard salon supplies if empty
  const handleLoadEssentialSupplies = () => {
    const essentials: Omit<SupplyItem, 'id'>[] = [
      { name: 'Base Rubber Coat Pro', category: 'geles_bases', brand: 'Cherimoya', currentStock: 8, minStockAlert: 3, unit: 'frascos' },
      { name: 'Top Coat No Wipe Ultra Shine', category: 'geles_bases', brand: 'Meliné', currentStock: 12, minStockAlert: 4, unit: 'frascos' },
      { name: 'Primer Sin Ácido (Non-Acid)', category: 'quimicos', brand: 'Mia Secret', currentStock: 5, minStockAlert: 2, unit: 'frascos' },
      { name: 'Sanitizante / Alcohol al 70%', category: 'quimicos', brand: 'Atelier Labs', currentStock: 4, minStockAlert: 2, unit: 'litros' },
      { name: 'Polvo Acrílico Cover Pink 50g', category: 'acrilicos', brand: 'Mia Secret', currentStock: 6, minStockAlert: 2, unit: 'potes' },
      { name: 'Limas Profesionales 100/180', category: 'descartables', brand: 'Navina', currentStock: 25, minStockAlert: 10, unit: 'unidades' },
      { name: 'Wipes sin pelusa (Lint Free)', category: 'descartables', brand: 'Pro Nail', currentStock: 600, minStockAlert: 200, unit: 'unidades' }
    ];

    essentials.forEach(item => storage.addSupply(item));
  };

  const lowStockCount = supplies.filter(s => s.currentStock <= s.minStockAlert).length;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-xs">
        <div>
          <h2 className="text-xl font-bold font-serif-glam text-foreground tracking-wide">
            Control de Insumos Críticos & Stock de Geles
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Supervisá químicos, geles de estructura, esmaltes y descartables para evitar paradas operativas en mesas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lowStockCount > 0 ? (
            <div className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex items-center gap-1.5">
              <AlertCircle size={14} className="text-amber-500" />
              <span>{lowStockCount} insumo(s) por debajo del stock mínimo</span>
            </div>
          ) : (
            <div className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
              <Check size={14} className="text-emerald-500" />
              <span>Stock en niveles óptimos</span>
            </div>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-pink-600 to-rose-700 hover:from-pink-700 hover:to-rose-800 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Nuevo Insumo</span>
          </button>
        </div>
      </div>

      {/* Supplies Table or Empty State */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-2xs">
        <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase border-b border-border tracking-wider">
          <div className="col-span-4">Insumo / Producto</div>
          <div className="col-span-2">Categoría</div>
          <div className="col-span-2">Marca</div>
          <div className="col-span-2">Nivel de Stock</div>
          <div className="col-span-2 text-center">Acciones</div>
        </div>

        {supplies.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Package className="size-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground">No tenés insumos registrados en el inventario</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Podés registrar tus bases, tops, geles de construcción, limas y químicos para controlar el stock de tu salón.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleLoadEssentialSupplies}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
              >
                <Sparkles className="size-3.5" />
                <span>Cargar Insumos Esenciales de Salón</span>
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-pink-600 to-rose-700 hover:from-pink-700 hover:to-rose-800 transition-all shadow-sm cursor-pointer"
              >
                + Crear Insumo
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {supplies.map((item) => {
              const isLow = item.currentStock <= item.minStockAlert;
              return (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 gap-3 px-5 py-3.5 items-center text-xs transition-colors hover:bg-muted/20 ${
                    isLow ? 'bg-amber-500/5' : ''
                  }`}
                >
                  <div className="col-span-4">
                    <div className="font-bold text-foreground text-sm">{item.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Alerta mínima: <span className="font-semibold">{item.minStockAlert} {item.unit}</span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="capitalize px-2 py-0.5 rounded-full bg-muted text-[11px] font-medium text-foreground">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="col-span-2 font-semibold text-primary">
                    {item.brand}
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-base font-extrabold font-mono ${isLow ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {item.currentStock}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{item.unit}</span>
                    </div>
                    {isLow && (
                      <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-600 px-1.5 py-0.2 rounded bg-amber-500/10">
                        Reponer
                      </span>
                    )}
                  </div>

                  <div className="col-span-2 flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleUpdate(item.id, item.currentStock, -1)}
                      className="size-7 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
                      title="Disminuir unidad"
                    >
                      <Minus size={13} />
                    </button>
                    <button
                      onClick={() => handleUpdate(item.id, item.currentStock, 1)}
                      className="size-7 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
                      title="Aumentar unidad"
                    >
                      <Plus size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="size-7 ml-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-colors cursor-pointer"
                      title="Eliminar insumo"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Crear Insumo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold font-serif-glam text-foreground">
                Registrar Nuevo Insumo / Producto
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSupply} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Nombre del Insumo *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Gel de Construcción Clear"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs"
                  >
                    <option value="geles_bases">Geles & Bases</option>
                    <option value="quimicos">Químicos & Soluciones</option>
                    <option value="acrilicos">Acrílicos</option>
                    <option value="descartables">Descartables</option>
                    <option value="herramientas">Herramientas</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Marca</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ej. Cherimoya, Meliné"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Stock Inicial</label>
                  <input
                    type="number"
                    min="0"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Alerta Mín.</label>
                  <input
                    type="number"
                    min="1"
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Unidad</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl bg-background border border-border text-xs"
                  >
                    <option value="unidades">unidades</option>
                    <option value="frascos">frascos</option>
                    <option value="litros">litros</option>
                    <option value="potes">potes</option>
                    <option value="paquetes">paquetes</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-700 hover:from-pink-700 hover:to-rose-800 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Guardar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
