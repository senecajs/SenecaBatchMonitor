import type { StepDef } from './types';
type BatchMonitorOptionsFull = {
    debug: boolean;
    kind: Record<string, {
        field: string;
        steps: StepDef[];
    }>;
};
export type BatchMonitorOptions = Partial<BatchMonitorOptionsFull>;
declare function BatchMonitor(this: any, _options: BatchMonitorOptionsFull): void;
export default BatchMonitor;
