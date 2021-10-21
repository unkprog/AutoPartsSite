if exists(select [id] from [option] with(nolock) where [Name] = @Name)
  update [option] 
  set [Value] = @Value where [Name] = @name
else
  insert into [option]([Name], [Value])
  select @Name, @Value