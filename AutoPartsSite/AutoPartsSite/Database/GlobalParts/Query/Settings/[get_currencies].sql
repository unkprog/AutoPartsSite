select [CurrencyID], [Code], [Descr], [DescrOnly], [CurrencySymbol], [SymbolShowLeft]
from [dbo].[r_CurrencyGet](@LocaleLanguageID, 0, '')
where (@CurrencyID is null or (not @CurrencyID is null and [CurrencyID] = @CurrencyID)) and (@Code is null or (not @Code is null and [Code] = @Code))