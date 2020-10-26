select [Id], [Index], [ContentEn], [ContentRu] 
from [New_Content] [nc] with(nolock)
where [Id] = @Id
order by [Index]