select [LanguageID], [Code], [DescrEn], [DescrRu]
from [Languages] with(nolock)
where [Code] in ('EN', 'RU') and (@Code is null or (not @Code is null and [Code] = @Code))
order by [Code]