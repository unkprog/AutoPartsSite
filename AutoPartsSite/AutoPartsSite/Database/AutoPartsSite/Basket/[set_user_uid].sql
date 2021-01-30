declare @retId int = isnull((select top 1 [Id] from [User_UID] [uu] with(nolock) where [uu].[Uid] = @Uid or [uu].[User] = @User), 0)
if @retId = 0
begin
  insert into [User_UID] ([Uid], [User])
  values(@Uid, @User)
  select cast(scope_identity() as int)
end
else begin
  update [User_UID] set [Uid] = @Uid, [User] = @User where [Id] = @retId
  select @retId
end

