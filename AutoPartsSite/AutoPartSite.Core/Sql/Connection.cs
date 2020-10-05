using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace AutoPartSite.Core.Sql
{
    [DataContract]
    public class Connection
    {
        [DataMember]
        public string DataSource { get; set; }
        [DataMember]
        public string InitialCatalog { get; set; }
        [DataMember]
        public bool IsSSPI { get; set; }
        [DataMember]
        public string UserID { get; set; }
        [DataMember]
        public string Password { get; set; }


        private static int _ConnectTimeout = 60;
        private static readonly string _ApplicationName = "AutoPartSite.Accounts.Api";

        [IgnoreDataMember]
        public string ConnectionString
        {
            get
            {
                SqlConnectionStringBuilder sqlConnectionStringBuilder = new SqlConnectionStringBuilder();
                sqlConnectionStringBuilder.DataSource = DataSource;
                sqlConnectionStringBuilder.InitialCatalog = InitialCatalog;
                if (IsSSPI)
                    sqlConnectionStringBuilder.IntegratedSecurity = true;
                else
                {
                    sqlConnectionStringBuilder.UserID = UserID;
                    sqlConnectionStringBuilder.Password = Password;
                }
                sqlConnectionStringBuilder.ConnectTimeout = _ConnectTimeout;
                sqlConnectionStringBuilder.ApplicationName = _ApplicationName;

               return sqlConnectionStringBuilder.ToString();
            }
        }
    }
}
