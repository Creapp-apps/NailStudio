import React, { useState, useEffect } from 'react';
import {
  Truck,
  Package,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Trash2,
  Calendar,
  Sparkles,
  Phone,
  ArrowRight,
  Filter
} from 'lucide-react';
import { SupplyItem, SupplierOrder, SupplierOrderItem } from '../../types/nailStudio';
import { storage } from '../../services/storage';

interface Props {
  supplies: SupplyItem[];
}

export const SupplierOrdersView: React.FC<Props> = ({ supplies }) => {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'shipped' | 'received'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Order Form State
  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<SupplierOrderItem[]>([
    { name: '', quantity: 1, unit: 'unidades', unitPrice: 0 }
  ]);

  // Load orders on mount and listen to storage updates
  useEffect(() => {
    const load = () => {
      setOrders(storage.getSupplierOrders());
    };
    load();
    const unsub = storage.subscribe(load);
    return unsub;
  }, []);

  // Low stock supplies from inventory
  const lowStockSupplies = supplies.filter(s => s.currentStock <= s.minStockAlert);

  // Quick suppliers presets
  const commonSuppliers = [
    { name: 'Distribuidora Cherimoya Pro', phone: '+54 9 11 4567-8901' },
    { name: 'Meliné Gel Polish Oficial', phone: '+54 9 11 5678-1234' },
    { name: 'Navina & Manicuría Express', phone: '+54 9 11 3456-7890' },
    { name: 'Insumos Nails Recoleta', phone: '+54 9 11 2345-6789' }
  ];

  // Quick refill order from low stock items
  const handleGenerateRefillOrder = () => {
    if (lowStockSupplies.length === 0) return;
    const refillItems: SupplierOrderItem[] = lowStockSupplies.map(s => ({
      supplyId: s.id,
      name: `${s.name} (${s.brand})`,
      quantity: Math.max(1, (s.minStockAlert * 2) - s.currentStock),
      unit: s.unit,
      unitPrice: 0
    }));

    setSupplierName(lowStockSupplies[0]?.brand ? `Distribuidor ${lowStockSupplies[0].brand}` : 'Distribuidora Central');
    setSupplierPhone('');
    setItems(refillItems);
    setNotes('Pedido generado automáticamente por alerta de stock crítico.');
    setIsCreateModalOpen(true);
  };

  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: 1, unit: 'unidades', unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof SupplierOrderItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSelectExistingSupply = (index: number, supplyId: string) => {
    const s = supplies.find(item => item.id === supplyId);
    if (!s) return;
    const updated = [...items];
    updated[index] = {
      supplyId: s.id,
      name: `${s.name} (${s.brand})`,
      quantity: Math.max(1, s.minStockAlert - s.currentStock || 1),
      unit: s.unit,
      unitPrice: updated[index].unitPrice || 0
    };
    setItems(updated);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice || 0)), 0);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName.trim()) {
      alert('Por favor ingresá el nombre del proveedor.');
      return;
    }
    const validItems = items.filter(it => it.name.trim().length > 0 && it.quantity > 0);
    if (validItems.length === 0) {
      alert('Agregá al menos un insumo al pedido.');
      return;
    }

    storage.createSupplierOrder({
      supplierName,
      supplierContact: supplierPhone,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDate: expectedDate || undefined,
      status: 'pending',
      items: validItems,
      totalAmount: calculateTotal(),
      notes
    });

    setIsCreateModalOpen(false);
    // Reset form
    setSupplierName('');
    setSupplierPhone('');
    setExpectedDate('');
    setNotes('');
    setItems([{ name: '', quantity: 1, unit: 'unidades', unitPrice: 0 }]);
  };

  const handleSendWhatsApp = (order: SupplierOrder) => {
    const itemsList = order.items
      .map((it, idx) => `  ${idx + 1}. *${it.name}*: ${it.quantity} ${it.unit}`)
      .join('\n');

    const message = `*PEDIDO DE REPOSICIÓN - ATELIER NAILS & CO.*\n` +
      `*Orden:* ${order.orderNumber}\n` +
      `*Fecha:* ${order.orderDate}\n\n` +
      `Hola! Te paso el pedido de insumos para el salón:\n\n` +
      `${itemsList}\n\n` +
      `${order.totalAmount > 0 ? `*Total estimado:* $${order.totalAmount.toLocaleString('es-AR')}\n` : ''}` +
      `${order.notes ? `*Observaciones:* ${order.notes}\n\n` : '\n'}` +
      `Por favor confirmame disponibilidad y fecha estimada de entrega. ¡Muchas gracias!`;

    const cleanPhone = (order.supplierContact || '').replace(/[^0-9]/g, '');
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner / Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-xs">
        <div>
          <h2 className="text-xl font-bold font-serif-glam text-foreground tracking-wide">
            Gestión de Pedidos & Reposición a Proveedores
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Generá órdenes de compra, coordiná envíos por WhatsApp y acreditá stock automáticamente al recibir.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lowStockSupplies.length > 0 && (
            <button
              onClick={handleGenerateRefillOrder}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-all cursor-pointer shadow-2xs"
            >
              <Sparkles className="size-4 text-amber-500" />
              <span>Reponer {lowStockSupplies.length} Faltante(s)</span>
            </button>
          )}

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-pink-600 to-rose-700 hover:from-pink-700 hover:to-rose-800 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Nuevo Pedido</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Pedidos en Curso</div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {orders.filter(o => o.status === 'pending' || o.status === 'shipped').length}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Esperando entrega de distribuidor</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
            <Truck className="size-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Insumos Críticos</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {lowStockSupplies.length}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {lowStockSupplies.length === 0 ? 'Inventario en niveles óptimos' : 'Por debajo del mínimo'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
            <AlertTriangle className="size-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Pedidos Recibidos</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {orders.filter(o => o.status === 'received').length}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Stock acreditado con éxito</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="size-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-1.5">
          <Filter className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Estado:</span>
          {(['all', 'pending', 'shipped', 'received'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filter === st
                  ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {st === 'all' && 'Todos los pedidos'}
              {st === 'pending' && 'Pendientes'}
              {st === 'shipped' && 'En Tránsito'}
              {st === 'received' && 'Recibidos'}
            </button>
          ))}
        </div>

        <div className="text-xs text-muted-foreground font-mono">
          {filteredOrders.length} orden(es)
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-card/60 border border-border/70">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <Package className="size-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">No hay pedidos registrados en esta sección</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
            Podés generar una orden de compra para reponer tus químicos, geles de estructura y descartables antes de que se agoten.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            {lowStockSupplies.length > 0 && (
              <button
                onClick={handleGenerateRefillOrder}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 cursor-pointer"
              >
                Reponer {lowStockSupplies.length} faltante(s)
              </button>
            )}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-pink-600 to-rose-700 hover:from-pink-700 hover:to-rose-800 cursor-pointer"
            >
              Crear Nuevo Pedido
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => {
            const isPending = order.status === 'pending';
            const isShipped = order.status === 'shipped';
            const isReceived = order.status === 'received';

            return (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all shadow-2xs space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                        {order.orderNumber}
                      </span>
                      <h4 className="text-sm font-bold text-foreground">{order.supplierName}</h4>
                      {order.supplierContact && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="size-3" /> {order.supplierContact}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" /> Emisión: {order.orderDate}
                      </span>
                      {order.expectedDate && (
                        <span>• Entrega estimada: {order.expectedDate}</span>
                      )}
                      {order.receivedAt && (
                        <span className="text-emerald-600 font-semibold">• Recibido: {order.receivedAt.split('T')[0]}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    {isPending && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex items-center gap-1">
                        <Clock className="size-3" /> Pendiente
                      </span>
                    )}
                    {isShipped && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 flex items-center gap-1">
                        <Truck className="size-3" /> En Tránsito
                      </span>
                    )}
                    {isReceived && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> Recibido en Salón
                      </span>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar la orden ${order.orderNumber}?`)) {
                          storage.deleteSupplierOrder(order.id);
                        }
                      }}
                      className="p-1.5 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      title="Eliminar pedido"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Items preview table */}
                <div className="rounded-xl border border-border/70 overflow-hidden bg-background/50">
                  <div className="grid grid-cols-12 gap-2 px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase bg-muted/30">
                    <div className="col-span-7">Insumo solicitado</div>
                    <div className="col-span-2 text-center">Cantidad</div>
                    <div className="col-span-3 text-right">Subtotal</div>
                  </div>
                  <div className="divide-y divide-border/40">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 px-3 py-2 text-xs items-center">
                        <div className="col-span-7 font-medium text-foreground truncate">
                          {it.name}
                        </div>
                        <div className="col-span-2 text-center text-muted-foreground">
                          {it.quantity} {it.unit}
                        </div>
                        <div className="col-span-3 text-right font-mono text-muted-foreground">
                          {it.unitPrice > 0 ? `$${(it.quantity * it.unitPrice).toLocaleString('es-AR')}` : '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                  {order.totalAmount > 0 && (
                    <div className="px-3 py-2 bg-muted/20 border-t border-border/40 flex justify-between text-xs font-bold">
                      <span>Total Orden</span>
                      <span className="text-primary font-mono">${order.totalAmount.toLocaleString('es-AR')}</span>
                    </div>
                  )}
                </div>

                {order.notes && (
                  <p className="text-[11px] text-muted-foreground italic bg-muted/20 px-3 py-1.5 rounded-lg border border-border/40">
                    Nota: {order.notes}
                  </p>
                )}

                {/* Bottom Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/50">
                  <button
                    onClick={() => handleSendWhatsApp(order)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/20 transition-colors cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    <span>Enviar Pedido por WhatsApp</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <button
                        onClick={() => storage.updateSupplierOrderStatus(order.id, 'shipped')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 transition-colors cursor-pointer"
                      >
                        Marcar en Tránsito
                      </button>
                    )}

                    {!isReceived ? (
                      <button
                        onClick={() => {
                          if (confirm(`¿Confirmar recepción de la orden ${order.orderNumber}? Esto acreditará automáticamente el stock al inventario.`)) {
                            storage.updateSupplierOrderStatus(order.id, 'received');
                          }
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
                      >
                        <CheckCircle2 className="size-3.5" />
                        <span>Recibir & Acreditar al Stock</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="size-3.5" /> Stock cargado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Crear Nuevo Pedido */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-card border border-border p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold font-serif-glam text-foreground">
                  Emitir Nueva Orden de Reposición
                </h3>
                <p className="text-xs text-muted-foreground">
                  Detallá los insumos a encargar a tu proveedor de confianza.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              {/* Supplier Selection / Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Proveedor / Distribuidor *</label>
                  <input
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="Ej. Distribuidora Cherimoya"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-1 focus:ring-primary"
                    required
                  />
                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {commonSuppliers.map(sup => (
                      <button
                        key={sup.name}
                        type="button"
                        onClick={() => {
                          setSupplierName(sup.name);
                          setSupplierPhone(sup.phone);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        + {sup.name.split(' ')[1] || sup.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">WhatsApp / Teléfono</label>
                  <input
                    type="text"
                    value={supplierPhone}
                    onChange={(e) => setSupplierPhone(e.target.value)}
                    placeholder="+54 9 11 ..."
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-1 focus:ring-primary"
                  />
                  <span className="text-[10px] text-muted-foreground">Para el envío directo de la orden por chat</span>
                </div>
              </div>

              {/* Items List Builder */}
              <div className="space-y-2 border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Insumos a Pedir ({items.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    <Plus className="size-3" /> Agregar otro insumo
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-muted/20 border border-border/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-muted-foreground">Ítem #{idx + 1}</span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-muted-foreground hover:text-red-500 text-xs cursor-pointer"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-12 gap-2">
                        {/* Select from existing inventory */}
                        {supplies.length > 0 && (
                          <div className="col-span-12">
                            <select
                              onChange={(e) => handleSelectExistingSupply(idx, e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-[11px] text-muted-foreground"
                            >
                              <option value="">Seleccionar insumo de tu catálogo (opcional)...</option>
                              {supplies.map(s => (
                                <option key={s.id} value={s.id}>
                                  {s.name} ({s.brand}) - Stock actual: {s.currentStock} {s.unit}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="col-span-6 sm:col-span-6">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                            placeholder="Nombre del insumo / producto *"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs"
                            required
                          />
                        </div>

                        <div className="col-span-3 sm:col-span-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                              placeholder="Cant."
                              className="w-16 px-2 py-1.5 rounded-lg bg-background border border-border text-xs text-center"
                              required
                            />
                            <select
                              value={item.unit}
                              onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                              className="w-full px-1.5 py-1.5 rounded-lg bg-background border border-border text-[11px]"
                            >
                              <option value="unidades">unid.</option>
                              <option value="ml">ml</option>
                              <option value="frascos">frascos</option>
                              <option value="paquetes">paquetes</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-span-3 sm:col-span-3">
                          <input
                            type="number"
                            min="0"
                            step="100"
                            value={item.unitPrice || ''}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                            placeholder="Precio unit. ($)"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs text-right"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Date & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border pt-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Fecha Estimada de Entrega</label>
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Observaciones / Dirección</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. Entregar en horario matutino en recepción"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs"
                  />
                </div>
              </div>

              {/* Total & Submit */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase font-bold">Total Estimado</div>
                  <div className="text-lg font-bold font-mono text-primary">
                    ${calculateTotal().toLocaleString('es-AR')}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-700 hover:from-pink-700 hover:to-rose-800 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Guardar & Emitir Pedido
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
