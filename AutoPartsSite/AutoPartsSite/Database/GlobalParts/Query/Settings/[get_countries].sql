select [CountryID], [Code], [DescrEn], [DescrRu]
from [Countries] with(nolock)
where [Deleted] = 0 and [Active] = 1
order by [Code]