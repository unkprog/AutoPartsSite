select [t].[Code]
from (values('AC DELCO'), ('CHRYSLER'), ('DODGE'), ('JEEP'), ('DAIHATSU')
          , ('GM'), ('HINO'), ('HONDA'), ('HYUNDAI'), ('ISUZU'), ('KIA')
          , ('MAZDA'), ('MITSUBISHI'), ('NISSAN'), ('INFINITY'), ('RENAULT')
          , ('SUBARU'), ('SUZUKI'), ('SUZUKI MOTO'), ('TOYOTA'), ('LEXUS')
          , ('TOYOTA FORKLIFT'), ('VOLVO'), ('YAMAHA')) [t]([Code])
left join [Brands] [b] with(nolock) on [t].[Code] = [b].[Code]
order by [t].[Code]
