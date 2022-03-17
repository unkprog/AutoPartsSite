using System;


namespace AutoPartsSite.Core.Thread
{
    public static class AsyncContext
    {
        public static void Run(Func<System.Threading.Tasks.Task> func)
        {
            var prevCtx = System.Threading.SynchronizationContext.Current;

            try
            {
                var syncCtx = new SingleThreadSynchronizationContext();

                System.Threading.SynchronizationContext.SetSynchronizationContext(syncCtx);

                var t = func();

                t.ContinueWith(delegate
                {
                    syncCtx.Complete();
                }, System.Threading.Tasks.TaskScheduler.Default);

                syncCtx.RunOnCurrentThread();

                t.GetAwaiter().GetResult();
            }
            finally
            {
                System.Threading.SynchronizationContext.SetSynchronizationContext(prevCtx);
            }
        }
    }
}
