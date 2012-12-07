/// <reference path="../pe.ts" />

module test_PEFile_read_sampleExe {

    var sampleBuf =
[77,90,144,,3,,,,4,,,,255,255,,,184,,,,,,,,64,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,128,,,,14,31,186,14,,180,9,205,33,184,1,76,205,33,84,104,105,115,32,112,114,111,103,114,97,109,32,99,97,110,110,111,116,32,98,101,32,114,117,110,32,105,110,32,68,79,83,32,109,111,100,101,46,13,13,10,36,,,,,,,,80,69,,,76,1,3,,195,135,151,80,,,,,,,,,224,,2,1,11,1,8,,,4,,,,6,,,,,,,62,35,,,,32,,,,64,,,,,64,,,32,,,,2,,,4,,,,,,,,4,,,,,,,,,128,,,,2,,,,,,,3,,64,133,,,16,,,16,,,,,16,,,16,,,,,,,16,,,,,,,,,,,,228,34,,,87,,,,,64,,,160,2,,,,,,,,,,,,,,,,,,,,96,,,12,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,32,,,8,,,,,,,,,,,,8,32,,,72,,,,,,,,,,,,46,116,101,120,116,,,,68,3,,,,32,,,,4,,,,2,,,,,,,,,,,,,,,32,,,96,46,114,115,114,99,,,,160,2,,,,64,,,,4,,,,6,,,,,,,,,,,,,,,64,,,64,46,114,101,108,111,99,,,12,,,,,96,,,,2,,,,10,,,,,,,,,,,,,,,64,,,66,,,,,,,,,,,,,,,,,32,35,,,,,,,72,,,,2,,5,,104,32,,,124,2,,,1,,,,1,,,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,54,,114,1,,,112,40,3,,,10,,42,30,2,40,4,,,10,42,,,66,83,74,66,1,,1,,,,,,12,,,,118,50,46,48,46,53,48,55,50,55,,,,,5,,108,,,,228,,,,35,126,,,80,1,,,184,,,,35,83,116,114,105,110,103,115,,,,,8,2,,,32,,,,35,85,83,,40,2,,,16,,,,35,71,85,73,68,,,,56,2,,,68,,,,35,66,108,111,98,,,,,,,,2,,,1,71,20,,,9,,,,,250,1,51,,22,,,1,,,,4,,,,2,,,,2,,,,4,,,,2,,,,1,,,,1,,,,,,10,,1,,,,,,6,,45,,38,,6,,95,,63,,6,,127,,63,,6,,164,,38,,,,,,1,,,,,,1,,1,,,,16,,21,,,,5,,1,,1,,80,32,,,,,145,,52,,10,,1,,94,32,,,,,134,24,57,,14,,1,,17,,57,,18,,25,,57,,14,,33,,172,,23,,9,,57,,14,,46,,11,,28,,46,,19,,37,,4,128,,,,,,,,,,,,,,,,,157,,,,2,,,,,,,,,,,,1,,29,,,,,,,,,,,60,77,111,100,117,108,101,62,,115,97,109,112,108,101,46,101,120,101,,80,114,111,103,114,97,109,,109,115,99,111,114,108,105,98,,83,121,115,116,101,109,,79,98,106,101,99,116,,77,97,105,110,,46,99,116,111,114,,83,121,115,116,101,109,46,82,117,110,116,105,109,101,46,67,111,109,112,105,108,101,114,83,101,114,118,105,99,101,115,,67,111,109,112,105,108,97,116,105,111,110,82,101,108,97,120,97,116,105,111,110,115,65,116,116,114,105,98,117,116,101,,82,117,110,116,105,109,101,67,111,109,112,97,116,105,98,105,108,105,116,121,65,116,116,114,105,98,117,116,101,,115,97,109,112,108,101,,67,111,110,115,111,108,101,,87,114,105,116,101,76,105,110,101,,,,,27,72,,101,,108,,108,,111,,44,,32,,87,,111,,114,,108,,100,,33,,,,,,146,199,156,13,90,202,19,73,158,118,143,24,114,188,194,39,,8,183,122,92,86,25,52,224,137,3,,,1,3,32,,1,4,32,1,1,8,4,,1,1,14,8,1,,8,,,,,,30,1,,1,,84,2,22,87,114,97,112,78,111,110,69,120,99,101,112,116,105,111,110,84,104,114,111,119,115,1,12,35,,,,,,,,,,,46,35,,,,32,,,,,,,,,,,,,,,,,,,,,,,32,35,,,,,,,,,,,,,,,,,,,,,95,67,111,114,69,120,101,77,97,105,110,,109,115,99,111,114,101,101,46,100,108,108,,,,,,255,37,,32,64,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,16,,,,24,,,128,,,,,,,,,,,,,,,1,,1,,,,48,,,128,,,,,,,,,,,,,,,1,,,,,,72,,,,88,64,,,68,2,,,,,,,,,,,68,2,52,,,,86,,83,,95,,86,,69,,82,,83,,73,,79,,78,,95,,73,,78,,70,,79,,,,,,189,4,239,254,,,1,,,,,,,,,,,,,,,,,,63,,,,,,,,4,,,,1,,,,,,,,,,,,,,,,68,,,,1,,86,,97,,114,,70,,105,,108,,101,,73,,110,,102,,111,,,,,,36,,4,,,,84,,114,,97,,110,,115,,108,,97,,116,,105,,111,,110,,,,,,,,176,4,164,1,,,1,,83,,116,,114,,105,,110,,103,,70,,105,,108,,101,,73,,110,,102,,111,,,,128,1,,,1,,48,,48,,48,,48,,48,,52,,98,,48,,,,44,,2,,1,,70,,105,,108,,101,,68,,101,,115,,99,,114,,105,,112,,116,,105,,111,,110,,,,,,32,,,,48,,8,,1,,70,,105,,108,,101,,86,,101,,114,,115,,105,,111,,110,,,,,,48,,46,,48,,46,,48,,46,,48,,,,56,,11,,1,,73,,110,,116,,101,,114,,110,,97,,108,,78,,97,,109,,101,,,,115,,97,,109,,112,,108,,101,,46,,101,,120,,101,,,,,,40,,2,,1,,76,,101,,103,,97,,108,,67,,111,,112,,121,,114,,105,,103,,104,,116,,,,32,,,,64,,11,,1,,79,,114,,105,,103,,105,,110,,97,,108,,70,,105,,108,,101,,110,,97,,109,,101,,,,115,,97,,109,,112,,108,,101,,46,,101,,120,,101,,,,,,52,,8,,1,,80,,114,,111,,100,,117,,99,,116,,86,,101,,114,,115,,105,,111,,110,,,,48,,46,,48,,46,,48,,46,,48,,,,56,,8,,1,,65,,115,,115,,101,,109,,98,,108,,121,,32,,86,,101,,114,,115,,105,,111,,110,,,,48,,46,,48,,46,,48,,46,,48,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,32,,,12,,,,64,51];
    sampleBuf[3071] = 0; // 3072 bytes
    for (var i = 0; i < sampleBuf.length; i++) {
        if (!sampleBuf[i])
            sampleBuf[i] = 0;
    }

