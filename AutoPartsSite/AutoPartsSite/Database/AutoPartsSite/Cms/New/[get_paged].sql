;with [newsSearch0] as 
(
    select [n].[Id], [n].[ReleaseDate], [n].[HeaderEn], [n].[HeaderRu]
         , [page] = 1 + ((row_number() over(order by [n].[ReleaseDate])) - 1) / @RowspPage
    from [New] [n] with(nolock)
)
, [newsSearch] as 
(
    select *, [maxpage] = max([n].[page]) over()
    from [newsSearch0] [n]
)
select [n].[Id], [n].[ReleaseDate], [n].[HeaderEn], [n].[HeaderRu]
     , [page] = [n].[page]
     , [maxpage] = [n].[maxpage] 
from [newsSearch] [n]
where [page] = @PageNumber
order by [n].[ReleaseDate] desc