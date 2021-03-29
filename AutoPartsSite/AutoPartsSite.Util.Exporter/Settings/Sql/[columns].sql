select [pc].[PriceColumnID], [pc].[ColumnIndex], [pc].[ColumnNameInside], [pc].[ColumnNameClient]
from [PricesColumns] [pc] with(nolock) 
where [pc].[PriceFileFormatID] = @PriceFileFormatID 
order by [pc].[ColumnIndex]