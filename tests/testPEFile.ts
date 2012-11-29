/// <reference path="../PEFile.ts" />

module test_PEFile {

export function constructor_succeeds(ts) {
	var pe = new pe.PEFile();
	ts.ok();
}

export function dosHeader_notNull(ts) {
	var pe = new pe.PEFile();
	if (!pe.dosHeader)
		ts.fail();
	else
		ts.ok();
}

}