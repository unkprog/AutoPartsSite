select [Company.ID] = [c].[CompanyID], [Company.Code] = [c].[Code], [Company.OfficialNameEn] = [c].[OfficialNameEn], [Company.OfficialNameRu] = [c].[OfficialNameRu]
     , [Language.ID] = [c].[LanguageId], [Language.Code] = [l].[Code]
     , [Agreement.ID] = [a].[AgreementID], [Agreement.Code] = [a].[Code],  [Agreement.DescrEn] = [a].[DescrEn],  [Agreement.DescrRu] = [a].[DescrRu]
     , [Translation] = (select top 1 [Translation] from [dbo].[GetLocalizationsTablesValue]([c].[LanguageId], 'Agreements', [a].[AgreementID], 'BrandCode'))
 -- флаг - если = true, то расчитываем прайс-листы по соглашению, иначе (флаг = false) не расчитываем
     , [a].[PriceCaclulate]
-- из таблицы [PricesFilesFormats] -  берем необходимые настройки для формирования файлов прайс-листов (см. выше таблицу [PricesFilesFormats])
     , [PriceFileFormat.ID] = [a].[PriceFileFormatID], [PriceFileFormat.Code] = [ff].[Code], [PriceFileFormat.DescrEn] = [ff].[DescrEn], [PriceFileFormat.DescrRu] = [ff].[DescrRu]    
-- из таблицы [PricesFilesCalcTypes] - берем условия, на основе которых производится группировка данных (минимальная цена, максимальное наличие - см. выше таблицу [PricesFilesCalcTypes])
     , [PriceFileCalcType.ID] = [a].[PriceFileCalcTypeID], [PriceFileCalcType.Code] = [pfc].[Code], [PriceFileCalcType.DescrEn] = [pfc].[DescrEn], [PriceFileCalcType.DescrRu] = [pfc].[DescrRu] 
     , [a].[PriceFileArchivate]
     , [a].[PriceCurrencyID]
from [Companies] [c] with(nolock)
inner join [Agreements]           [a]   with(nolock) on [a].[Active] = 1 and [a].[Hidden] = 0 and [a].[CompanyID] = [c].[CompanyID] and [a].[PriceCaclulate] = 1
inner join [Languages]            [l]   with(nolock) on [l].[LanguageID] = [c].[LanguageId]
inner join [FilesFormats]         [ff]  with(nolock) on [ff].[FileFormatID] = [a].[PriceFileFormatID]
inner join [PricesFilesCalcTypes] [pfc] with(nolock) on [pfc].[PriceFileCalcTypeID] = [a].[PriceFileCalcTypeID]
where [c].[Active] = 1 and [c].[Hidden] = 0 and [c].[Customer] = 1