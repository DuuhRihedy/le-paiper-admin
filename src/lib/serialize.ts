/**
 * Serializes Prisma Decimal fields to plain numbers for client components.
 * Prisma Decimal objects are not serializable by Next.js RSC.
 */

import type { Decimal } from "@prisma/client/runtime/library";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

/** Recursively replaces Prisma Decimal with number in a type */
type Serialized<T> = T extends Decimal
    ? number
    : T extends Date
        ? Date
        : T extends Array<infer U>
            ? Serialized<U>[]
            : T extends object
                ? { [K in keyof T]: Serialized<T[K]> }
                : T;

/**
 * Deep-converts all Prisma Decimal values to plain numbers.
 * Works on single objects, arrays, and nested objects.
 */
export function serialize<T>(data: T): Serialized<T> {
    if (data === null || data === undefined) return data as Serialized<T>;

    if (Array.isArray(data)) {
        return data.map((item) => serialize(item)) as Serialized<T>;
    }

    if (typeof data === "object" && data !== null) {
        // Check if it's a Prisma Decimal (has toNumber method)
        if ("toNumber" in data && typeof (data as AnyRecord).toNumber === "function") {
            return (data as AnyRecord).toNumber() as Serialized<T>;
        }

        // Check if it's a Date — pass through
        if (data instanceof Date) return data as Serialized<T>;

        // Recursively process plain objects
        const result: AnyRecord = {};
        for (const [key, value] of Object.entries(data as AnyRecord)) {
            result[key] = serialize(value);
        }
        return result as Serialized<T>;
    }

    return data as Serialized<T>;
}
