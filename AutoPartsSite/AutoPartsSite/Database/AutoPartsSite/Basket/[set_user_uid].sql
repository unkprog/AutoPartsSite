if not exists(select [Uid], [User] from [User_UID] [uu] with(nolock) where [uu].[Uid] = @Uid or [uu].[User] = @User)
  insert into [Page_Content] ([Uid], [User])
  values(@Uid, @User)
else
  update [User_UID] set [Uid] = @Uid, [User] = @User where  [Uid] = @Uid or [User] = @User

