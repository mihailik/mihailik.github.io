/// <reference path="../pe.ts" />
/// <reference path="sample64Exe.ts" />

module test_PEFileHeaders_read_sample64Exe {

	export function read_succeeds() {
		var bi = new pe.io.BufferReader(sample64Exe.bytes);
		var pef = new pe.headers.PEFileHeaders();
		pef.read(bi);
	}

	export function read_dosHeader_mz_MZ() {
		var bi = new pe.io.BufferReader(sample64Exe.bytes);
		var pef = new pe.headers.PEFileHeaders();
		pef.read(bi);

		if (pef.dosHeader.mz !== pe.headers.MZSignature.MZ)
			throw pef.dosHeader.mz;
	}

	export function read_dosHeader_lfanew_128() {
		var bi = new pe.io.BufferReader(sample64Exe.bytes);
		var pef = new pe.headers.PEFileHeaders();
		pef.read(bi);

		if (pef.dosHeader.lfanew !== 128)
			throw pef.dosHeader.lfanew;
	}

	export function read_dosStub_length_64() {
		var bi = new pe.io.BufferReader(sample64Exe.bytes);
		var pef = new pe.headers.PEFileHeaders();
		pef.read(bi);

		if (pef.dosStub.length !== 64)
			throw pef.dosStub.length;
	}

	export function read_dosStub_matchesInputAt64() {
		var bi = new pe.io.BufferReader(sample64Exe.bytes);
		var pef = new pe.headers.PEFileHeaders();
		pef.read(bi);

		var dosStub = [];
		for (var i = 0; i < pef.dosStub.length; i++) {
			dosStub[i] = pef.dosStub[i];
		}

		var dosStubStr = dosStub.join(",");

		var arr = new Uint8Array(sample64Exe.bytes, 64, dosStub.length);
		var inputAt64 = Array(arr.length);
		for (var i = 0; i < arr.length; i++) {
			inputAt64[i] = arr[i];
		}

		var inputAt64Str = inputAt64.join(",");


		if (dosStubStr !== inputAt64Str)
			throw dosStubStr + " expected " + inputAt64Str;
	}

	export function read_peHeader_pe_PE() {
		var bi = new pe.io.BufferReader(sample64Exe.bytes);
		var pef = new pe.headers.PEFileHeaders();
		pef.read(bi);

		if (pef.peHeader.pe !== pe.headers.PESignature.PE)
			throw pef.peHeader.pe;
	}

	export function read_peHeader_machine_AMD64() {
		var bi = new pe.io.BufferReader(sample64Exe.bytes);
		var pef = new pe.headers.PEFileHeaders();
		pef.read(bi);

		if (pef.peHeader.machine !== pe.headers.Machine.AMD64)
			throw pef.peHeader.machine;
	}

	export function read_optionalHeader_peMagic_NT64() {
		var bi = new pe.io.BufferReader(sample64Exe.bytes);
		var pef = new pe.headers.PEFileHeaders();
		pef.read(bi);

		if (pef.optionalHeader.peMagic !== pe.headers.PEMagic.NT64)
			throw pef.optionalHeader.peMagic;
	}
	
	export function read_optionalHeader_numberOfRvaAndSizes_16() {
		var bi = new pe.io.BufferReader(sample64Exe.bytes);
		var pef = new pe.headers.PEFileHeaders();
		pef.read(bi);

		if (pef.optionalHeader.numberOfRvaAndSizes !== 16)
			throw pef.optionalHeader.numberOfRvaAndSizes;
	}

	export function read_optionalHeader_dataDirectories_length_16() {
		var bi = new pe.io.BufferReader(sample64Exe.bytes);
		var pef = new pe.headers.PEFileHeaders();
		pef.read(bi);

		if (pef.optionalHeader.dataDirectories.length !== 16)
			throw pef.optionalHeader.dataDirectories.length;
	}

	export function read_optionalHeader_dataDirectories_14_address_8192() {
		var bi = new pe.io.BufferReader(sample64Exe.bytes);
		var pef = new pe.headers.PEFileHeaders();
		pef.read(bi);

		if (pef.optionalHeader.dataDirectories[14].address !== 8192)
			throw pef.optionalHeader.dataDirectories[14].address;
	}

	export function read_optionalHeader_dataDirectories_14_size_72() {
		var bi = new pe.io.BufferReader(sample64Exe.bytes);
		var pef = new pe.headers.PEFileHeaders();
		pef.read(bi);

		if (pef.optionalHeader.dataDirectories[14].size !== 72)
			throw pef.optionalHeader.dataDirectories[14].size;
	}

	export function read_sectionHeaders_length_2() {
		var bi = new pe.io.BufferReader(sample64Exe.bytes);
		var pef = new pe.headers.PEFileHeaders();
		pef.read(bi);

		if (pef.sectionHeaders.length !== 2)
			throw pef.sectionHeaders.length;
	}

	export function read_sectionHeaders_names_DOTtext_DOTrsrc() {
		var bi = new pe.io.BufferReader(sample64Exe.bytes);
		var pef = new pe.headers.PEFileHeaders();
		pef.read(bi);

		var namesArray = [];
		for (var i = 0; i < pef.sectionHeaders.length; i++) {
			namesArray.push(pef.sectionHeaders[i].name);
		}
		var namesStr = namesArray.join(" ");

		if (namesStr !== ".text .rsrc")
			throw namesStr;
	}
}