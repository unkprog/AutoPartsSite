select [Id], [Index], [ContentEn], [ContentRu] 
from [Page_Content] [pc] with(nolock)
where [Id] = @Id
order by [Index]