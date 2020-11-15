select [g].[GoodsID], [g].[PartNumber], [Brand_Code] = [b].[Code]
     , [page] = 1, [maxpage] = 1
from [Goods] [g] with(nolock)
left join [Brands]    [b] with(nolock) on [g].[BrandID]   = [b].[BrandID]
where [g].[Deleted] = 0 and [g].[GoodsID] in (@GoodsID)