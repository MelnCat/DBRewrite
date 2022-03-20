export class IllegalStateError extends Error {
	override name = "IllegalStateError";
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}