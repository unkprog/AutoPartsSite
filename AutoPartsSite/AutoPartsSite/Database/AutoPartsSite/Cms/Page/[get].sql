if not exists(select [Id], [Page] from [Page] [p] with(nolock) where [p].[Page] = @Page)
  insert into [Page]([Page]) values(@Page)

select [Id], [Page] from [Page] [p] with(nolock) where [p].[Page] = @Page