﻿/// <reference path="rowEnums.ts" />
/// <reference path="MetadataStreams.ts" />
/// <reference path="../MemberDefinitions.ts" />

module pe.managed.metadata {
	export class TableStreamReader {
		private stringHeapCache: string[] = [];

		constructor(
			private baseReader: io.BufferReader,
			private streams: metadata.MetadataStreams,
			private tables: any[][]) {

			this.readResolutionScope = this.createCodedIndexReader(
				TableKind.Module,
				TableKind.ModuleRef,
				TableKind.AssemblyRef,
				TableKind.ExternalType);

			this.readTypeDefOrRef = this.createCodedIndexReader(
				TableKind.TypeDef,
				TableKind.ExternalType,
				TableKind.TypeSpec);

			this.readHasConstant = this.createCodedIndexReader(
				TableKind.FieldDefinition,
				TableKind.ParameterDefinition,
				TableKind.PropertyDefinition);

			this.readHasCustomAttribute = this.createCodedIndexReader(
				TableKind.MethodDef,
				TableKind.FieldDefinition,
				TableKind.ExternalType,
				TableKind.TypeDef,
				TableKind.ParameterDefinition,
				TableKind.InterfaceImpl,
				TableKind.MemberRef,
				TableKind.Module,
				<TableKind>0xFFFF, // TableKind.Permission,
				TableKind.PropertyDefinition,
				TableKind.Event,
				TableKind.StandAloneSig,
				TableKind.ModuleRef,
				TableKind.TypeSpec,
				TableKind.Assembly,
				TableKind.AssemblyRef,
				TableKind.File,
				TableKind.ExportedType,
				TableKind.ManifestResource,
				TableKind.GenericParam,
				TableKind.GenericParamConstraint,
				TableKind.MethodSpec);

			this.readCustomAttributeType = this.createCodedIndexReader(
				<TableKind>0xFFFF, //TableKind.Not_used_0,
				<TableKind>0xFFFF, //TableKind.Not_used_1,
				TableKind.MethodDef,
				TableKind.MemberRef,
				<TableKind>0xFFFF //TableKind.Not_used_4
			);

			this.readHasDeclSecurity = this.createCodedIndexReader(
				TableKind.TypeDef,
				TableKind.MethodDef,
				TableKind.Assembly);

			this.readImplementation = this.createCodedIndexReader(
				TableKind.File,
				TableKind.AssemblyRef,
				TableKind.ExportedType);

			this.readHasFieldMarshal = this.createCodedIndexReader(
				TableKind.FieldDefinition,
				TableKind.ParameterDefinition);

			this.readTypeOrMethodDef = this.createCodedIndexReader(
				TableKind.TypeDef,
				TableKind.MethodDef);

			this.readMemberForwarded = this.createCodedIndexReader(
				TableKind.FieldDefinition,
				TableKind.MethodDef);

			this.readMemberRefParent = this.createCodedIndexReader(
				TableKind.TypeDef,
				TableKind.ExternalType,
				TableKind.ModuleRef,
				TableKind.MethodDef,
				TableKind.TypeSpec);

			this.readMethodDefOrRef = this.createCodedIndexReader(
				TableKind.MethodDef,
				TableKind.MemberRef);

			this.readHasSemantics = this.createCodedIndexReader(
				TableKind.Event,
				TableKind.PropertyDefinition);
		}

		readResolutionScope: () => any;
		readTypeDefOrRef: () => any;
		readHasConstant: () => any;
		readHasCustomAttribute: () => any;
		readCustomAttributeType: () => any;
		readHasDeclSecurity: () => any;
		readImplementation: () => any;
		readHasFieldMarshal: () => any;
		readTypeOrMethodDef: () => any;
		readMemberForwarded: () => any;
		readMemberRefParent: () => any;
		readMethodDefOrRef: () => any;
		readHasSemantics: () => any;

		readByte(): number { return this.baseReader.readByte(); }
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

