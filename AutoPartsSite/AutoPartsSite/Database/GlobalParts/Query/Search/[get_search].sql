declare @clearPartNumber nvarchar(50) = [dbo].[GetClearPartNumber](@PartNumber)

;with [partsSearch0] as 
(
    select [g].[GoodsID], [g].[PartNumber], [Brand_Code] = [b].[Code]
         , [page] = 1 + ((row_number() over(order by [PartNumber])) - 1) / @RowspPage
    from [Goods]       [g] with(nolock)
    left join [Brands] [b] with(nolock) on [g].[BrandID]   = [b].[BrandID]
    where [g].[Deleted] = 0 and [g].[PartNumber] = @clearPartNumber --like '%' + @clearPartNumber + '%'
)
, [partsSearch] as 
(
    select * , [maxpage] = max([p].[page]) over()
    from [partsSearch0] [p]
)
select [p].[GoodsID], [p].[PartNumber], [p].[Brand_Code], [page] = [p].[page], [maxpage] = [p].[maxpage] 
from [partsSearch] [p]
where [page] = @PageNumber