    export function read_succeds() {
        var bi = new pe.io.BufferBinaryReader(sampleBuf);
        var pef = new pe.headers.PEFile();
        pef.read(bi);
    }

    export function read_dosHeader_mz_MZ() {
        var bi = new pe.io.BufferBinaryReader(sampleBuf);
        var pef = new pe.headers.PEFile();
        pef.read(bi);

        if (pef.dosHeader.mz !== pe.headers.MZSignature.MZ)
            throw pef.dosHeader.mz;
    }

    export function read_dosHeader_lfanew_128() {
        var bi = new pe.io.BufferBinaryReader(sampleBuf);
        var pef = new pe.headers.PEFile();
        pef.read(bi);

        if (pef.dosHeader.lfanew !== 128)
            throw pef.dosHeader.lfanew;
    }

    export function read_dosStub_length_64() {
        var bi = new pe.io.BufferBinaryReader(sampleBuf);
        var pef = new pe.headers.PEFile();
        pef.read(bi);

        if (pef.dosStub.length !== 64)
            throw pef.dosStub.length;
    }

    export function read_dosStub_matchesInputAt64() {
        var bi = new pe.io.BufferBinaryReader(sampleBuf);
        var pef = new pe.headers.PEFile();
        pef.read(bi);

        var dosStub = [];
        for (var i = 0; i < pef.dosStub.length; i++) {
            dosStub[i] = pef.dosStub[i];
        }

        var dosStubStr = dosStub.join(",");

        var inputAt64 = sampleBuf.slice(64, 64 + 64);
        var inputAt64Str = inputAt64.join(",");


        if (dosStubStr !== inputAt64Str)
            throw dosStubStr + " expected " + inputAt64Str;
    }

