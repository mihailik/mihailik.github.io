/// <reference path="ClrImageFlags.ts" />
/// <reference path="../../io/io.ts" />
/// <reference path="../../headers/AddressRange.ts" />

module pe.managed.metadata {

    export class ReadClrDirectory {
        private static clrHeaderSize = 72;
        
        cb: number = 0;
        runtimeVersion: string = "";
        imageFlags: ClrImageFlags = 0;
        metadataDir: headers.AddressRange = null;
        entryPointToken: number = 0;
        resourcesDir: headers.AddressRange = null;
        strongNameSignatureDir: headers.AddressRange = null;
        codeManagerTableDir: headers.AddressRange = null;
        vtableFixupsDir: headers.AddressRange = null;
        exportAddressTableJumpsDir: headers.AddressRange = null;
        managedNativeHeaderDir: headers.AddressRange = null;

        read(readerAtClrDataDirectory: io.BinaryReader) {
            // shift to CLR directory
            var clrDirReader = readerAtClrDataDirectory;

            // CLR header
            this.cb = clrDirReader.readInt();

            if (this.cb < ReadClrDirectory.clrHeaderSize)
                throw new Error(
                    "Unexpectedly short CLR header structure " + this.cb + " reported by Cb field " +
                    "(expected at least " + ReadClrDirectory.clrHeaderSize + ").");

            this.runtimeVersion = clrDirReader.readShort() + "." + clrDirReader.readShort();

            this.metadataDir = new headers.AddressRange(
                clrDirReader.readInt(),
                clrDirReader.readInt());

            this.imageFlags = clrDirReader.readInt();

            // need to convert to meaningful value before sticking into ModuleDefinition
            this.entryPointToken = clrDirReader.readInt();

            this.resourcesDir = new headers.AddressRange(
                clrDirReader.readInt(),
                clrDirReader.readInt());

            this.strongNameSignatureDir = new headers.AddressRange(
                clrDirReader.readInt(),
                clrDirReader.readInt());

            this.codeManagerTableDir = new headers.AddressRange(
                clrDirReader.readInt(),
                clrDirReader.readInt());

            this.vtableFixupsDir = new headers.AddressRange(
                clrDirReader.readInt(),
                clrDirReader.readInt());

            this.exportAddressTableJumpsDir = new headers.AddressRange(
                clrDirReader.readInt(),
                clrDirReader.readInt());

            this.managedNativeHeaderDir = new headers.AddressRange(
                clrDirReader.readInt(),
                clrDirReader.readInt());
        }
    }
}