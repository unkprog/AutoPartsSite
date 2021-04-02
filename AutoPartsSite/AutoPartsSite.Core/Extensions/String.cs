using System;
using System.Collections.Generic;
using System.Text;

namespace AutoPartsSite.Core.Extensions
{
    public static partial class String
    {
        public static int ToInt(this string str)
        {
            int result = 0;
            if (string.IsNullOrEmpty(str) || !int.TryParse(str, out result))
                result = 0;
            return result;
        }
    }
}
