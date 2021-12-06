select [s].[StatusID], [s].[Code], [Descr] = case @LocaleLanguageID when 1 then [s].[DescrRu] when 2 then [s].[DescrEn] else [s].[DescrRu] end
     , [s].[StatusTypeID], [StatusTypeCode] = [st].[Code], [TypeDescr] = case @LocaleLanguageID when 1 then [st].[DescrRu] when 2 then [st].[DescrEn] else [st].[DescrRu] end
from [Statuses] [s] with(nolock)
left join [StatusesTypes] [st] with(nolock) on [s].[StatusTypeID] = [st].[StatusTypeID]
where [s].[Active] = 1 and (@StatusCode is null or (not @StatusCode is null and [s].[Code] = @StatusCode))