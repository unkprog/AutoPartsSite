select [IndexName] = [ind].[name]
from [sys].[indexes] [ind] with(nolock) 
inner join [sys].[tables] [t] with(nolock) on [ind].[object_id] = [t].[object_id]
where [t].[name] = 'PricesCustomersInside' and [ind].[name] like 'PricesCustomersInside_idx_%'