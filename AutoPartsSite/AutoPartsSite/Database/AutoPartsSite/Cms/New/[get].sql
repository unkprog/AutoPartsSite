 select [Id], [ReleaseDate], [HeaderEn], [HeaderRu] from [New] [n] with(nolock) where (@Id = 0 or (@Id <> 0 and [n].[Id] = @Id))
