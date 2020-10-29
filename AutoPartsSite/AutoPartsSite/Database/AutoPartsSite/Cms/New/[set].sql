if not exists(select [Id] from [New] with(nolock) where [Id] = @Id)
begin
  insert into [New] ([ReleaseDate], [HeaderEn], [HeaderRu])
  values(@ReleaseDate, @HeaderEn, @HeaderRu)
  select cast(scope_identity() as int)
end
else begin
  update [New] set [ReleaseDate] = @ReleaseDate, [HeaderEn] = @HeaderEn, [HeaderRu] = @HeaderRu where [Id] = @Id
  select @Id
end
