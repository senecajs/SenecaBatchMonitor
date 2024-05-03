type BatchMonitorOptionsFull = {
    debug: boolean;
    kind: Record<string, any>;
};
export type BatchMonitorOptions = Partial<BatchMonitorOptionsFull>;
declare function BatchMonitor(this: any, options: BatchMonitorOptionsFull): void;
export default BatchMonitor;
