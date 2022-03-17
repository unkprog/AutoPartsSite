using System.Collections.Generic;
using System.Collections.Concurrent;

namespace AutoPartsSite.Core.Thread
{
    public sealed class SingleThreadSynchronizationContext : System.Threading.SynchronizationContext
    {
        private readonly BlockingCollection<KeyValuePair<System.Threading.SendOrPostCallback, object>> queue =
            new BlockingCollection<KeyValuePair<System.Threading.SendOrPostCallback, object>>();

        public override void Post(System.Threading.SendOrPostCallback d, object state)
        {
            queue.Add(new KeyValuePair<System.Threading.SendOrPostCallback, object>(d, state));
        }

        public void RunOnCurrentThread()
        {
            while (queue.TryTake(out var workItem, System.Threading.Timeout.Infinite))
            {
                workItem.Key(workItem.Value);
            }
        }

        public void Complete()
        {
            queue.CompleteAdding();
        }
    }
}
