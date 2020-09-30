using System.Runtime.Serialization;

namespace AutoPartSite.Core.Models.Security
{
    public class UserModel
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string Email { get; set; }
    }
}
