/// <reference path="Version.ts" />
/// <reference path="Machine.ts" />

/// <reference path="PEFormat/PEFields.ts" />

module Mi.PE {
    export class AssemblyDefinition {

        pe: PEFormat.PEFile;

        runtimeVersion: Version;

        imageFlags: number;

        metadataVersion: Version;
        metadataVersionString: string;
    }
}