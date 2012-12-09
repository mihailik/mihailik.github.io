﻿/// <reference path="rowEnums.ts" />
/// <reference path="MetadataStreams.ts" />
/// <reference path="../../io/BinaryReader.ts" />
module pe.managed.metadata {
    export class TableStreamReader {
        private stringHeapCache: string[] = [];

        constructor(
            private baseReader: io.BinaryReader,
            private streams: metadata.MetadataStreams,
            private tables: any[][]) {

            this.readResolutionScope = this.createCodedIndexReader(
                TableKind.Module,
                TableKind.ModuleRef,
                TableKind.AssemblyRef,
                TableKind.TypeRef);

            this.readTypeDefOrRef = this.createCodedIndexReader(
                TableKind.TypeDef,
                TableKind.TypeRef,
                TableKind.TypeSpec);
        }

        readInt(): number { return this.baseReader.readInt(); }
        readShort(): number { return this.baseReader.readShort(); }

        readString(): string {
            var pos = this.readPos(this.streams.strings.size);

            var result: string;
            if (pos == 0) {
                result = null;
            }
            else {
                result = this.stringHeapCache[pos];

                if (!result) {
                    if (pos > this.streams.strings.size)
                        throw new Error("String heap position overflow.");

                    var utf8Reader = this.baseReader.readAtOffset(this.streams.strings.address + pos);
                    result = utf8Reader.readUtf8z(1024 * 1024 * 1024); // strings longer than 1GB? Not supported for a security excuse.

                    this.stringHeapCache[pos] = result;
                }
            }

            return result;
        }

        readGuid(): string {
            var index = this.readPos(this.streams.guids.length);

            if (index == 0)
                return null;
            else
                return this.streams.guids[(index - 1) / 16];
        }

        readBlob(): any {
            var index = this.readPos(this.streams.blobs.size);
            return index;
        }

        readResolutionScope: () => any;
        readTypeDefOrRef: () => any;

        readTableRowIndex(tableIndex: number): number {
            var tableRows = this.tables[tableIndex];

            if (!tableRows)
                return 0;

            return this.readPos(tableRows.length);
        }

        private createCodedIndexReader(...tableTypes: TableKind[]): () => { table: TableKind; index: number; } {
            var maxTableLength = 0;
            for (var i = 0; i < tableTypes.length; i++) {
                var tableType = tableTypes[i];
                if (!tableType)
                    continue;

                var tableRows = this.tables[i];

                if (!tableRows)
                    continue;

                maxTableLength = Math.max(maxTableLength, tableRows.length);
            }

            function calcRequredBitCount(maxValue) {
                var bitMask = maxValue;
                var result = 0;

                while (bitMask != 0) {
                    result++;
                    bitMask >>= 1;
                }

                return result;
            }

            var tableKindBitCount = calcRequredBitCount(tableTypes.length - 1);
            var tableIndexBitCount = calcRequredBitCount(maxTableLength);

            var readShortInt = tableKindBitCount + tableIndexBitCount < 16;

            return () => {
                var result = readShortInt ? this.baseReader.readShort() : this.baseReader.readInt();

                var resultIndex = result >> tableKindBitCount;
                var resultTableIndex = result - (resultIndex << tableKindBitCount);

                var table = this.tables[tableTypes[resultTableIndex]];

                if (resultIndex == 0)
                    return null;

                resultIndex--;

                var row = table[resultIndex];
                return row;
            };
        }

        private readPos(spaceSize: number): number {
            if (spaceSize < 65535)
                return this.baseReader.readShort();
            else
                return this.baseReader.readInt();
        }
    }
}