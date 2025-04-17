export function generateStudentId(): string {
    const prefix = 'grade4';

    const timestamp = Date.now().toString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    return `${prefix}-${timestamp}-${randomSuffix}`;
}