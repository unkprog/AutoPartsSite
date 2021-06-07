select [CountryID], [Code], [Descr], [DescrOnly] 
from [dbo].[r_CountryGet](@LocaleLanguageID, 0, '')
where (@CountryID is null or (not @CountryID is null and [CountryID] = @CountryID)) and (@Code is null or (not @Code is null and [Code] = case @Code when 'EN' then '!1' else @Code end))
