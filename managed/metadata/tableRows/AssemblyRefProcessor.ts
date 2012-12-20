/// <reference path="../TableStreamReader.ts" />
module pe.managed.metadata {
	// These records should not be emitted into any PE file.
	// However, if present in a PE file, they should be treated as-if their fields were zero.
	// They should be ignored by the CLI.
	// [ECMA-335 para22.7]
	export class AssemblyRefProcessor {
		processor: number;

		read(reader: TableStreamReader): void {
			this.processor = reader.readInt();
		}
	}
}