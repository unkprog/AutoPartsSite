declare @languageID int 
if @LocaleLanguageID = 0 or @LocaleLanguageID is null
  select top 1 @languageID =[LanguageID]
  from dbo.r_LanguageGet(null, null, isnull(@Code, 'EN'))
else 
  select @languageID = @LocaleLanguageID

select [LanguageID], [Code], [Descr] 
from dbo.r_LanguageGet(@languageID, 0, '')
where (@LocaleLanguageID is null or (not @LocaleLanguageID is null and [LanguageID] = @LocaleLanguageID)) and (@Code is null or (not @Code is null and [Code] = @Code))