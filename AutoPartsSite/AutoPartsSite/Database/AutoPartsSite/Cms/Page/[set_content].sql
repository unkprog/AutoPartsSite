if not exists(select [Id], [Index] from [Page_Content] with(nolock) where [Id] = @Id and [Index] = @Index)
  insert into [Page_Content] ([Id], [Index], [ContentEn], [ContentRu])
  values(@Id, @Index, @ContentEn, @ContentRu)
else
  update [Page_Content] set [ContentEn] = @ContentEn, [ContentRu] = @ContentRu where  [Id] = @Id and [Index] = @Index
