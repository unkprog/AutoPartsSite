select [id], [d], [cd], [cu], [ud], [uu], [email]
from [user] with(nolock)
where case @field when 'id'    then case when [id]    = @id    then 1 else 0 end
                  when 'email' then case when [phone] = @email then 1 else 0 end
				  when ''      then 1
				  else 0
	  end = 1
 and [d] = 0