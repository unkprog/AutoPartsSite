select [CountryID], [Code], [DescrEn], [DescrRu]
from [Countries] with(nolock)
where [Deleted] = 0 and [Active] = 1 and (@Code is null or (not @Code is null and [Code] = @Code))
order by [Code]