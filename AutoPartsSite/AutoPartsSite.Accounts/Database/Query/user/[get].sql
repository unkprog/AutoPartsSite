select [Id], [D], [Cd], [Cu], [Ud], [Uu], [Email]
from [User] with(nolock)
where case @field when 'id'    then case when [Id]    = @id    then 1 else 0 end
                  when 'email' then case when [Email] = @email then 1 else 0 end
				  when ''      then 1
				  else 0
	  end = 1
 and [D] = 0