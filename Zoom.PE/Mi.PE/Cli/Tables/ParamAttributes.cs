﻿using System;
using System.Collections.Generic;
using System.Linq;

namespace Mi.PE.Cli.Tables
{
    /// <summary>
    /// [ECMA-335 §23.1.13]
    /// </summary>
    [Flags]
    public enum ParamAttributes : ushort
    {
        /// <summary>
        /// Param is [In].
        /// </summary>
        In = 0x0001,

        /// <summary>
        /// Param is [out].
        /// </summary>
        Out = 0x0002,
        
        /// <summary>
        /// Param is optional.
        /// </summary>
        Optional = 0x0010,
        
        /// <summary>
        /// Param has default value.
        /// </summary>
        HasDefault = 0x1000,
        
        /// <summary>
        /// Param has FieldMarshal.
        /// </summary>
        HasFieldMarshal = 0x2000,
        
        /// <summary>
        /// Reserved: shall be zero in a conforming implementation.
        /// </summary>
        Unused = 0xcfe0,
    }
}