using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{

    [DataContract]
    public class Lang : ReferenceNamedDbModel
    {
    }

    [DataContract]
    public class LangFull : Lang
    {
        public string NameRu { get;set;}
    }
}
