import { api } from './client';
import type { Drug, Disease } from '@shared/types';

export function getDrugs(): Promise<Drug[]> {
  return api.get<Drug[]>('/content/drugs');
}

export function getDiseases(): Promise<Disease[]> {
  return api.get<Disease[]>('/content/diseases');
}

/* ======================================================
   Phase 3A — Clinical Calculator datasets
   Each maps to a GET /api/content/:type endpoint backed
   by the corresponding data/seed/*.json file.
   ====================================================== */

// ---- fluid-maint ----
export interface FluidMaintEntry {
  maint: number;
  shock: number;
  notes: string;
}
/** Keys are species slugs e.g. 'dog', 'cat', 'rabbit' … */
export type FluidMaintMap = Record<string, FluidMaintEntry>;

export function getFluidMaint(): Promise<FluidMaintMap> {
  return api.get<FluidMaintMap>('/content/fluid-maint');
}

// ---- bsa-k ----
/** Keys are species slugs, values are the K constant. */
export type BsaKMap = Record<string, number>;

export function getBsaK(): Promise<BsaKMap> {
  return api.get<BsaKMap>('/content/bsa-k');
}

// ---- bsa-drug-info ----
export interface BsaDrugEntry {
  name: string;
  lo: number;
  hi: number;
  unit: string;
  note: string;
  isKg?: boolean | undefined;
}
/** Keys are drug slugs e.g. 'vincristine', 'cyclophos' … */
export type BsaDrugInfoMap = Record<string, BsaDrugEntry>;

export function getBsaDrugInfo(): Promise<BsaDrugInfoMap> {
  return api.get<BsaDrugInfoMap>('/content/bsa-drug-info');
}

// ---- flk-conc ----
/** Stock concentrations (mg/ml) for FLK CRI components. */
export interface FlkConc {
  /** Fentanyl stock concentration mg/ml */
  f: number;
  /** Lidocaine stock concentration mg/ml */
  l: number;
  /** Ketamine stock concentration mg/ml */
  k: number;
}

export function getFlkConc(): Promise<FlkConc> {
  return api.get<FlkConc>('/content/flk-conc');
}

// ---- nebulization ----
export interface NebulizationFormula {
  drug: string;
  dose: string;
  class: string;
  use: string;
}

export function getNebulization(): Promise<NebulizationFormula[]> {
  return api.get<NebulizationFormula[]>('/content/nebulization');
}
