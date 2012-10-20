/// <reference path="BinaryReader.ts" />
/// <reference path="Version.ts" />
/// <reference path="Machine.ts" />

/// <reference path="Internal/Directory.ts" />
/// <reference path="Internal/SectionHeader.ts" />
/// <reference path="Internal/StreamHeader.ts" />
/// <reference path="Internal/BinaryReaderExtensions.ts" />

module Mi.PE {

    export class PEFile {

        machine: Machine;
        timestamp: Date;
        imageCharacteristics: number;

        osVersion: Version;
        imageVersion: Version;

        win32Version: number;
        subsystem: number;
        dllCharacteristics: number;

        runtimeVersion: Version;

        imageFlags: number;

        metadataVersion: Version;
        metadataVersionString: string;

        guids: string[];

        tableStreamVersion: Version;
    }
}