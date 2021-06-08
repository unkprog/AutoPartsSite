if @LocaleLanguageID = 0 or @LocaleLanguageID is null
  select top 1 @languageID = [LanguageID]
  from dbo.r_LanguageGet(null, null, isnull(@Code, 'EN'))

select [LanguageID], [Code], [Descr] 
from dbo.r_LanguageGet(@LocaleLanguageID, 0, '')
where (@LanguageID is null or (not @LanguageID is null and [LanguageID] = @LanguageID)) and (@Code is null or (not @Code is null and [Code] = @Code))