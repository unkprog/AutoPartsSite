select [Id], [Name], [Value]
from [Option] with(nolock) 
where [Name] = @Name
