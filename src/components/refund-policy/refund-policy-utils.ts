import {
  RefundPolicyTarget as RefundPolicyEnum,
  RefundPolicyStatus,
} from '@/types';

export interface IRefundPolicyEnumerable {
  name: string;
  value: string;
}

export const RefundPolicyType: Array<IRefundPolicyEnumerable> = Object.keys(
  RefundPolicyEnum
).map((target: string) => ({
  name: target.toLocaleUpperCase(),
  value: target,
}));
export const RefundPolicyStatusType: Array<IRefundPolicyEnumerable> =
  Object.keys(RefundPolicyStatus).map((target: string) => ({
    name: target,
    value: target.toLocaleLowerCase(),
  }));
