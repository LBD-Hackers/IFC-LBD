import { IfcState } from '../../BaseDefinitions';
export declare class Data {
    state: IfcState;
    isLoaded: boolean;
    workPlans: {
        [key: number]: any;
    };
    workSchedules: {
        [key: number]: any;
    };
    workCalendars: {
        [key: number]: any;
    };
    workTimes: {
        [key: number]: any;
    };
    recurrencePatterns: {
        [key: number]: any;
    };
    timePeriods: {
        [key: number]: any;
    };
    tasks: {
        [key: number]: any;
    };
    taskTimes: {
        [key: number]: any;
    };
    lagTimes: {
        [key: number]: any;
    };
    sequences: {
        [key: number]: any;
    };
    utils: any;
    constructor(state: IfcState);
    load(modelID: number): Promise<void>;
    loadWorkSchedules(modelID: number): Promise<void>;
    loadWorkScheduleRelatedObjects(modelID: number): Promise<void>;
    loadTasks(modelID: number): Promise<void>;
    loadTaskSequence(modelID: number): Promise<void>;
    loadTaskOutputs(modelID: number): Promise<void>;
    loadTaskNesting(modelID: number): Promise<void>;
    loadTaskOperations(modelID: number): Promise<void>;
    loadAssignementsWorkCalendar(modelID: number): Promise<void>;
    loadWorkCalendars(modelID: number): Promise<void>;
    loadWorkTimes(modelID: number): Promise<void>;
    loadTimePeriods(modelID: number): Promise<void>;
}
