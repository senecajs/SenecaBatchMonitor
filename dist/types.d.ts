type TableDef = {
    line: Record<string, any>;
    config: {
        start: number;
        field: {
            line: string;
        };
        line: {
            steps: Step[];
        };
    };
};
type Step = {
    field: string;
    default: Record<string, any>;
};
export type { TableDef, Step, };
