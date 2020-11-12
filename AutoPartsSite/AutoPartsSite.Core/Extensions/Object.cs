﻿using System;

namespace AutoPartsSite.Core.Extensions
{
    public static partial class Object
    {
        public static int ToInt(this object obj)
        {
            return obj is null || DBNull.Value.Equals(obj) ? 0 : (int)obj;
        }

        public static decimal ToDecimal(this object obj)
        {
            return obj is null || DBNull.Value.Equals(obj) ? 0 : (decimal)obj;
        }

        public static string ToStr(this object obj)
        {
            return obj is null || DBNull.Value.Equals(obj) ? string.Empty : (string)obj;
        }
    }
}
