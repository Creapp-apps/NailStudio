-- ==============================================================================
-- ATELIER NAILS & CO. - SUPABASE SEED DATA
-- ==============================================================================

-- 1. Services
INSERT INTO public.nail_services (id, title, category, base_price, base_duration_min, description, badge, image_url, recommended_for)
VALUES
('srv-kapping', 'Kapping Gel Fortalecedor (Manicura Rusa)', 'kapping', 18500, 75, 'Limpieza profunda de cutículas con torno y nivelación con gel Rubber sobre la uña natural para evitar quiebres y permitir que crezca fuerte.', 'Más Solicitado', 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80', 'Uñas frágiles, quebradizas o personas que buscan crecimiento natural sin extensiones.'),
('srv-semipermanente', 'Esmaltado Semipermanente Haute Gloss', 'semipermanente', 14000, 60, 'Manicura combinada y esmaltado de máxima duración con brillo espejo ultra resistente por 21 días.', NULL, 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80', 'Uñas de base sana que desean color impecable y prolijidad duradera.'),
('srv-softgel', 'Soft Gel Extensions (Press-On de Gel)', 'soft_gel', 22000, 90, 'Extensiones de tip de gel completo adheridas con base estructural. Ligeras, flexibles y con apariencia 100% natural.', 'Tendencia 2026', 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80', 'Largo instantáneo sin la rigidez del acrílico tradicional.'),
('srv-esculpidas', 'Esculpidas en Acrílico o Polygel', 'esculpidas', 26000, 110, 'Arquitectura artesanal con molde para corregir formas ungueales, lograr largos extremos o rescatar uñas mordidas (onicofagia).', NULL, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80', 'Estructuras largas, uñas con onicofagia severa o eventos de gala.')
ON CONFLICT (id) DO NOTHING;

-- 2. Removal Options
INSERT INTO public.removal_options (id, label, description, additional_price, additional_duration_min)
VALUES
('none', 'Uñas limpias (Sin retiro previo)', 'Mis uñas están totalmente al natural.', 0, 0),
('own_studio', 'Retiro de nuestro Atelier (Service habitual)', 'Tengo material colocado en Atelier Nails & Co.', 2500, 15),
('other_salon', 'Retiro de otro salón o producto desconocido', 'Requiere remoción cuidadosa para no dañar la lámina ungueal.', 4500, 30)
ON CONFLICT (id) DO NOTHING;

-- 3. Nail Art Tiers
INSERT INTO public.nail_art_tiers (id, tier_level, name, price, additional_duration_min, description, examples, sample_image)
VALUES
('art-0', 0, 'Nivel 0: Liso Minimal / Nude Chic', 0, 0, 'Color pleno, brillo espejo o acabado mate satinado en todas las uñas.', ARRAY['Esmaltado monocromo', 'Top Matte', 'Leche de coco'], 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=400&q=80'),
('art-1', 1, 'Nivel 1: Sutil & Clásico (+15 min)', 3000, 15, 'Detalles delicados en 2 a 4 uñas o francesita fina contemporánea.', ARRAY['Francesita clásica / micro-french', 'Glitter degradé', 'Foil dorado sutil', 'Línea orgánica minimal'], 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=400&q=80'),
('art-2', 2, 'Nivel 2: Efectos & Diseño Creativo (+30 min)', 6000, 30, 'Efectos en tendencia en todas las uñas o nail art a mano alzada en 4+ uñas.', ARRAY['Cromado Glazed Donut / Espejo', 'Ojo de Gato (Cat Eye magnético)', 'Efecto Mármol / Cuarzo', 'Flores a mano alzada'], 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=400&q=80'),
('art-3', 3, 'Nivel 3: Haute Couture / 3D & Charms (+45 min)', 9500, 45, 'Arte complejo full set: elementos en relieve 3D, pedrería Swarovski, encapsulados o diseño temático detallado.', ARRAY['Gemas y cristales 3D', 'Relieves de gel acrílico', 'Encapsulado de pan de oro y glitter', 'Arte ilustrado personalizado'], 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80')
ON CONFLICT (id) DO NOTHING;

-- 4. Technicians
INSERT INTO public.nail_technicians (id, name, role, avatar, specialties, rating, reviews_count, commission_rate)
VALUES
('tech-1', 'Sofía Valenzuela', 'Master Educator & Nail Artist', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', ARRAY['Soft Gel', 'Nail Art 3D', 'Cromados'], 4.98, 142, 0.55),
('tech-2', 'Valentina Rossi', 'Especialista en Manicura Rusa & Kapping', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80', ARRAY['Kapping Gel', 'Manicura Rusa', 'Recuperación de Uñas'], 4.95, 98, 0.50),
('tech-3', 'Camila Méndez', 'Senior Sculptor & Polygel Tech', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', ARRAY['Esculpidas Acrílico', 'Diseño Francés', 'Cat Eye'], 4.92, 87, 0.50)
ON CONFLICT (id) DO NOTHING;

-- 5. Clients
INSERT INTO public.client_profiles (id, name, phone, email, avatar, nail_plate_condition, allergies_hema, lamp_heat_sensitivity, favorite_colors, technician_notes, points_balance, tier, referral_code, total_visits, last_visit_date)
VALUES
('cli-1', 'Lucía Fernández', '+54 9 11 4522-8901', 'lucia.fernandez@gmail.com', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', 'thin_weak', false, 'medium', ARRAY['#E6C2BF (Nude Rose)', '#C4977E (Caramel)', '#FFFFFF (French White)'], 'Le gusta forma almendra corta. Suele tener levantamiento leve en índice derecho por uso de teclado. Recomendar base Rubber niveladora densa.', 1250, 'VIP Haute', 'LUCIA-NAILS', 8, '2026-09-08'),
('cli-2', 'Micaela Gómez', '+54 9 11 5821-3312', 'mica.gomez@hotmail.com', NULL, 'healthy', false, 'low', ARRAY['#1A1A1A (Vampy Black)', '#800020 (Burgundy Chic)'], 'Forma cuadrada recta perfecta. Prefiere colores oscuros invernales.', 600, 'Gold', 'MICA-GLAM', 4, '2026-09-12'),
('cli-3', 'Carolina Varela', '+54 9 11 3901-7744', 'caro.varela@outlook.com', NULL, 'onychophagy', true, 'high', ARRAY['#F3EBE1 (Milky Nude)', '#F5DFD5 (Soft Peach)'], '⚠️ ATENCIÓN: Alérgica al HEMA. Usar exclusivamente línea hipoalergénica HEMA-FREE. Gran sensibilidad al calor en cabina; curar en modo Low Heat.', 350, 'Silver', 'CARO-GLOW', 2, '2026-09-20')
ON CONFLICT (id) DO NOTHING;

-- 6. Appointments
INSERT INTO public.appointments (id, client_name, client_phone, client_email, tech_id, service_id, removal_id, nail_art_tier_id, total_duration_min, total_price, deposit_amount, deposit_paid, scheduled_date, scheduled_time, status, notes)
VALUES
('apt-101', 'Lucía Fernández', '+54 9 11 4522-8901', 'lucia.fernandez@gmail.com', 'tech-1', 'srv-kapping', 'own_studio', 'art-2', 120, 27000, 5000, true, '2026-09-28', '10:00', 'confirmed', 'Service de Kapping con nuevo diseño cromo perlado.'),
('apt-102', 'Micaela Gómez', '+54 9 11 5821-3312', 'mica.gomez@hotmail.com', 'tech-2', 'srv-semipermanente', 'none', 'art-1', 75, 17000, 5000, true, '2026-09-28', '11:30', 'in_progress', 'Micro french vino tinto.'),
('apt-103', 'Carolina Varela', '+54 9 11 3901-7744', 'caro.varela@outlook.com', 'tech-1', 'srv-kapping', 'none', 'art-0', 75, 18500, 5000, true, '2026-09-28', '15:00', 'confirmed', 'Recordar esmaltes HEMA-Free y modo baja temperatura.')
ON CONFLICT (id) DO NOTHING;

-- 7. Supplies
INSERT INTO public.supplies (id, name, category, current_stock, min_stock_alert, unit, brand)
VALUES
('sup-1', 'Base Rubber Niveladora Transparente (HEMA-Free)', 'geles_bases', 3, 5, 'Frascos 15ml', 'Kodi Professional'),
('sup-2', 'Top Coat No Wipe Ultra Gloss', 'geles_bases', 8, 4, 'Frascos 15ml', 'Victoria Vynn'),
('sup-3', 'Alcohol Isopropílico 99% / Sanitizante', 'quimicos', 2, 3, 'Litros', 'Atelier Labs'),
('sup-4', 'Polvo Acrílico Cover Peach 50g', 'acrilicos', 6, 2, 'Potes', 'Mia Secret'),
('sup-5', 'Limas Descartables Zebra 100/180', 'descartables', 24, 20, 'Unidades', 'OPI Pro'),
('sup-6', 'Fresas Diamante Flama (Manicura Rusa)', 'herramientas', 12, 6, 'Unidades', 'Staleks Pro')
ON CONFLICT (id) DO NOTHING;
