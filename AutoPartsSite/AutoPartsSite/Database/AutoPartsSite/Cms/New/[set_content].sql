if not exists(select [Id], [Index] from [New_Content] with(nolock) where [Id] = @Id and [Index] = @Index)
  insert into [New_Content] ([Id], [Index], [ContentEn], [ContentRu])
  values(@Id, @Index, @ContentEn, @ContentRu)
else
  update [New_Content] set [ContentEn] = @ContentEn, [ContentRu] = @ContentRu where  [Id] = @Id and [Index] = @Index
