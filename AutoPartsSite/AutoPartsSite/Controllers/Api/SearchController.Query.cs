using System.Data.SqlClient;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Sql;
using AutoPartsSite.Models.GlobalParts;

namespace AutoPartsSite.Controllers.Api
{
    public partial class SearchController
    {
        [NonAction]
        protected override Query CreateQuery()
        {
            return AppSettings.Query.GlobalParts;
        }

        [NonAction]
        private List<GoodsSearch> GetGoods(string partNumber, int pageRows, int page)
        {
            List<GoodsSearch> result = new List<GoodsSearch>();
            ExecQuery((query) =>
            {
                query.Execute(@"Search\[get]", new SqlParameter[] 
                { 
                    new SqlParameter() { ParameterName = "@PartNumber", Value = partNumber },
                    new SqlParameter() { ParameterName = "@RowspPage" , Value = pageRows },
                    new SqlParameter() { ParameterName = "@PageNumber", Value = page }
                }
                , (values) =>
                {
                    result.Add(new GoodsSearch()
                    {
                        Id = (int)values[0],
                        Articul = (string)values[1],
                        PartNumber = (string)values[2],
                        Name = (string)values[3],
                        Brand = new Brand() { Id = (int)values[5], Code = (string)values[6] },
                        Country = new Country() { Id = (int)values[7], Code = (string)values[8], Name = (string)values[9] },
                        Parameters = new GoodsParameters()
                        {
                            WeightPhysical = (decimal)values[11],
                            WeightVolumetric = (decimal)values[12],
                            VolumetricDivider = (decimal)values[13],
                            LengthCm = (decimal)values[14],
                            WidthCm = (decimal)values[15],
                            HeightCm = (decimal)values[16],
                            BlockWeightChange = (bool)values[17]
                        },
                        Page = (long)values[18],
                        MaxPage = (long)values[19]
                    });
                });
            });
            return result;
        }

    }
}
