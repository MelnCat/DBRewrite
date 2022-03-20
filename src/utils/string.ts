import type { L, A, N, S } from "ts-toolbelt";

export const capitalize = <T extends string>(str: T) => (str[0].toUpperCase() + str.slice(1)) as Capitalize<T>;

export type Formattable<T extends number = 1> = `${string}${S.Join<L.Repeat<"{}", T>, string>}${string}`;

export const format = <T extends string>(
	str: T,
	...arr: A.Equals<T, string> extends 0 ? L.Repeat<string, N.Sub<S.Split<T, "{}">["length"], 1>> : string[]
): string => str.split("{}").reduce((l, c, i, a) => l + c + (i + 1 === a.length ? "" : arr[i] ?? "{}"), "");
