// <reference path="../TableStreamReader.ts" />
module pe.managed.metadata {
	//[ECMA-335 §22.32]
	export class NestedClass {
		//An index into the TableKind.TypeDef table.
		nestedClass: number;

		//An index into the TableKind.TypeDef table.
		enclosingClass: number;

		read(reader: TableStreamBinaryReader): void {
			this.nestedClass = reader.readTableRowIndex(TableKind.TypeDef);
			this.enclosingClass = reader.readTableRowIndex(TableKind.TypeDef);
		}
	}
}