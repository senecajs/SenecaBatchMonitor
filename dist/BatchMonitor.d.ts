import type { Step } from './types';
type BatchMonitorOptionsFull = {
    debug: boolean;
    kind: Record<string, {
        field: string;
        steps: Step[];
    }>;
};
export type BatchMonitorOptions = Partial<BatchMonitorOptionsFull>;
declare function BatchMonitor(this: any, _options: BatchMonitorOptionsFull): void;
export default BatchMonitor;
