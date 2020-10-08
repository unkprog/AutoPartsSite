select [g].[GoodsID], [g].[Articul], [g].[PartNumber], [g].[DescrEn], [g].[DescrRu]
     , [g].[BrandID], [Brand_Code] = [b].[Code]
     , [b].[CountryID], [Country_Code] = [c].[Code], [Country_DescrEn] = [c].[DescrEn], [Country_DescrRu] = [c].[DescrRu]
     , [g].[WeightPhysical], [g].[WeightVolumetric], [g].[VolumetricDivider]
     , [g].[LengthCm], [g].[WidthCm], [g].[HeightCm]
     , [g].[BlockWeightChange]
from [Goods] [g] with(nolock)
left join [Brands]    [b] with(nolock) on [g].[BrandID]   = [b].[BrandID]
left join [Countries] [c] with(nolock) on [b].[CountryID] = [c].[CountryID]
where [g].[Deleted] = 0 and [g].[PartNumber] like '%' + @PartNumber + '%'