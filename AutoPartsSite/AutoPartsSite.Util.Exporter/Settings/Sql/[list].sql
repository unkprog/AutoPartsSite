--!!! в таблицах нужно проверять поля [Active] = 1 and [Deleted] = 0 ([Hidden] - это скрывать в интерфейсе, проверять на него не нужно)
select [c].[Active], [Company.ID] = [c].[CompanyID], [Company.Code] = [c].[Code], [Company.OfficialNameEn] = [c].[OfficialNameEn], [Company.OfficialNameRu] = [c].[OfficialNameRu]
     , [Language.ID] = [c].[LanguageId], [Language.Code] = [l].[Code]
     , [Agreement.ID] = [a].[AgreementID], [Agreement.Code] = [a].[Code],  [Agreement.DescrEn] = [a].[DescrEn],  [Agreement.DescrRu] = [a].[DescrRu], [a].[PriceFolder]
--!!! тут непонятно, зачем это берешь, плюс неверные параметры - 'BrandCode' нет такого поля в таблице 'Agreements' - где-то используется этот параметр?
     , [Translation] = (select top 1 [Translation] from [dbo].[GetLocalizationsTablesValue]([c].[LanguageId], 'Agreements', [a].[AgreementID], 'BrandCode'))
 -- флаг - если = true, то расчитываем прайс-листы по соглашению, иначе (флаг = false) не расчитываем
     , [a].[PriceCaclulate]
-- из таблицы [PricesFilesFormats] -  берем необходимые настройки для формирования файлов прайс-листов (см. выше таблицу [PricesFilesFormats])
     , [PriceFileFormat.ID] = [a].[PriceFileFormatID], [PriceFileFormat.Code] = [ff].[Code], [PriceFileFormat.DescrEn] = [ff].[DescrEn], [PriceFileFormat.DescrRu] = [ff].[DescrRu]    
-- из таблицы [PricesFilesCalcTypes] - берем условия, на основе которых производится группировка данных (минимальная цена, максимальное наличие - см. выше таблицу [PricesFilesCalcTypes])
     , [PriceFileCalcType.ID] = [a].[PriceFileCalcTypeID], [PriceFileCalcType.Code] = [pfc].[Code], [PriceFileCalcType.DescrEn] = [pfc].[DescrEn], [PriceFileCalcType.DescrRu] = [pfc].[DescrRu] 
	 , [a].[PriceZeroQty]
     , [a].[PriceFileArchivate]
     , [a].[PriceCurrencyID]
	 , [SeparatorSymbol.ID] = [pff].[SeparatorSymbolID], [SeparatorSymbol.Code] = [ss].[Code], [SeparatorSymbol.Symbol] = [ss].[SymbolUnicode]
	 , [FractionalSymbol.ID] = [pff].[FractionalSymbolID], [FractionalSymbol.Code] = [fs].[Code], [FractionalSymbol.Symbol] = [fs].[SymbolUnicode]
     , [SeparatorReplaceSymbol.ID] = [pff].[SeparatorReplaceSymbolID], [SeparatorReplaceSymbol.Code] = [sr].[Code], [SeparatorReplaceSymbol.Symbol] = [sr].[SymbolUnicode]
     , [pff].[AllBrandsOneFile], [pff].[OneBrandOneFile], [pff].[AnaloguesSeparateFile], [pff].[TariffSeparateFile]
from [Companies] [c] with(nolock)
inner join [Agreements]           [a]   with(nolock) on [a].[Active] = 1 and [a].[Deleted] = 0 and [a].[CompanyID] = [c].[CompanyID] and [a].[PriceCaclulate] = 1
inner join [Languages]            [l]   with(nolock) on [l].[LanguageID] = [c].[LanguageId]
--!!! тут поправил связь
inner join [PricesFilesFormats]   [pff] with(nolock) on [pff].[PriceFileFormatID] = [a].[PriceFileFormatID] 
--!!! и тут поправил связь - до этого брались неверные форматы выгрузки - вместо XLSX - TXT...
inner join [FilesFormats]         [ff]  with(nolock) on [ff].[FileFormatID] = [pff].[FileFormatID] 
inner join [PricesFilesCalcTypes] [pfc] with(nolock) on [pfc].[PriceFileCalcTypeID] = [a].[PriceFileCalcTypeID]
inner join [Symbols]              [ss]  with(nolock) on [ss].[SymbolID] = [pff].[SeparatorSymbolID]
inner join [Symbols]              [fs]  with(nolock) on [fs].[SymbolID] = [pff].[FractionalSymbolID]
inner join [Symbols]              [sr]  with(nolock) on [sr].[SymbolID] = [pff].[SeparatorReplaceSymbolID]
where [c].[Deleted] = 0 and [c].[Active] = 1 and [c].[Customer] = 1