import { v5 as uuidv5 } from 'uuid';

export function contextBasedGuid(contextString: string) {
    const namespace = "daca0510-72b5-48ba-9091-b918ca18136b";
    return uuidv5(contextString, namespace);
}