					var saveOffset = this.baseReader.offset;
					this.baseReader.setVirtualOffset(this.streams.strings.address + pos);
					result = this.baseReader.readUtf8Z(1024 * 1024 * 1024); // strings longer than 1GB? Not supported for a security excuse.
					this.baseReader.offset = saveOffset;

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

		readBlobHex(): string {
			var blobIndex = this.readBlobIndex();
			var saveOffset = this.baseReader.offset;

			this.baseReader.setVirtualOffset(this.streams.blobs.address + blobIndex);
			var length = this.readBlobSize();

			var result = "";
			for (var i = 0; i < length; i++) {
				var hex = this.baseReader.readByte().toString(16);
				if (hex.length==1)
					result += "0";
				result += hex;
			}

			this.baseReader.offset = saveOffset;

			return result;
		}

		readBlob(): Uint8Array {
			var blobIndex = this.readBlobIndex();
			var saveOffset = this.baseReader.offset;

			this.baseReader.setVirtualOffset(this.streams.blobs.address + blobIndex);
			var length = this.readBlobSize();

			var result = this.baseReader.readBytes(length);

			this.baseReader.offset = saveOffset;

			return result;
		}

		private readBlobIndex(): number {
			return this.readPos(this.streams.blobs.size);
		}

		private readBlobSize(): number {
			var length;
			var b0 = this.baseReader.readByte();
			if (b0 < 0x80) {
				length = b0;
			}
			else {
				var b1 = this.baseReader.readByte();

				if ((b0 & 0xC0) == 0x80) {
					length = ((b0 & 0x3F) << 8) + b1;
				}
				else {
					var b2 = this.baseReader.readByte();
					var b3 = this.baseReader.readByte();
					length = ((b0 & 0x3F) << 24) + (b1 << 16) + (b2 << 8) + b3;
				}
			}

			return length;
		}

		readTableRowIndex(tableIndex: number): number {
			var tableRows = this.tables[tableIndex];

			return this.readPos(tableRows ? tableRows.length : 0);
		}

