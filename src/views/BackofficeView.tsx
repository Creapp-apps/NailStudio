import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { Appointment, NailTechnician, ClientProfile, SupplyItem } from '../types/nailStudio';
import { AdminLayout } from '../components/backoffice/AdminLayout';

export const BackofficeView: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(storage.getAppointments());
  const [techs, setTechs] = useState<NailTechnician[]>(storage.getTechs());
  const [clients, setClients] = useState<ClientProfile[]>(storage.getClients());
  const [supplies, setSupplies] = useState<SupplyItem[]>(storage.getSupplies());

  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setAppointments(storage.getAppointments());
      setTechs(storage.getTechs());
      setClients(storage.getClients());
      setSupplies(storage.getSupplies());
    });
    return unsubscribe;
  }, []);

  return (
    <AdminLayout
      appointments={appointments}
      techs={techs}
      clients={clients}
      supplies={supplies}
    />
  );
};
