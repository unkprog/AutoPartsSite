select [pc].[PriceColumnID], [pc].[ColumnIndex], [pc].[ColumnNameInside], [pc].[ColumnNameClient], [pc].[ReplaceSeparator]
from [PricesColumns] [pc] with(nolock) 
where [pc].[PriceFileFormatID] = @PriceFileFormatID 
order by [pc].[ColumnIndex]