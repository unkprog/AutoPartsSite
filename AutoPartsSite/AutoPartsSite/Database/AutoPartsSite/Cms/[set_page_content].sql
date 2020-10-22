if not exists(select [Id], [Page] from [Page_Content] [pc] with(nolock) where [pc].[Id] = @Id and [pc].[Index] = @Index)
  insert into [Page_Content] ([Id], [Index], [ContentEn], [ContentRu])
  values(@Id, @Index, @ContentEn, @ContentRu)
else
  update [Page_Content] set [ContentEn] = @ContentEn, [ContentRu] = @ContentRu where  [pc].[Id] = @Id and [pc].[Index] = @Index
