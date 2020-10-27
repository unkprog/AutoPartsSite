using AutoPartsSite.Core.Sql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutoPartsSite.Controllers.Api
{
    public partial class CmsController
    {
        public class CardParams
        {
            public CardParams()
            {
                datefrom = Constants.minReportDate.ToString("dd.MM.yyyy");
                dateto = Constants.minReportDate.ToString("dd.MM.yyyy");
            }
            public string datefrom { get; set; }
            public string dateto { get; set; }
        }
    }
}
