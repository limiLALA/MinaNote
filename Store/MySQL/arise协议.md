## ARIES事务恢复
目前aries已经成为大多数的buffer manager的解决方案

## write ahead log
WAL机制，在写入数据时，先写入redolog，记录内存页级别的变更，再将变更写入具体的内存页。
同时也会写undo log，以方便steal时将内存页腾出给其他的事务。
mysql的mvcc就是基于undo log实现的。

## non force， steal
non force的意思，是说aries并不要求一个事务commit后，一定要把所写的脏页刷入磁盘中。但是redolog一定要完成持久化，这样才能保证宕机后数据不丢失。
如果force，那么事务成功了就保证持久化，无需要redo。

steal的意思，是说允许一个还未提交的事务所写的脏页先刷入磁盘，把内存页交给其他的事务使用。如果一个事务最终需要回滚，则需要
如果no steal，那么磁盘中就不会出现未commit的脏数据，也就不需要undo了。

## lsn
