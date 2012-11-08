/// <reference path="../IO/BinaryReader.ts" />
/// <reference path="../IO/IO.ts" />

/// <reference path="../PEFormat/PEFileReader.ts" />

/// <reference path="../ModuleDefinition.ts" />
/// <reference path="../TypeReference.ts" />

/// <reference path="ReadClrDirectory.ts" />
/// <reference path="ReadStreams.ts" />
/// <reference path="../Internal/FormatEnum.ts" />

/// <reference path="TableTypes.ts" />
/// <reference path="Tables/TableTypeDefinitions.ts" />

module Mi.PE.Cli {
    export class ReadTables {
        reserved0: number;
        version: Version;
        
        // byte
        heapSizes: number;

        reserved1: number;

        tables: any[][];

        constructor (_module: ModuleDefinition, streams: ReadStreams, reader: Mi.PE.IO.BinaryReader) {
            
            var tableStreamRange = new Mi.PE.PEFormat.DataDirectory(
                streams.tables.address,
                streams.tables.size);
            
            var tableReader = reader.readAtOffset(tableStreamRange.address);

            this.reserved0 = tableReader.readInt();

            // Note those are bytes, not shorts!
            _module.tableStreamVersion = new Version(tableReader.readByte(), tableReader.readByte());

            this.heapSizes = tableReader.readByte();
            this.reserved1 = tableReader.readByte();
            var valid = tableReader.readLong();
            var sorted = tableReader.readLong();

            this.tables = Array(TableTypes.length);

            this.initTableRowCounts(_module, tableReader, valid.lo, valid.hi);
            
            this.readTables(_module, streams, tableReader);
        }

        private initTableRowCounts(_module: ModuleDefinition, reader: Mi.PE.IO.BinaryReader, lo: number, hi: number) {
            var bits = lo;
            for (var tableIndex = 0; tableIndex < 32; tableIndex++) {
                if (bits & 1) {
                    var rowCount = reader.readInt();
                    this.initTable(tableIndex, rowCount, _module);
                }
                bits = bits >> 1;
            }

            bits = hi;
            for (var i = 0; i < 32; i++) {
                var tableIndex = i + 32;
                if (bits & 1) {
                    var rowCount = reader.readInt();
                    this.initTable(tableIndex, rowCount, _module);
                }
                bits = bits >> 1;
            }
        }

        private initTable(tableIndex: number, rowCount: number, _module: ModuleDefinition) {
            var tableRows = this.tables[tableIndex] = Array(rowCount);

            if (tableIndex == TableTypes.Module.index
                && tableRows.length>0) {
                tableRows[0] = _module;
            }

            if (TableTypes[tableIndex].ctor) {
                for (var i = 0; i < rowCount; i++) {
                    if (!tableRows[i])
                        tableRows[i] = new TableTypes[tableIndex].ctor();
                }
            }
        }

       private  readTables(_module: ModuleDefinition, streams: ReadStreams, reader: Mi.PE.IO.BinaryReader) {
            for (var tableIndex = 0; tableIndex < TableTypes.length; tableIndex++) {
                var tableRows = this.tables[tableIndex];

                if (!tableRows)
                    continue;

                var read = TableTypes[tableIndex].read;

                if (!read)
                    continue;

                var readResolutionScope = this.createCodedIndexReader(
                    TableTypes.Module,
                    TableTypes.ModuleRef,
                    TableTypes.AssemblyRef,
                    TableTypes.TypeRef);

                var readTypeDefOrRef = this.createCodedIndexReader(
                    TableTypes.TypeDef,
                    TableTypes.TypeRef,
                    TableTypes.TypeSpec);

                var cliReader = {
                    readString: () => streams.readString(reader),
                    readGuid: () => streams.readGuid(reader),
                    readResolutionScope: () => readResolutionScope(reader),
                    readTypeDefOrRef: () => readTypeDefOrRef(reader),
                    readTableRowIndex: (tableIndex) => this.readTableRowIndex(tableIndex, reader),
                    readBlob: () => {
                        if (streams.blobs.size>65535)
                            return reader.readInt();
                        else
                            return reader.readShort();
                    }
                };

                for (var i = 0; i < tableRows.length; i++) {
                    read(tableRows[i], reader, cliReader);
                }
            }
        }

        private createCodedIndexReader(...tableTypes: Tables.TableType[]): (reader: Mi.PE.IO.BinaryReader) => any {
            var maxTableLength = 0;
            for (var i = 0; i < tableTypes.length; i++)
            {
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

                while (bitMask != 0)
                {
                    result++;
                    bitMask >>= 1;
                }

                return result;
            }

            var tableKindBitCount = calcRequredBitCount(tableTypes.length - 1);
            var tableIndexBitCount = calcRequredBitCount(maxTableLength);

            var readResult: (reader: Mi.PE.IO.BinaryReader) => number;

            if (tableKindBitCount + tableIndexBitCount < 16)
                readResult = reader => reader.readShort();
            else
                readResult = reader => reader.readInt();

            return (reader: Mi.PE.IO.BinaryReader) => {
                var result = readResult(reader);

                var resultIndex = result >> tableKindBitCount;
                var resultTableIndex = result - (resultIndex << tableKindBitCount);

                var table = this.tables[tableTypes[resultTableIndex].index];

                if (resultIndex==0)
                    return null;

                resultIndex--;

                var row = table[resultIndex];
                return row;
            };
        }

        private readTableRowIndex(tableIndex: number, reader: Mi.PE.IO.BinaryReader) {
            var tableRows = this.tables[tableIndex];

            if (!tableRows)
                return 0;

            if (tableRows.length<65535)
                return reader.readShort();
            else
                return reader.readInt();
        }
    }
}