select [CurrencyID], [Code], [DescrEn], [DescrRu]
from [Currencies] with(nolock)
where [Deleted] = 0 and [Active] = 1