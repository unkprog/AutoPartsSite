select [CurrencyID], [Code], [DescrEn], [DescrRu]
from [Currencies] with(nolock)
where [Deleted] = 0 and [Active] = 1 and (@Code is null or (not @Code is null and [Code] = @Code))
order by [Code]