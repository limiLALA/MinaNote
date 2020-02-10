
## join
A线程调用了B线程的join()，意味着A要等待B执行完才能继续执行A。
```Java
public final void join() throws InterruptedException {
    join(0);
}
public final synchronized void join(long millis) throws InterruptedException {
    long base = System.currentTimeMillis();
    long now = 0;

    if (millis < 0) {
        throw new IllegalArgumentException("timeout value is negative");
    }

    if (millis == 0) {
        while (isAlive()) {//轮询：调用isAlive()的线程对象this（子线程）尚未结束
            wait(0);//父线程继续等待
        }
    } else {
        while (isAlive()) {
            long delay = millis - now;
            if (delay <= 0) {
                break;
            }
            wait(delay);
            now = System.currentTimeMillis() - base;
        }
    }
}
```