		private createCodedIndexReader(...tableTypes: TableKind[]): () => any {
			var tableDebug = [];
			var maxTableLength = 0;
			for (var i = 0; i < tableTypes.length; i++) {

				var table = this.tables[tableTypes[i]];
				if (!table) {
					tableDebug.push(null);
					continue;
				}

				tableDebug.push(table.length);
				maxTableLength = Math.max(maxTableLength, table.length);
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
			//var debug = { maxTableLength: maxTableLength, calcRequredBitCount: calcRequredBitCount, tableLengths: tableDebug };

			return () => {
				var result = tableKindBitCount + tableIndexBitCount <= 16 ?
					this.baseReader.readShort() : // it fits within short
					this.baseReader.readInt(); // it does not fit within short

				//debug.toString();

				var resultIndex = result >> tableKindBitCount;
				var resultTableIndex = result - (resultIndex << tableKindBitCount);

				var table = tableTypes[resultTableIndex];

				if (resultIndex == 0)
					return null;

				resultIndex--;

				var row = this.tables[table][resultIndex];

				return row;
			};
		}

		private readPos(spaceSize: number): number {
			if (spaceSize < 65535)
				return this.baseReader.readShort();
			else
				return this.baseReader.readInt();
		}

		readMethodSignature(definition: MethodSignature): void {
			var blobIndex = this.readBlobIndex();
			var saveOffset = this.baseReader.offset;

			this.baseReader.setVirtualOffset(this.streams.blobs.address + blobIndex);
			var length = this.readBlobSize();

			this.readSigMethodDefOrRefOrStandalone(definition);

			this.baseReader.offset = saveOffset;
		}

		readMethodSpec(instantiation: TypeReference[]): void {
			var blobIndex = this.readBlobIndex();
			var saveOffset = this.baseReader.offset;

			this.baseReader.setVirtualOffset(this.streams.blobs.address + blobIndex);
			var length = this.readBlobSize();

			var leadByte = this.baseReader.readByte();
			if (leadByte !== 0x0A)
				throw new Error("Incorrect lead byte " + leadByte + " in MethodSpec signature.");

			var genArgCount = this.readCompressedInt();
			instantiation.length = genArgCount;

			for (var i = 0; i < genArgCount; i++) {
				var type = this.readSigTypeReference();
				instantiation.push(type);
			}

			this.baseReader.offset = saveOffset;
		}

		// ECMA-335 para23.2.1, 23.2.2, 23.2.3
		private readSigMethodDefOrRefOrStandalone(sig: MethodSignature): void {
			var b = this.baseReader.readByte();

			sig.callingConvention = b;

			var genParameterCount = b & CallingConventions.Generic ?
				this.readCompressedInt() :
				0;

			var paramCount = this.readCompressedInt();

			var returnTypeCustomModifiers = this.readSigCustomModifierList();
			var returnType = this.readSigTypeReference();

			sig.parameters = [];

			sig.extraParameters =
				(sig.callingConvention & CallingConventions.VarArg)
				|| (sig.callingConvention & CallingConventions.C) ?
					[] :
					null;

			for (var i = 0; i < paramCount; i++) {
				var p = this.readSigParam();

				if (sig.extraParameters && sig.extraParameters.length > 0) {
					sig.extraParameters.push(p);
				}
				else {
					if (sig.extraParameters && this.baseReader.peekByte()===CallingConventions.Sentinel) {
						this.baseReader.offset++;
						sig.extraParameters.push(p);
					}
					else {
						sig.parameters.push(p);
					}
				}
			}
		}

		// ECMA-335 para23.2.4
		readFieldSignature(definition: FieldDefinition): void {
			var blobIndex = this.readBlobIndex();
			var saveOffset = this.baseReader.offset;

			this.baseReader.setVirtualOffset(this.streams.blobs.address + blobIndex);
			var length = this.readBlobSize();

			var leadByte = this.baseReader.readByte();
			if (leadByte !== 0x06)
				throw new Error("Field signature lead byte 0x" + leadByte.toString(16).toUpperCase() + " is invalid.");

			definition.customModifiers = this.readSigCustomModifierList();

			definition.type = this.readSigTypeReference();

			this.baseReader.offset = saveOffset;
		}

		// ECMA-335 para23.2.5
		readPropertySignature(definition: PropertyDefinition): void {
			var blobIndex = this.readBlobIndex();
			var saveOffset = this.baseReader.offset;

			this.baseReader.setVirtualOffset(this.streams.blobs.address + blobIndex);
			var length = this.readBlobSize();

			var leadByte = this.baseReader.readByte();
			if (!(leadByte & 0x08))
				throw new Error("Property signature lead byte 0x" + leadByte.toString(16).toUpperCase() + " is invalid.");

			definition.isStatic = !(leadByte & CallingConventions.HasThis);

			var paramCount = this.readCompressedInt();

			definition.customModifiers = this.readSigCustomModifierList();

			definition.type = this.readSigTypeReference();

			if (!definition.parameters)
				definition.parameters = [];
			definition.parameters.length = paramCount;

			for (var i = 0; i < paramCount; i++) {
				definition.parameters[i] = this.readSigParam();
			}

			this.baseReader.offset = saveOffset;
		}

		// ECMA-335 para23.2.6, 23.2.9
		readSigLocalVar(): any[] {
			var leadByte = this.baseReader.readByte();
			if (leadByte !== 0x07)
				throw new Error("LocalVarSig signature lead byte 0x" + leadByte.toString(16).toUpperCase() + " is invalid.");

			var count = this.readCompressedInt();
			var result: any[] = Array(count);

			for (var i = 0; i < count; i++) {
				var v = new LocalVariable();

				var varLeadByte = this.baseReader.peekByte();
				if (varLeadByte === ElementType.TypedByRef) {
					this.baseReader.offset++;
					v.type = KnownType.TypedReference;
				}
				else {
					while (true) {
						var cmod = this.readSigCustomModifierOrNull();
						if (cmod) {
							if (!v.customModifiers)
								v.customModifiers = [];
							v.customModifiers.push(cmod);
							continue;
						}

						// ECMA-335 para23.2.9
						if (this.baseReader.peekByte() === ElementType.Pinned) {
							this.baseReader.offset++;
							v.isPinned = true;
							continue;
						}
					}

					v.type = this.readSigTypeReference();
				}

				result.push(v);
			}

			return result;
		}

		// ECMA-335 para23.2.7
		private readSigCustomModifierOrNull(): any {
			var s = this.baseReader.peekByte();

			switch (s) {
				case ElementType.CMod_Opt:
					this.baseReader.offset++;
					return new CustomModifier(false, this.readSigTypeDefOrRefOrSpecEncoded());

				case ElementType.CMod_ReqD:
					this.baseReader.offset++;
					return new CustomModifier(true, this.readSigTypeDefOrRefOrSpecEncoded());

				default:
					return null;
			}
		}

		// ECMA-335 para23.2.8
		private readSigTypeDefOrRefOrSpecEncoded(): TypeReference {
			var uncompressed = this.readCompressedInt();
			var index = Math.floor(uncompressed / 4);
			var tableKind = uncompressed - index * 4;

			var table;
			switch (tableKind) {
				case 0:
					table = this.tables[TableKind.TypeDef];
					break;

				case 1:
					table = this.tables[TableKind.ExternalType];
					break;

				case 2:
					table = this.tables[TableKind.TypeSpec];
					break;

				default:
					throw new Error("Unknown table kind " + tableKind + " in encoded index.");
			}

			var typeReference = table[index];

			return typeReference.definition ? typeReference.definition : typeReference;
		}

		private readSigCustomModifierList(): any[] {
			var result: any[] = null;
			while (true) {
				var mod = this.readSigCustomModifierOrNull();

				if (!mod)
					return result;

				if (!result)
					result = [];

				result.push(mod);
			}
		}

		// ECMA-335 para23.2.10
		private readSigParam(): ParameterSignature {
			var customModifiers = this.readSigCustomModifierList();
			var type = this.readSigTypeReference();
			return new ParameterSignature(customModifiers, type);
		}

		// ECMA-335 para23.2.11, para23.2.12
		private readSigTypeReference(): TypeReference {
			var etype = this.baseReader.readByte();

			var directResult = KnownType.internalGetByElementName(etype);
			if (directResult)
				return directResult;

			switch (etype) {
				case ElementType.Ptr:
					return new PointerType(this.readSigTypeReference());

				case ElementType.ByRef:
					return new ByRefType(this.readSigTypeReference());

				case ElementType.ValueType:
					var value_type = this.readSigTypeDefOrRefOrSpecEncoded();
					//value_type.isValueType = true;
					return value_type;

				case ElementType.Class:
					var value_type = this.readSigTypeDefOrRefOrSpecEncoded();
					//value_type.isValueType = false;
					return value_type;

				case ElementType.Var:
					var varIndex = this.readCompressedInt();
					return new Var(varIndex);

				case ElementType.Array:
					var arrayElementType = this.readSigTypeReference();
					return this.readSigArrayShape(arrayElementType);

				case ElementType.GenericInst: {
					var genInst = new GenericInstantiation();

					var genLead = this.baseReader.readByte();
					var isValueType;
					switch (genLead) {
						case ElementType.Class: (<any>genInst).isValueType = false; break;
						case ElementType.ValueType: (<any>genInst).isValueType = true; break;
						default: throw new Error("Unexpected lead byte 0x" + genLead.toString(16).toUpperCase() + " in GenericInst type signature.");
					}

					genInst.genericType = this.readSigTypeDefOrRefOrSpecEncoded();
					var genArgCount = this.readCompressedInt();
					genInst.arguments = Array(genArgCount);
					for (var iGen = 0; iGen < genArgCount; iGen++) {
						genInst.arguments.push(this.readSigTypeReference());
					}

					return genInst;
				}

				case ElementType.FnPtr:
					var fnPointer = new FunctionPointerType();
					fnPointer.methodSignature = new MethodSignature();
					this.readSigMethodDefOrRefOrStandalone(fnPointer.methodSignature);
					return fnPointer;

				case ElementType.SZArray:
					return new SZArrayType(this.readSigTypeReference());

				case ElementType.MVar:
					var mvarIndex = this.readCompressedInt();
					return new MVar(mvarIndex);

				case ElementType.Sentinel:
					return new SentinelType(this.readSigTypeReference());

				case ElementType.Pinned:
				case ElementType.End:
				case ElementType.Internal:
				case ElementType.Modifier:
				case ElementType.R4_Hfa:
				case ElementType.R8_Hfa:
				case ElementType.ArgumentType_:
				case ElementType.CustomAttribute_BoxedObject_:
				case ElementType.CustomAttribute_Field_:
				case ElementType.CustomAttribute_Property_:
				case ElementType.CustomAttribute_Enum_:
				default:
					throw new Error("Unknown element type " + io.formatEnum(etype, ElementType)+".");
			}
		}

		// ECMA-335 para23.2.13
		private readSigArrayShape(arrayElementType: TypeReference): TypeReference {
			var rank = this.readCompressedInt();
			var dimensions: ArrayDimensionRange[] = Array(rank);
			for (var i = 0; i < rank; i++) {
				dimensions[i] = new ArrayDimensionRange();
			}

			var numSizes = this.readCompressedInt();
			for (var i = 0; i < numSizes; i++) {
				dimensions[i].length = this.readCompressedInt();
			}

			var numLoBounds = this.readCompressedInt();
			for (var i = 0; i < numLoBounds; i++) {
				dimensions[i].lowBound = this.readCompressedInt();
			}

			return new ArrayType(
				arrayElementType,
				dimensions);
		}

		readMemberSignature(): any {
			var blobIndex = this.readBlobIndex();
			var saveOffset = this.baseReader.offset;

			this.baseReader.setVirtualOffset(this.streams.blobs.address + blobIndex);
			var length = this.readBlobSize();

			var result;

			var leadByte = this.baseReader.peekByte();
			if (leadByte & 0x05) {
				this.baseReader.offset++;
				result = new FieldSignature();
				result.customModifiers = this.readSigCustomModifierOrNull();
				result.type = this.readSigTypeReference();
			}
			else {
				result = new MethodSignature();
				this.readSigMethodDefOrRefOrStandalone(result);
			}

			this.baseReader.offset = saveOffset;

			return result;
		}

		// ECMA-335 paraII.23.2
		private readCompressedInt(): number {
			var result;
			var b0 = this.baseReader.readByte();
			if (b0 < 0x80) {
				result = b0;
			}
			else {
				var b1 = this.baseReader.readByte();

				if ((b0 & 0xC0) == 0x80) {
					result = ((b0 & 0x3F) << 8) + b1;
				}
				else {
					var b2 = this.baseReader.readByte();
					var b3 = this.baseReader.readByte();
					result = ((b0 & 0x3F) << 24) + (b1 << 16) + (b2 << 8) + b3;
				}
			}

			return result;
		}

		// ECMA-335 paraII.22.9
		readConstantValue(etype: ElementType): any {
			var blobIndex = this.readBlobIndex();
			var saveOffset = this.baseReader.offset;

			this.baseReader.setVirtualOffset(this.streams.blobs.address + blobIndex);
			var length = this.readBlobSize();

			var result = this.readSigValue(etype, length);

			this.baseReader.offset = saveOffset;

			return result;
		}

		// ECMA-335 paraII.22.9 (in part of reading the actual value)
		private readSigValue(etype: ElementType, length: number): any {

			switch (etype) {
				case ElementType.Boolean:
					return this.baseReader.readByte() !== 0;
				case ElementType.Char:
					return String.fromCharCode(this.baseReader.readShort());
				case ElementType.I1:
					var result = this.baseReader.readByte();
					if (result > 0x7f)
						result -= 0xff;
					return result;
				case ElementType.U1:
					return this.baseReader.readByte();
				case ElementType.I2:
					var result = this.baseReader.readShort();
					if (result > 0x7fff)
						result -= 0xffff;
					return result;
				case ElementType.U2:
					return this.baseReader.readShort();
				case ElementType.I4:
					var result = this.baseReader.readInt();
					if (result > 0x7fffffff)
						result -= 0xffffffff;
					return result;
				case ElementType.U4:
					return this.baseReader.readInt();
				case ElementType.I8:
				case ElementType.U8:
					return this.baseReader.readLong();
				case ElementType.R4:
					return this.baseReader.readInt();
				case ElementType.R8:
					return this.baseReader.readLong();
				case ElementType.String:
					var stringValue = "";
					for (var iChar = 0; iChar < length / 2; iChar++) {
						stringValue += String.fromCharCode(this.baseReader.readShort());
					}
					return stringValue;
				case ElementType.Class:
					var classRef = this.baseReader.readInt();
					if (classRef === 0)
						return null;
					else
						return classRef;
				default:
					return "Unknown element type " + etype + ".";
			}
		}

		// ECMA-335 paraII.2.3
		readCustomAttribute(ctorSignature: MethodSignature): CustomAttributeData {
			var blobIndex = this.readBlobIndex();
			var saveOffset = this.baseReader.offset;

			this.baseReader.setVirtualOffset(this.streams.blobs.address + blobIndex);
			var length = this.readBlobSize();

			var customAttribute = new CustomAttributeData();

			var prolog = this.baseReader.readShort();
			if (prolog !== 0x0001)
				throw new Error("Incorrect prolog value 0x" + prolog.toString(16).toUpperCase() + " for CustomAttribute.");

			customAttribute.fixedArguments = [];
			for (var i = 0; i < ctorSignature.parameters.length; i++) {
				var pType: any = ctorSignature.parameters[i].type;
				customAttribute.fixedArguments.push(this.readSigFixedArg(pType));
			}

			var numNamed = this.baseReader.readShort(); // not compressed short here
			for (var i = 0; i < numNamed; i++) {
				var namedLeadByte = this.baseReader.readByte();
				var isField;
				switch (namedLeadByte) {
					case 0x53: isField = true;
					case 0x54: isField = false;
					default:
						throw new Error("Incorrect leading byte " + namedLeadByte + " for named CustomAttribute argument.");
				}

				var fieldOrPropType = this.readSigFieldOrPropType();
				var fieldOrPropName = this.readSigSerString();
				var value = this.readSigFixedArg(fieldOrPropType);
				customAttribute.namedArguments.push({ name: fieldOrPropName, type: fieldOrPropType, value: value });
			}

			this.baseReader.offset = saveOffset;

			return customAttribute;
		}

		private readSigFixedArg(type: TypeReference) {
			var isArray = (<any>type).elementType && !(<any>type).dimensions;

			if (isArray) {
				var szElements = [];
				var numElem = this.baseReader.readInt(); // not compressed int here
				for (var i = 0; i < numElem; i++) {
					szElements.push(this.readSigElem((<any>type).elementType));
				}
				return szElements;
			}
			else {
				return this.readSigElem(type);
			}
		}

		private readSigFieldOrPropType(): any {
		}

		private readSigSerString(): any {
		}

		private readSigElem(type: TypeReference): any {
			//switch (type) {
			//	case KnownType.Boolean:
			//		return new ConstantValue(this.baseReader.readByte() !== 0;

			//	case KnownType.Char:
			//		return String.fromCharCode(this.baseReader.readShort());

			//	case KnownType.Single:
			//		return { raw: this.baseReader.readInt() };

			//	case KnownType.Double:
			//		return { raw: this.baseReader.readLong() };

			//	case KnownType.Byte:
			//		return this.baseReader.readByte();

			//	case KnownType.Int16:
			//}
		}
	}
}