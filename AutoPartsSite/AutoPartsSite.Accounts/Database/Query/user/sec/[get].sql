select [id], [pass]
from [user_sec] with(nolock) 
where [id] = @id
