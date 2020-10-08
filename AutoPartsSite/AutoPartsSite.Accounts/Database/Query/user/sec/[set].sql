if exists(select [id] from [user_sec] with(nolock) where [id] = @id)
  update [user_sec] 
  set [pass] = @pass where [id] = @id
else
  insert into [user_sec]([id], [pass])
  select @id, @pass