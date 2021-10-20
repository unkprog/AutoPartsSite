using System;
using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{

    [DataContract]
    public class AskQuestion 
    {
        public int Id { get; set; } = 0;
        public DateTime Date { get; set; }
        public string DateStr => Date.ToString("dd.MM.yyyy HH:mm");
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Question { get; set; } = string.Empty;

        public int ParentId { get; set; } = 0;
        public int UserId { get; set; } = 0;
        public int ReplyId { get; set; } = 0;
        public bool EnableReply { get; set; } = false;
    }
}
