﻿using System.Collections.Generic;
using System.Runtime.Serialization;
using AutoPartsSite.Models.GlobalParts;

namespace AutoPartsSite.Models.Account
{
    [DataContract]
    public class Settings
    {
        [DataMember]
        public List<Country> Countries { get; set; }

        [DataMember]
        public List<Lang> Languages { get; set; }

        [DataMember]
        public List<Currency> Currencies { get; set; }
    }
}
