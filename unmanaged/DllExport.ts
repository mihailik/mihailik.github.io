/// <reference path="../pe.ts" />

module pe.unmanaged {
    export class DllExport {
        name: string;
        ordinal: number;

        // The address of the exported symbol when loaded into memory, relative to the image base.
        // For example, the address of an exported function.
        exportRva: number;

        // Null-terminated ASCII string in the export section.
        // This string must be within the range that is given by the export table data directory entry.
        // This string gives the DLL name and the name of the export (for example, "MYDLL.expfunc")
        // or the DLL name and the ordinal number of the export (for example, "MYDLL.#27").
        forwarder: string;

        static readExports(reader: pe.io.BinaryReader, range: io.AddressRange): DllExports {
            var result: DllExports = <any>[];

            result.flags = reader.readInt();
            if (!result.timestamp)
                result.timestamp = new Date(0);

            reader.readTimestamp(result.timestamp);
            
            var majorVersion = reader.readShort();
            var minorVersion = reader.readShort();
            result.version = majorVersion + "." + minorVersion;

            // need to read string from that RVA later
            var nameRva = reader.readInt();
                
            result.ordinalBase = reader.readInt();

            // The number of entries in the export address table.
            var addressTableEntries = reader.readInt();

            // The number of entries in the name pointer table. This is also the number of entries in the ordinal table.
            var numberOfNamePointers = reader.readInt();

            // The address of the export address table, relative to the image base.
            var exportAddressTableRva = reader.readInt();

            // The address of the export name pointer table, relative to the image base.
            // The table size is given by the Number of Name Pointers field.
            var namePointerRva = reader.readInt();

            // The address of the ordinal table, relative to the image base.
            var ordinalTableRva = reader.readInt();

            if (nameRva == 0)
                result.dllName = null;
            else
                result.dllName = reader.readAtOffset(nameRva).readAsciiZ();

            result.length = addressTableEntries;

            for (var i = 0; i < addressTableEntries; i++) {
                var exportEntry = new DllExport();
                exportEntry.readExportEntry(
                    reader,
                    range);
                exportEntry.ordinal = i + this.ordinalBase;
                result[i] = exportEntry;
            }

            if (numberOfNamePointers != 0
                && namePointerRva != 0
                && ordinalTableRva != 0) {
                    
                for (var i = 0; i < numberOfNamePointers; i++)
                {
                    var ordinalReader = reader.readAtOffset(ordinalTableRva + 2 * i);
                    var ordinal = ordinalReader.readShort();

                    var fnRvaReader = reader.readAtOffset(namePointerRva + 4 * i);
                    var functionNameRva = fnRvaReader.readInt();

                    var functionName: string;
                    if (functionNameRva == 0)
                    {
                        functionName = null;
                    }
                    else
                    {
                        var fnReader = reader.readAtOffset(functionNameRva);
                        functionName = fnReader.readAsciiZ();
                    }

                    this.exports[ordinal].name = functionName;
                }
            }

            return result;
        }

        private readExportEntry(reader: io.BinaryReader, range: io.AddressRange) {
            var exportOrForwarderRva = reader.readInt();

            if (range.contains(exportOrForwarderRva))
            {
                this.exportRva = 0;

                var forwarderRva = reader.readInt();
                if (forwarderRva == 0)
                    this.forwarder = null;
                else
                    this.forwarder = reader.readAtOffset(forwarderRva).readAsciiZ();
            }
            else
            {
                this.exportRva = reader.readInt();
                this.forwarder = null;
            }

            this.name = null;
        }
    }

    export interface DllExports {
        length: number;
        [i: number]: DllExport;

        // Reserved, must be 0.
        flags: number;

        // The time and date that the export data was created.
        timestamp: Date;

        // The version number. The major and minor version numbers can be set by the user.
        version: string;
            
        // The ASCII string that contains the name of the DLL. This address is relative to the image base.
        dllName;
            
        // The starting ordinal number for exports in this image.
        // This field specifies the starting ordinal number for the export address table.
        // It is usually set to 1.
        ordinalBase;
    }
}