    export function read_peHeader_pe_PE() {
        var bi = new pe.io.BufferBinaryReader(sampleBuf);
        var pef = new pe.headers.PEFile();
        pef.read(bi);

        if (pef.peHeader.pe !== pe.headers.PESignature.PE)
            throw pef.peHeader.pe;
    }

    export function read_peHeader_machine_I386() {
        var bi = new pe.io.BufferBinaryReader(sampleBuf);
        var pef = new pe.headers.PEFile();
        pef.read(bi);

        if (pef.peHeader.machine !== pe.headers.Machine.I386)
            throw pef.peHeader.machine;
    }

    export function read_optionalHeader_peMagic_NT32() {
        var bi = new pe.io.BufferBinaryReader(sampleBuf);
        var pef = new pe.headers.PEFile();
        pef.read(bi);

        if (pef.optionalHeader.peMagic !== pe.headers.PEMagic.NT32)
            throw pef.optionalHeader.peMagic;
    }
    
    export function read_optionalHeader_numberOfRvaAndSizes_16() {
        var bi = new pe.io.BufferBinaryReader(sampleBuf);
        var pef = new pe.headers.PEFile();
        pef.read(bi);

        if (pef.optionalHeader.numberOfRvaAndSizes !== 16)
            throw pef.optionalHeader.numberOfRvaAndSizes;
    }

    export function read_optionalHeader_dataDirectories_length_16() {
        var bi = new pe.io.BufferBinaryReader(sampleBuf);
        var pef = new pe.headers.PEFile();
        pef.read(bi);

        if (pef.optionalHeader.dataDirectories.length !== 16)
            throw pef.optionalHeader.dataDirectories.length;
    }

    export function read_optionalHeader_dataDirectories_14_address_8200() {
        var bi = new pe.io.BufferBinaryReader(sampleBuf);
        var pef = new pe.headers.PEFile();
        pef.read(bi);

        if (pef.optionalHeader.dataDirectories[14].address !== 8200)
            throw pef.optionalHeader.dataDirectories[14].address;
    }

    export function read_optionalHeader_dataDirectories_14_size_72() {
        var bi = new pe.io.BufferBinaryReader(sampleBuf);
        var pef = new pe.headers.PEFile();
        pef.read(bi);

        if (pef.optionalHeader.dataDirectories[14].size !== 72)
            throw pef.optionalHeader.dataDirectories[14].size;
    }

    export function read_sectionHeaders_length_3() {
        var bi = new pe.io.BufferBinaryReader(sampleBuf);
        var pef = new pe.headers.PEFile();
        pef.read(bi);

        if (pef.sectionHeaders.length !== 3)
            throw pef.sectionHeaders.length;
    }

    export function read_sectionHeaders_names_DOTtext_DOTrsrc_DOTreloc() {
        var bi = new pe.io.BufferBinaryReader(sampleBuf);
        var pef = new pe.headers.PEFile();
        pef.read(bi);

        var namesArray = [];
        for (var i = 0; i < pef.sectionHeaders.length; i++) {
            namesArray.push(pef.sectionHeaders[i].name);
        }
        var namesStr = namesArray.join(" ");

        if (namesStr !== ".text .rsrc .reloc")
            throw namesStr;
    }
}