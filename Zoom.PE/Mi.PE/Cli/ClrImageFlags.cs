﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Mi.PE.Cli
{
    [Flags]
    public enum ClrImageFlags
    {
        ILOnly = 0x00000001,
        _32BitRequired = 0x00000002,
        ILLibrary = 0x00000004,
        StrongNameSigned = 0x00000008,
        NativeEntryPoint = 0x00000010,
        TrackDebugData = 0x00010000,
        IsIbcoptimized = 0x00020000,    // NEW
    }
}