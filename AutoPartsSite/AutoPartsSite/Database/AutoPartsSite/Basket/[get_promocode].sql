declare @retId int = isnull((select top 1 [Id] from [Basket_Header] [bh] with(nolock) where [bh].[Uid] = @Uid), 0)
if @retId = 0
  select [PromoCode] = ''
else 
  select top 1 [PromoCode] from [Basket_Header] [bh] with(nolock) where [bh].[Id] = @retId
