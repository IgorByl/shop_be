export type Property<T, U extends keyof T> = T[U];
export type AnyObject = Record<string, unknown>;
