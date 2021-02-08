select [LanguageID], [Code], [DescrEn], [DescrRu]
from [Languages] with(nolock)
where [LanguageID] = @LanguageID
order by [Code]