using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{

    [DataContract]
    public class AskQuestion 
    {
        public int Id { get; set; } = 0;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Question { get; set; } = string.Empty;

        public int ParentId { get; set; } = 0;
        public int UserId { get; set; } = 0;
    }
}
