/// <reference path="../pe.ts" />

declare var monoCorlib: number[];

module test_AssemblyReader_monoCorlibDll {

    export function read_succeeds() {
        var bi = new pe.io.BufferBinaryReader(monoCorlib);
        var asm = new pe.managed.AssemblyDefinition();
        asm.read(bi);
    }
}