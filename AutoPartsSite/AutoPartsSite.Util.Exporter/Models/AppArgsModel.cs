using System;
using System.Collections.Generic;
using System.Text;

namespace AutoPartsSite.Util.Exporter.Models
{
    public class AppArgsModel
    {
        public bool NoUI { get; set; } = false;
        public string Server { get; set; } = string.Empty;
        public bool IsSSPI { get; set; } = false;
        public string User { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string Db { get; set; } = string.Empty;
        
        public int Company { get; set; } = 0;
        public int Agreement { get; set; } = 0;
    }
}
