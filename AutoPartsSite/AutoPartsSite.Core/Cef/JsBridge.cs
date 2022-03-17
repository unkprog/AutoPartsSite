using System;
using System.Collections.Generic;

namespace AutoPartsSite.Core.Cef
{
    public class JsBridge
    {
        Dictionary<string, Action<string>> commands = new Dictionary<string, Action<string>>();

        public void command(string command, string data)
        {
            Action<string> action;
            if (commands.TryGetValue(command, out action))
                action.Invoke(data);
        }

        public void AddCommand(string command, Action<string> action)
        {
            if (!commands.ContainsKey(command))
                commands.Add(command, action);
        }
    }
}
