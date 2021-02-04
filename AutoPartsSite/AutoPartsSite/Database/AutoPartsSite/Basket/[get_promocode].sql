select [PromoCode] = isnull((select top 1 [PromoCode] from [Basket_Header] with(nolock) where [Uid] = @Uid), '')
