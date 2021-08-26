using System;

namespace AutoPartsSite.Core.Extensions
{
    public static partial class Object
    {
        public static bool IsNull(this object obj)
        {
            return obj is null || DBNull.Value.Equals(obj);
        }

        public static bool ToBool(this object obj)
        {
            return obj.IsNull() ? false : (bool)obj;
        }

        public static int ToInt(this object obj)
        {
            return obj.IsNull() ? 0 : (int)obj;
        }

        public static long ToLong(this object obj)
        {
            return obj.IsNull() ? 0 : (long)obj;
        }

        public static decimal ToDecimal(this object obj)
        {
            return obj.IsNull() ? 0 : (decimal)obj;
        }

        public static DateTime nullDate = new DateTime(1899, 12, 30);
        public static DateTime ToDateTime(this object obj)
        {
            return obj.IsNull() ? nullDate : (DateTime)obj;
        }

        public static string ToStr(this object obj)
        {
            return obj.IsNull() ? string.Empty : (string)obj;
        }
    }
}
