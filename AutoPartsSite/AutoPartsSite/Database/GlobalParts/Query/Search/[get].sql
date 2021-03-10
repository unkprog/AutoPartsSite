declare @clearPartNumber nvarchar(50) = [dbo].[GetClearPartNumber](@PartNumber)

;with [partsSearch0] as 
(
    select [g].[GoodsID], [g].[Articul], [g].[PartNumber], [g].[DescrEn], [g].[DescrRu]
         , [g].[BrandID], [Brand_Code] = [b].[Code]
         , [b].[CountryID], [Country_Code] = [c].[Code], [Country_DescrEn] = [c].[DescrEn], [Country_DescrRu] = [c].[DescrRu]
         , [g].[WeightPhysical], [g].[WeightVolumetric], [g].[VolumetricDivider]
         , [g].[LengthCm], [g].[WidthCm], [g].[HeightCm]
         , [g].[BlockWeightChange]
         , [page] = 1 + ((row_number() over(order by [PartNumber])) - 1) / @RowspPage
    from [Goods] [g] with(nolock)
    left join [Brands]    [b] with(nolock) on [g].[BrandID]   = [b].[BrandID]
    left join [Countries] [c] with(nolock) on [b].[CountryID] = [c].[CountryID]
    where [g].[Deleted] = 0 and [g].[PartNumber] = @clearPartNumber --like '%' + @clearPartNumber + '%'
)
, [partsSearch] as 
(
    select * , [maxpage] = max([p].[page]) over()
    from [partsSearch0] [p]
)
select [p].[GoodsID], [p].[Articul], [p].[PartNumber], [p].[DescrEn], [p].[DescrRu]
     , [p].[BrandID], [p].[Brand_Code]
     , [p].[CountryID], [p].[Country_Code], [p].[Country_DescrEn], [p].[Country_DescrRu]
     , [p].[WeightPhysical], [p].[WeightVolumetric], [p].[VolumetricDivider]
     , [p].[LengthCm], [p].[WidthCm], [p].[HeightCm]
     , [p].[BlockWeightChange]
     , [page] = [p].[page]
     , [maxpage] = [p].[maxpage] 
from [partsSearch] [p]
where [page] = @PageNumber