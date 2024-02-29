export class AspNetValidationProblem {
    errors: { [key: string]: string[]; } | undefined;
    title: string | undefined;
    status: number | undefined;
    traceId: string | undefined;
    type: string | undefined;
    instance: string | undefined;
}