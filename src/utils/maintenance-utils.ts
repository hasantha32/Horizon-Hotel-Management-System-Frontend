import { Maintenance } from '@/types';
import Cookie from 'js-cookie';
import { MAINTENANCE_DETAILS } from './constants';

export function setMaintenanceDetails(isUnderMaintenance: boolean, maintenance: Maintenance | any) {
    Cookie.set(MAINTENANCE_DETAILS, JSON.stringify({ isUnderMaintenance, maintenance }));
}

export function getMaintenanceDetails(): {
    isUnderMaintenance: boolean | null;
    maintenance: Maintenance | null;
} {
    const maintenanceDetails = Cookie.get(MAINTENANCE_DETAILS);
    if (maintenanceDetails) {
        return JSON.parse(maintenanceDetails);
    }
    return { isUnderMaintenance: null, maintenance: null };
}