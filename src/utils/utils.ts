import { IllegalStateError } from "./error";

const notInitializedSymbol = Symbol("notInitialized");
export const notInitialized = <T>(identifier?: string) => {
	const err = () => {
		throw new IllegalStateError(`Value '${identifier}' was used before it was defined.`);
	};
	function val() {
		/* noop */
	}
	val.toString = () => `Uninitialized value '${identifier}'`;
	return new Proxy(val, {
		apply: err,
		construct: err,
		defineProperty: err,
		deleteProperty: err,
		get: (_, k) => k === notInitializedSymbol || err(),
		getOwnPropertyDescriptor: err,
		getPrototypeOf: err,
		has: err,
		isExtensible: err,
		ownKeys: err,
		preventExtensions: err,
		set: err,
		setPrototypeOf: err,
	}) as unknown as NonNullable<T>;
};

export const isNotInitialized = (v: unknown) =>
	(v as Record<typeof notInitializedSymbol, boolean | undefined>)[notInitializedSymbol] === true;
