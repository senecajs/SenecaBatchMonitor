type BatchMonitorOptionsFull = {
    debug: boolean;
};
export type BatchMonitorOptions = Partial<BatchMonitorOptionsFull>;
declare function BatchMonitor(this: any, options: BatchMonitorOptionsFull): void;
export default BatchMonitor;
