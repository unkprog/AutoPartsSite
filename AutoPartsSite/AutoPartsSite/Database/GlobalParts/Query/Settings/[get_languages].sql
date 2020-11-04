select [LanguageID], [Code], [DescrEn], [DescrRu]
from [Languages] with(nolock)
where [Code] in ('EN', 'RU')
order by [Code]